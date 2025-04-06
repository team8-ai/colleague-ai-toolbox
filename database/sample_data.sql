-- Sample Users
INSERT INTO ai_hub_app.users (uid, email, display_name, photo_url) VALUES
('user1', 'user1@example.com', 'Alex Johnson', 'https://i.pravatar.cc/150?u=user1@example.com'),
('user2', 'user2@example.com', 'Sam Rodriguez', 'https://i.pravatar.cc/150?u=user2@example.com'),
('user3', 'user3@example.com', 'Taylor Kim', 'https://i.pravatar.cc/150?u=user3@example.com'),
('user4', 'user4@example.com', 'Jordan Patel', NULL);

-- Sample Tags
INSERT INTO ai_hub_app.tags (name) VALUES
('AI'),
('Research'),
('Literature Review'),
('Academic'),
('RAG'),
('Automation'),
('Computer Use'),
('Framework'),
('Visual Development'),
('Design to Code'),
('CMS'),
('Headless'),
('Diagramming'),
('Documentation'),
('Developer Tools'),
('Markdown'),
('Collaboration'),
('Multimodal'),
('Agents'),
('Vector DB'),
('Open Source'),
('News'),
('AI Ethics'),
('Podcast'),
('Tutorial');

-- Sample Tools
INSERT INTO ai_hub_app.tools (id, name, description, image_url, url, created_at, created_by_uid) VALUES
('tool-litllm', 'LitLLM', 'A powerful AI toolkit that transforms how researchers write literature reviews, using advanced Retrieval-Augmented Generation (RAG) to create accurate, well-structured related work sections in seconds rather than days.', 'https://litllm.github.io/static/images/litllm.png', 'https://litllm.github.io/', NOW() - INTERVAL '5 days', 'user1'),
('simular', 'Agent S2', 'An open, modular, and scalable framework for computer-use agents that can observe, reason, and perform tasks by directly interacting with graphical user interfaces. These autonomous AI agents function as intelligent intermediaries between human users and their digital tools.', 'https://github.com/simular-ai/Agent-S/raw/main/images/agent_s2_teaser.png', 'https://www.simular.ai/', NOW() - INTERVAL '45 days', 'user2'),
('tool-builder', 'Builder.io', 'AI-powered visual development platform that accelerates digital teams with design-to-code conversion, visual editing, and enterprise CMS capabilities. Turn Figma designs into production-ready code and enable marketers to build pages without engineering.', 'https://camo.githubusercontent.com/f4fd0404b33a2a3189702359b45ce2297972d63235e158bf18670bb539b84be8/68747470733a2f2f63646e2e6275696c6465722e696f2f6170692f76312f696d6167652f617373657473253246594a494762346930316a7677305352644c3542742532463936666139366637663561303431356639646666343062343164373862366137', 'https://www.builder.io/', NOW() - INTERVAL '2 days', 'user2'),
('tool-mermaid', 'Mermaid Chart', 'A collaborative diagramming tool that lets you create and share diagrams using text and code. Create flowcharts, sequence diagrams, Gantt charts, and more using Mermaid''s simple markdown-like syntax.', 'https://static.mermaidchart.dev/assets/logo-mermaid.svg', 'https://www.mermaidchart.com/', NOW() - INTERVAL '3 days', 'user3'),
('tool-agno', 'Agno', 'A lightning-fast, lightweight library for building Multimodal Agents. Create AI agents that can generate text, image, audio and video, with built-in memory, knowledge, tools and reasoning capabilities. 10,000x faster than LangGraph and model-agnostic.', 'https://cdn.prod.website-files.com/6796d350b8c706e4533e7e32/6796d350b8c706e4533e8011_Agno%20Logo.png', 'https://www.agno.com/', NOW() - INTERVAL '1 day', 'user4');

-- Sample News
INSERT INTO ai_hub_app.news (id, title, content, image_url, url, created_at, created_by_uid) VALUES
('news-1', 'OpenAI Announces GPT-5', 'OpenAI has announced the development of GPT-5, which will feature significant improvements in reasoning capabilities and multimodal understanding.', 'https://example.com/news/gpt5.jpg', 'https://example.com/news/openai-gpt5', NOW() - INTERVAL '2 days', 'user1'),
('news-2', 'Google Releases New AI Ethics Guidelines', 'Google has published a comprehensive set of AI ethics guidelines that emphasize transparency, fairness, and safety in AI systems.', 'https://example.com/news/google-ethics.jpg', 'https://example.com/news/google-ai-ethics', NOW() - INTERVAL '5 days', 'user2'),
('news-3', 'Meta Introduces New Open Source LLM', 'Meta has released a new open source large language model that achieves state-of-the-art performance while being more efficient to run.', 'https://example.com/news/meta-llm.jpg', 'https://example.com/news/meta-new-llm', NOW() - INTERVAL '1 day', 'user3');

