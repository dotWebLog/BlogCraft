import React from 'react';
import { BlogPost } from '../types/blog';
import { parseMarkdown } from '../utils/markdown';
import { ArrowLeft, Calendar, User, Tag, Edit3 } from 'lucide-react';

interface PostViewerProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: () => void;
}

export const PostViewer: React.FC<PostViewerProps> = ({ post, onBack, onEdit }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Posts</span>
        </button>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 size={18} />
          <span>Edit Post</span>
        </button>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag size={16} />
                <span>{post.category}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.published ? 'Published' : 'Draft'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div 
            className="prose max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} 
          />
        </div>
      </article>
    </div>
  );
};