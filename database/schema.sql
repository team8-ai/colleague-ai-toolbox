-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the ai_hub_app schema if it doesn't exist
create schema if not exists ai_hub_app;

-- Users table
CREATE TABLE ai_hub_app.users (
    uid VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tools table
CREATE TABLE ai_hub_app.tools (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_uid VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by_uid) REFERENCES ai_hub_app.users(uid) ON DELETE CASCADE
);

-- News table
CREATE TABLE ai_hub_app.news (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_uid VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by_uid) REFERENCES ai_hub_app.users(uid) ON DELETE CASCADE
);

-- Podcasts table
CREATE TABLE ai_hub_app.podcasts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT NOT NULL,
    duration INTEGER, -- Duration in seconds
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_uid VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by_uid) REFERENCES ai_hub_app.users(uid) ON DELETE CASCADE
);

-- Content type enum
CREATE TYPE content_type AS ENUM ('tool', 'news', 'podcast');

-- Comments table with polymorphic association
CREATE TABLE ai_hub_app.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type content_type NOT NULL,
    content_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_uid VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by_uid) REFERENCES ai_hub_app.users(uid) ON DELETE CASCADE
);

-- Likes table with polymorphic association
CREATE TABLE ai_hub_app.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type content_type NOT NULL,
    content_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by_uid VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by_uid) REFERENCES ai_hub_app.users(uid) ON DELETE CASCADE,
    -- Ensure each user can only like each content once
    UNIQUE (content_type, content_id, created_by_uid)
);

-- Tags table
CREATE TABLE ai_hub_app.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Content Tags with polymorphic association
CREATE TABLE ai_hub_app.content_tags (
    content_type content_type NOT NULL,
    content_id VARCHAR(255) NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (content_type, content_id, tag_id),
    FOREIGN KEY (tag_id) REFERENCES ai_hub_app.tags(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_comments_content ON ai_hub_app.comments(content_type, content_id);
CREATE INDEX idx_likes_content ON ai_hub_app.likes(content_type, content_id);
CREATE INDEX idx_content_tags_content ON content_tags(content_type, content_id);
CREATE INDEX idx_content_tags_tag_id ON content_tags(tag_id);
CREATE INDEX idx_likes_user_id ON ai_hub_app.likes(created_by_uid);
CREATE INDEX idx_comments_user_id ON ai_hub_app.comments(created_by_uid);

-- Materialized view for content with like counts (for performance)
CREATE MATERIALIZED VIEW content_like_counts AS
SELECT 'tool' AS content_type, tools.id AS content_id, COUNT(*) AS likes_count
FROM ai_hub_app.tools
LEFT JOIN ai_hub_app.likes ON likes.content_type = 'tool' AND likes.content_id = tools.id
GROUP BY tools.id
UNION ALL
SELECT 'news' AS content_type, news.id AS content_id, COUNT(*) AS likes_count
FROM ai_hub_app.news
LEFT JOIN ai_hub_app.likes ON likes.content_type = 'news' AND likes.content_id = news.id
GROUP BY news.id
UNION ALL
SELECT 'podcast' AS content_type, podcasts.id AS content_id, COUNT(*) AS likes_count
FROM ai_hub_app.podcasts
LEFT JOIN ai_hub_app.likes ON likes.content_type = 'podcast' AND likes.content_id = podcasts.id
GROUP BY podcasts.id;

-- Function to refresh like counts materialized view
CREATE OR REPLACE FUNCTION refresh_content_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW content_like_counts;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh the materialized view when likes change
CREATE TRIGGER refresh_like_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON ai_hub_app.likes
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_content_like_counts();