-- Sample Podcasts
INSERT INTO ai_hub_app.podcasts (id, title, description, image_url, audio_url, duration, created_at, created_by_uid) VALUES
('podcast-1', 'The Future of AI Development', 'A discussion about the future trends in AI development with leading researchers and practitioners.', 'https://example.com/podcasts/future-ai.jpg', 'https://example.com/podcasts/future-ai.mp3', 3600, NOW() - INTERVAL '10 days', 'user2'),
('podcast-2', 'Ethical Considerations in AI', 'Exploring the ethical implications of advanced AI systems and how developers can address them.', 'https://example.com/podcasts/ethics.jpg', 'https://example.com/podcasts/ethics-ai.mp3', 2700, NOW() - INTERVAL '15 days', 'user3'),
('podcast-3', 'Building with AI Tools', 'A practical guide to incorporating AI tools into your development workflow for increased productivity.', 'https://example.com/podcasts/ai-tools.jpg', 'https://example.com/podcasts/building-ai-tools.mp3', 3200, NOW() - INTERVAL '5 days', 'user1');

-- Sample Documents
INSERT INTO ai_hub_app.documents (id, title, description, thumbnail_url, content, created_at, created_by_uid) VALUES
('doc-1', 'Getting Started with AI Tools', 'A beginner''s guide to using artificial intelligence tools effectively.', NULL, '# Getting Started with AI Tools

## Introduction
This document will guide you through the basics of using AI tools effectively.

## Key Concepts
- Understanding AI limitations
- Prompt engineering basics
- Data privacy considerations

## Best Practices
1. Be specific in your requests
2. Review AI outputs carefully
3. Maintain human oversight', NOW() - INTERVAL '7 days', 'user1'),

('doc-2', 'Advanced Prompt Engineering', 'Learn techniques for creating effective prompts for language models.', NULL, '# Advanced Prompt Engineering

## Introduction
Prompt engineering is the art of communicating effectively with language models.

## Techniques
- Chain-of-thought prompting
- Few-shot learning
- Instruction fine-tuning

## Case Studies
Examples of before/after prompts and their results.', NOW() - INTERVAL '14 days', 'user2'),

('doc-3', 'AI Ethics Guidelines', 'A comprehensive guide to ethical considerations when building AI systems.', NULL, '# AI Ethics Guidelines

## Introduction
This document outlines important ethical considerations for AI development.

## Core Principles
- Fairness and bias mitigation
- Transparency and explainability
- Privacy and data protection
- Safety and robustness

## Implementation Strategies
1. Diverse training data
2. Regular auditing
3. User consent frameworks
4. Human oversight', NOW() - INTERVAL '3 days', 'user3');

-- Content Tags relationships
-- Tool tags
INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'tool', 'tool-litllm', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Research', 'Literature Review', 'Academic', 'RAG');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'tool', 'simular', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Automation', 'Computer Use', 'Framework');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'tool', 'tool-builder', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Visual Development', 'Design to Code', 'CMS', 'Headless');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'tool', 'tool-mermaid', id FROM ai_hub_app.tags WHERE name IN ('Diagramming', 'Documentation', 'Developer Tools', 'Markdown', 'Collaboration');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'tool', 'tool-agno', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Multimodal', 'Agents', 'Vector DB', 'Open Source');

-- News tags
INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'news', 'news-1', id FROM ai_hub_app.tags WHERE name IN ('AI', 'News');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'news', 'news-2', id FROM ai_hub_app.tags WHERE name IN ('AI', 'News', 'AI Ethics');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'news', 'news-3', id FROM ai_hub_app.tags WHERE name IN ('AI', 'News', 'Open Source');

-- Podcast tags
INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'podcast', 'podcast-1', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Podcast', 'Research');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'podcast', 'podcast-2', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Podcast', 'AI Ethics');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'podcast', 'podcast-3', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Podcast', 'Tutorial', 'Developer Tools');

-- Document tags
INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'document', 'doc-1', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Tutorial', 'Documentation');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'document', 'doc-2', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Documentation', 'Tutorial', 'Research');

INSERT INTO content_tags (content_type, content_id, tag_id)
SELECT 'document', 'doc-3', id FROM ai_hub_app.tags WHERE name IN ('AI', 'Documentation', 'AI Ethics', 'Research');

-- Likes
-- Tool likes
INSERT INTO ai_hub_app.likes (content_type, content_id, created_by_uid) VALUES
('tool', 'tool-litllm', 'user1'),
('tool', 'tool-litllm', 'user2'),
('tool', 'simular', 'user2'),
('tool', 'simular', 'user3'),
('tool', 'tool-builder', 'user1'),
('tool', 'tool-builder', 'user3'),
('tool', 'tool-builder', 'user4'),
('tool', 'tool-mermaid', 'user2'),
('tool', 'tool-mermaid', 'user4'),
('tool', 'tool-agno', 'user1'),
('tool', 'tool-agno', 'user2'),
('tool', 'tool-agno', 'user3');

