import React from 'react';
import { BlogPost } from '../types/blog';
import { Edit3, Trash2, Eye, Calendar, Tag } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onViewPost: (post: BlogPost) => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onEditPost,
  onDeletePost,
  onViewPost
}) => {
  const publishedPosts = posts.filter(post => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const draftPosts = posts.filter(post => !post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag size={14} />
              <span>{post.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onViewPost(post)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEditPost(post)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDeletePost(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {post.tags.map(tag => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Posts</h2>
        <div className="text-sm text-gray-600">
          {publishedPosts.length} published • {draftPosts.length} drafts
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Edit3 size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No posts yet</h3>
          <p className="text-gray-500">Start writing your first blog post!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {publishedPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Published Posts</h3>
              <div className="grid gap-6">
                {publishedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {draftPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Drafts</h3>
              <div className="grid gap-6">
                {draftPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};