import React from 'react';
import { BlogPost, Advertisement } from '../types/blog';
import { Calendar, Archive, ExternalLink } from 'lucide-react';

interface SidebarProps {
  posts: BlogPost[];
  ads: Advertisement[];
  onPostSelect?: (post: BlogPost) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ posts, ads, onPostSelect }) => {
  const publishedPosts = posts.filter(post => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 15); // Limit to 15 most recent posts
  const enabledAds = ads.filter(ad => ad.enabled);
  
  // Group posts by year and month
  const archiveData = publishedPosts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(post);
    
    return acc;
  }, {} as Record<number, Record<string, BlogPost[]>>);

  // Sort posts within each month by creation date (newest first)
  Object.keys(archiveData).forEach(year => {
    Object.keys(archiveData[Number(year)]).forEach(month => {
      archiveData[Number(year)][month].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  });

  const years = Object.keys(archiveData).map(Number).sort((a, b) => b - a);

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
    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Blog Archive */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Archive className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Blog Archive</h3>
          </div>
          
          {years.length > 0 ? (
            <div className="space-y-4">
              {years.map(year => (
                <div key={year} className="space-y-2">
                  <h4 className="font-medium text-gray-800 text-sm">{year}</h4>
                  <div className="space-y-1 ml-4">
                    {Object.entries(archiveData[year])
                      .sort(([a], [b]) => new Date(`${a} 1, ${year}`).getTime() - new Date(`${b} 1, ${year}`).getTime())
                      .reverse()
                      .map(([month, monthPosts]) => (
                        <div key={month} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{month}</span>
                            <span className="text-xs text-gray-400">({monthPosts.length})</span>
                          </div>
                          <div className="ml-2 space-y-1">
                            {monthPosts.map(post => (
                              <button
                                key={post.id}
                                onClick={() => onPostSelect?.(post)}
                                className="block w-full text-left text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors truncate"
                                title={post.title}
                              >
                                {post.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No published posts yet.</p>
          )}
        </div>

        {/* Advertisement Section */}
        {enabledAds.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsored</h3>
            <div className="space-y-4">
              {enabledAds.map((ad) => (
                <div key={ad.id} className={`bg-gradient-to-br ${getColorClasses(ad.color)} border rounded-lg p-4`}>
                  <div className={`text-xs font-medium mb-2 ${
                    ad.color === 'blue' ? 'text-blue-600' :
                    ad.color === 'green' ? 'text-green-600' :
                    ad.color === 'purple' ? 'text-purple-600' :
                    ad.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {ad.type.toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{ad.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                  {ad.customScript ? (
                    // WARNING: Only use this if you trust the ad source. XSS risk!
                    <div dangerouslySetInnerHTML={{ __html: ad.customScript }} />
                  ) : (
                    <a 
                      href={ad.buttonUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-1 text-sm font-medium hover:opacity-80 transition-opacity ${
                        ad.color === 'blue' ? 'text-blue-600' :
                        ad.color === 'green' ? 'text-green-600' :
                        ad.color === 'purple' ? 'text-purple-600' :
                        ad.color === 'orange' ? 'text-orange-600' :
                        'text-red-600'
                      }`}
                    >
                      <span>{ad.buttonText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Blog Statistics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Posts:</span>
              <span className="font-medium">{publishedPosts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categories:</span>
              <span className="font-medium">
                {new Set(publishedPosts.map(p => p.category)).size}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tags:</span>
              <span className="font-medium">
                {new Set(publishedPosts.flatMap(p => p.tags)).size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};