# Database Schema for Colleague AI Toolbox

This directory contains the PostgreSQL database schema and sample data for the Colleague AI Toolbox application.

## Files

- `schema.sql` - Contains the complete database schema with tables, relationships, and indexes
- `sample_data.sql` - Contains sample data to populate the database for development and testing

## Database Structure

The database consists of the following tables:

### Users
Stores user account information:
- `uid` - Unique identifier for the user (primary key)
- `email` - User's email address (unique)
- `display_name` - User's display name
- `photo_url` - URL to the user's profile photo
- `created_at` - When the user was created
- `last_login` - When the user last logged in

### Content Tables

#### Tools
Stores information about AI tools:
- `id` - Unique identifier for the tool (primary key)
- `name` - Name of the tool
- `description` - Detailed description of the tool
- `image_url` - URL to the tool's image
- `url` - URL to the tool's website
- `created_at` - When the tool was added
- `created_by_uid` - References the user who added the tool

#### News
Stores news articles:
- `id` - Unique identifier for the news item (primary key)
- `title` - Title of the news article
- `content` - Content of the news article
- `image_url` - URL to an image for the news
- `url` - URL to the full news article
- `created_at` - When the news was added
- `created_by_uid` - References the user who added the news

#### Podcasts
Stores podcast episodes:
- `id` - Unique identifier for the podcast (primary key)
- `title` - Title of the podcast episode
- `description` - Description of the podcast episode
- `image_url` - URL to the podcast cover image
- `audio_url` - URL to the podcast audio file
- `duration` - Duration of the podcast in seconds
- `created_at` - When the podcast was added
- `created_by_uid` - References the user who added the podcast

### Interaction Tables (Polymorphic Associations)

#### Comments
Stores user comments on any content type:
- `id` - Unique identifier for the comment (primary key, UUID)
- `content_type` - Type of content being commented on ('tool', 'news', 'podcast')
- `content_id` - ID of the content being commented on
- `text` - Comment text content
- `created_at` - When the comment was created
- `created_by_uid` - References the user who created the comment

#### Likes
Tracks which users like which content:
- `id` - Unique identifier for the like (primary key, UUID)
- `content_type` - Type of content being liked ('tool', 'news', 'podcast')
- `content_id` - ID of the content being liked
- `created_at` - When the like was added
- `created_by_uid` - References the user who added the like
- Unique constraint on (content_type, content_id, created_by_uid) ensures a user can only like content once

### Tags
Stores categories/tags for all content types:
- `id` - Unique identifier for the tag (primary key, auto-incrementing)
- `name` - Tag name (unique)

### Content Tags
Many-to-many relationship between content and tags:
- `content_type` - Type of content being tagged ('tool', 'news', 'podcast')
- `content_id` - ID of the content being tagged
- `tag_id` - References a tag
- Primary key is the combination of all three fields

### Performance Optimizations

#### Materialized View: Content Like Counts
A materialized view that pre-calculates like counts for all content types:
- `content_type` - Type of content ('tool', 'news', 'podcast')
- `content_id` - ID of the content
- `likes_count` - Number of likes for this content

## Setup Instructions

1. Create a new PostgreSQL database:

```bash
createdb colleague_ai_toolbox
```

2. Apply the schema:

```bash
psql -d colleague_ai_toolbox -f schema.sql
```

3. Load the sample data (optional):

```bash
psql -d colleague_ai_toolbox -f sample_data.sql
```

## Entity Relationship Diagram

```
Users 1 --- * Content (Tools/News/Podcasts) (created_by)
Content * --- * Tags (through Content_Tags)
Content * --- * Likes (polymorphic)
Content * --- * Comments (polymorphic)
Users 1 --- * Comments (created_by)
Users 1 --- * Likes (created_by)
```

## Polymorphic Associations

This schema uses a polymorphic association pattern to allow comments and likes to be associated with any content type (tools, news, or podcasts). The `content_type` field identifies the type of content, and the `content_id` field stores the ID of the specific content item.

Benefits of this approach:
- Flexibility to add new content types without changing the schema
- Consistent interface for likes and comments across all content types
- Efficient queries for retrieving all comments or likes for a specific content item

## Notes

- The schema uses PostgreSQL-specific features like UUID generation, ENUM types, and materialized views
- Foreign keys are set up with CASCADE deletion to maintain referential integrity
- Indexes are created for performance on frequently queried columns
- Triggers automatically refresh the materialized view when likes change 