-- News likes
INSERT INTO ai_hub_app.likes (content_type, content_id, created_by_uid) VALUES
('news', 'news-1', 'user1'),
('news', 'news-1', 'user2'),
('news', 'news-1', 'user3'),
('news', 'news-2', 'user2'),
('news', 'news-2', 'user4'),
('news', 'news-3', 'user1'),
('news', 'news-3', 'user3');

-- Podcast likes
INSERT INTO ai_hub_app.likes (content_type, content_id, created_by_uid) VALUES
('podcast', 'podcast-1', 'user2'),
('podcast', 'podcast-1', 'user3'),
('podcast', 'podcast-2', 'user1'),
('podcast', 'podcast-2', 'user4'),
('podcast', 'podcast-3', 'user1'),
('podcast', 'podcast-3', 'user2'),
('podcast', 'podcast-3', 'user3');

-- Document likes
INSERT INTO ai_hub_app.likes (content_type, content_id, created_by_uid) VALUES
('document', 'doc-1', 'user2'),
('document', 'doc-1', 'user3'),
('document', 'doc-1', 'user4'),
('document', 'doc-2', 'user1'),
('document', 'doc-2', 'user3'),
('document', 'doc-3', 'user1'),
('document', 'doc-3', 'user2'),
('document', 'doc-3', 'user4');

-- Comments
-- Tool comments
INSERT INTO ai_hub_app.comments (content_type, content_id, text, created_at, created_by_uid) VALUES
('tool', 'tool-litllm', 'LitLLM has completely transformed how I work. The responses are incredibly helpful!', NOW() - INTERVAL '50 days', 'user2'),
('tool', 'tool-litllm', 'Great for brainstorming ideas, but sometimes it makes up information.', NOW() - INTERVAL '40 days', 'user3'),
('tool', 'simular', 'Agent S2 creates amazing automation! I use it for all my creative projects now.', NOW() - INTERVAL '30 days', 'user1'),
('tool', 'tool-mermaid', 'Mermaid Chart has made me much more productive. Highly recommended for developers!', NOW() - INTERVAL '20 days', 'user4'),
('tool', 'tool-mermaid', 'It sometimes has quirks with complex diagrams, but overall it''s a huge time-saver.', NOW() - INTERVAL '15 days', 'user1'),
('tool', 'tool-agno', 'Agno has made building agents so much faster.', NOW() - INTERVAL '10 days', 'user3');

-- News comments
INSERT INTO ai_hub_app.comments (content_type, content_id, text, created_at, created_by_uid) VALUES
('news', 'news-1', 'This is exciting! Can''t wait to see what GPT-5 can do.', NOW() - INTERVAL '2 days', 'user1'),
('news', 'news-1', 'I hope they address the hallucination issues from previous models.', NOW() - INTERVAL '1 day', 'user3'),
('news', 'news-2', 'It''s great to see more focus on ethical AI development.', NOW() - INTERVAL '4 days', 'user4'),
('news', 'news-3', 'Open source models are the future. Great move by Meta!', NOW() - INTERVAL '1 day', 'user2');

-- Podcast comments
INSERT INTO ai_hub_app.comments (content_type, content_id, text, created_at, created_by_uid) VALUES
('podcast', 'podcast-1', 'Great discussion! Loved the insights about multimodal models.', NOW() - INTERVAL '9 days', 'user3'),
('podcast', 'podcast-2', 'Important topic that every AI developer should consider.', NOW() - INTERVAL '14 days', 'user1'),
('podcast', 'podcast-3', 'Very practical advice. I''ve started using some of these tools in my workflow.', NOW() - INTERVAL '4 days', 'user4');

-- Document comments
INSERT INTO ai_hub_app.comments (content_type, content_id, text, created_at, created_by_uid) VALUES
('document', 'doc-1', 'This is an excellent introduction for beginners. Very clear explanations!', NOW() - INTERVAL '6 days', 'user2'),
('document', 'doc-1', 'I would add a section about model selection for different tasks.', NOW() - INTERVAL '5 days', 'user3'),
('document', 'doc-2', 'The techniques section was particularly helpful for my work.', NOW() - INTERVAL '10 days', 'user1'),
('document', 'doc-3', 'Great comprehensive overview of AI ethics. Should be required reading.', NOW() - INTERVAL '2 days', 'user4');

-- Refresh the materialized view to get accurate like counts
REFRESH MATERIALIZED VIEW content_like_counts;