import React, { useState, useEffect } from 'react';
import { BlogPost, BlogConfig } from './types/blog';
import { storage } from './utils/storage';
import { exportBlog } from './utils/export';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import { PostEditor } from './components/PostEditor';
import { PostViewer } from './components/PostViewer';
import { Settings } from './components/Settings';
import { Sidebar } from './components/Sidebar';

function App() {
  const [currentView, setCurrentView] = useState('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [config, setConfig] = useState<BlogConfig>({
    title: 'My Blog',
    description: 'A beautiful blog powered by GitHub Pages',
    author: 'Blog Author',
    url: 'https://username.github.io',
    theme: 'modern',
    ads: []
  });
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const savedPosts = storage.getPosts();
    const savedConfig = storage.getConfig();
    setPosts(savedPosts);
    setConfig(savedConfig);
  }, []);

  const handleSavePost = (post: BlogPost) => {
    const updatedPosts = posts.find(p => p.id === post.id)
      ? posts.map(p => p.id === post.id ? post : p)
      : [...posts, post];
    
    setPosts(updatedPosts);
    storage.savePosts(updatedPosts);
    setEditingPost(null);
    setCurrentView('posts');
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      storage.savePosts(updatedPosts);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setCurrentView('editor');
  };

  const handleViewPost = (post: BlogPost) => {
    setViewingPost(post);
    setCurrentView('viewer');
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setCurrentView('editor');
  };

  const handleSaveConfig = (newConfig: BlogConfig) => {
    setConfig(newConfig);
    storage.saveConfig(newConfig);
  };

  const handleExport = async () => {
    try {
      await exportBlog(posts, config);
      alert('Blog exported successfully! Check your downloads folder for blog-export.zip containing all your blog files.');
    } catch (error) {
      alert('Download failed. Please try again.');
    }
  };

  const handleViewChange = (view: string) => {
    if (view === 'editor' && currentView !== 'editor') {
      setEditingPost(null);
    }
    setCurrentView(view);
    setViewingPost(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'posts':
        return (
          <PostList
            posts={posts}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onViewPost={handleViewPost}
          />
        );
      case 'editor':
        return (
          <PostEditor
            post={editingPost}
            onSavePost={handleSavePost}
            onCancel={() => setCurrentView('posts')}
          />
        );
      case 'viewer':
        return viewingPost ? (
          <PostViewer
            post={viewingPost}
            onBack={() => setCurrentView('posts')}
            onEdit={() => handleEditPost(viewingPost)}
          />
        ) : null;
      case 'settings':
        return (
          <Settings
            config={config}
            onSaveConfig={handleSaveConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        onExport={handleExport}
      />
      <div className="flex flex-1">
        <main className="flex-1">
          {renderCurrentView()}
        </main>
        {currentView === 'posts' && (
          <Sidebar 
            posts={posts} 
            ads={config.ads}
            onPostSelect={handleViewPost}
          />
        )}
      </div>
      
      {currentView === 'posts' && (
        <button
          onClick={handleNewPost}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
          title="Write new post"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;