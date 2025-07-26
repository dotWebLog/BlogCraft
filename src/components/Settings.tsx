import React, { useState, useEffect } from 'react';
import { BlogConfig, Advertisement } from '../types/blog';
import { Save, Plus, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';

interface SettingsProps {
  config: BlogConfig;
  onSaveConfig: (config: BlogConfig) => void;
}

export const Settings: React.FC<SettingsProps> = ({ config, onSaveConfig }) => {
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [author, setAuthor] = useState(config.author);
  const [url, setUrl] = useState(config.url);
  const [ads, setAds] = useState<Advertisement[]>(config.ads || []);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);

  useEffect(() => {
    setTitle(config.title);
    setDescription(config.description);
    setAuthor(config.author);
    setUrl(config.url);
    setAds(config.ads || []);
  }, [config]);

  const handleAddAd = () => {
    const newAd: Advertisement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      buttonText: 'Learn More',
      buttonUrl: '#',
      type: 'advertisement',
      color: 'blue',
      enabled: true
    };
    setEditingAd(newAd);
    setShowAdForm(true);
  };

  const handleEditAd = (ad: Advertisement) => {
    setEditingAd({ ...ad });
    setShowAdForm(true);
  };

  const handleSaveAd = () => {
    if (!editingAd || !editingAd.title.trim() || !editingAd.description.trim()) return;

    const updatedAds = ads.find(a => a.id === editingAd.id)
      ? ads.map(a => a.id === editingAd.id ? editingAd : a)
      : [...ads, editingAd];

    setAds(updatedAds);
    setEditingAd(null);
    setShowAdForm(false);
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      setAds(ads.filter(a => a.id !== id));
    }
  };

  const handleToggleAd = (id: string) => {
    setAds(ads.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleCancelAdEdit = () => {
    setEditingAd(null);
    setShowAdForm(false);
  };

  const handleSave = () => {
    const updatedConfig: BlogConfig = {
      ...config,
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      url: url.trim(),
      ads
    };
    onSaveConfig(updatedConfig);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-50 to-indigo-100 border-blue-200 text-blue-600',
      green: 'from-green-50 to-emerald-100 border-green-200 text-green-600',
      purple: 'from-purple-50 to-violet-100 border-purple-200 text-purple-600',
      orange: 'from-orange-50 to-amber-100 border-orange-200 text-orange-600',
      red: 'from-red-50 to-rose-100 border-red-200 text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Blog Settings</h2>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Blog Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Blog Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Awesome Blog"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="A brief description of your blog"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://username.github.io"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your GitHub Pages URL where the blog will be published
              </p>
            </div>
          </div>
        </div>

        {/* Ads Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Advertisement Management</h3>
            <button
              onClick={handleAddAd}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Advertisement</span>
            </button>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No advertisements configured yet.</p>
              <p className="text-sm mt-1">Click "Add Advertisement" to create your first ad.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{ad.title || 'Untitled Ad'}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ad.type === 'advertisement' ? 'bg-blue-100 text-blue-800' :
                          ad.type === 'sponsored' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {ad.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ad.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ad.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                      <div className="text-xs text-gray-500">
                        Button: "{ad.buttonText}" → {ad.buttonUrl}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleToggleAd(ad.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          ad.enabled 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={ad.enabled ? 'Disable ad' : 'Enable ad'}
                      >
                        {ad.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit ad"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete ad"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-4">
                    <div className={`bg-gradient-to-br ${getColorClasses(ad.color)} border rounded-lg p-4 max-w-sm`}>
                      <div className={`text-xs font-medium mb-2 ${ad.color === 'blue' ? 'text-blue-600' : ad.color === 'green' ? 'text-green-600' : ad.color === 'purple' ? 'text-purple-600' : ad.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                        {ad.type.toUpperCase()}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{ad.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                      <span className={`text-sm font-medium ${ad.color === 'blue' ? 'text-blue-600' : ad.color === 'green' ? 'text-green-600' : ad.color === 'purple' ? 'text-purple-600' : ad.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                        {ad.buttonText} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">Export Instructions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>1. Click "Download HTML Files" to download your blog files</p>
            <p>2. Create a new repository on GitHub (or use an existing one)</p>
            <p>3. Upload all the downloaded HTML files to your repository root</p>
            <p>4. Enable GitHub Pages in your repository settings</p>
            <p>5. Your blog will be live at your GitHub Pages URL!</p>
          </div>
        </div>
      </div>

      {/* Ad Edit Modal */}
      {showAdForm && editingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ads.find(a => a.id === editingAd.id) ? 'Edit Advertisement' : 'Add Advertisement'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Advertisement title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingAd.description}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the advertisement"
                />
              </div>
              
              {/* Custom Script Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Script/HTML (advanced)</label>
                <textarea
                  value={editingAd.customScript || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, customScript: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-xs"
                  placeholder="Paste custom ad code here (e.g. Google AdSense). Only use trusted code!"
                />
                <p className="text-xs text-yellow-600 mt-1">Warning: Only use trusted code. This will be injected as raw HTML/JS.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editingAd.buttonText}
                    onChange={(e) => setEditingAd({ ...editingAd, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Learn More"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                  <input
                    type="url"
                    value={editingAd.buttonUrl}
                    onChange={(e) => setEditingAd({ ...editingAd, buttonUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={editingAd.type}
                    onChange={(e) => setEditingAd({ ...editingAd, type: e.target.value as Advertisement['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="advertisement">Advertisement</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={editingAd.color}
                    onChange={(e) => setEditingAd({ ...editingAd, color: e.target.value as Advertisement['color'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={editingAd.enabled}
                  onChange={(e) => setEditingAd({ ...editingAd, enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
                  Enable this advertisement
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelAdEdit}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAd}
                disabled={!editingAd.title.trim() || !editingAd.description.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Advertisement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};