import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  size = 'base'
}) => {
  // Map size to Tailwind's Typography size classes
  const sizeClasses = {
    xs: 'prose-xs',
    sm: 'prose-sm',
    base: 'prose',
    lg: 'prose-lg',
    xl: 'prose-xl'
  };

  return (
    <div className={`prose ${sizeClasses[size]} dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 