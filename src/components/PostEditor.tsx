import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';
import { generateSlug, extractExcerpt, parseMarkdown } from '../utils/markdown';
import { Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface PostEditorProps {
  post?: BlogPost | null;
  onSavePost: (post: BlogPost) => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ post, onSavePost, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setTags(post.tags.join(', '));
      setAuthor(post.author);
      setPublished(post.published);
    } else {
      // Reset form for new post
      setTitle('');
      setContent('');
      setCategory('General');
      setTags('');
      setAuthor('Blog Author');
      setPublished(false);
    }
  }, [post]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id: post?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      excerpt: extractExcerpt(content),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: category.trim() || 'General',
      author: author.trim() || 'Blog Author',
      createdAt: post?.createdAt || now,
      updatedAt: now,
      published,
      slug: generateSlug(title)
    };

    onSavePost(newPost);
  };

  const canSave = title.trim() && content.trim();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-900">
            {post ? 'Edit Post' : 'Write New Post'}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            <span>Save {published ? 'Published' : 'Draft'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {!showPreview ? (
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title..."
                  className="w-full text-4xl font-bold border-none outline-none focus:ring-0 placeholder-gray-300"
                />
              </div>
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post in Markdown..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">{title || 'Untitled Post'}</h1>
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Technology, Travel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, javascript, web"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Markdown Cheatsheet</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div># Heading 1</div>
              <div>## Heading 2</div>
              <div>**Bold text**</div>
              <div>*Italic text*</div>
              <div>[Link](https://example.com)</div>
              <div>`Inline code`</div>
              <div>```Code block```</div>
              <div>* List item</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};