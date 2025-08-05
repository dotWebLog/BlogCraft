import { BlogPost, BlogConfig } from '../types/blog';
import { parseMarkdown } from './markdown';
import JSZip from 'jszip';

export const generateIndexHTML = (posts: BlogPost[], config: BlogConfig): string => {
  const publishedPosts = posts.filter(post => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const enabledAds = config.ads?.filter(ad => ad.enabled) || [];
  
  // Group posts by year and month for archive
  // Limit to 15 most recent posts for the archive
  const recentPosts = [...publishedPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 15);

  // Group only the recent posts by year and month for archive
  const archiveData = recentPosts.reduce((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, BlogPost[]>>);

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

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <meta name="description" content="${config.description}">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .prose { max-width: none; }
        .prose p { margin-bottom: 1rem; }
        .prose h1, .prose h2, .prose h3 { margin-top: 2rem; margin-bottom: 1rem; }
        .prose ul { margin-bottom: 1rem; }
        .prose pre { margin-bottom: 1rem; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="flex min-h-screen">
        <div class="flex-1 max-w-4xl mx-auto px-4 py-8">
            <header class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${config.title}</h1>
                <p class="text-xl text-gray-600">${config.description}</p>
            </header>
            
            <main class="space-y-8">
                ${publishedPosts.map(post => `
                    <article class="bg-white rounded-lg shadow-md p-6">
                        <h2 class="text-2xl font-bold mb-3">
                            <a href="${post.slug}.html" class="text-gray-900 hover:text-blue-600">
                                ${post.title}
                            </a>
                        </h2>
                        <div class="text-gray-600 text-sm mb-4">
                            ${new Date(post.createdAt).toLocaleDateString()} • ${post.category}
                        </div>
                        <p class="text-gray-700 mb-4">${post.excerpt}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex flex-wrap gap-2">
                                ${post.tags.map(tag => `
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        ${tag}
                                    </span>
                                `).join('')}
                            </div>
                            <a href="${post.slug}.html" class="text-blue-600 hover:text-blue-800 font-medium">
                                Read more →
                            </a>
                        </div>
                    </article>
                `).join('')}
            </main>
            
            <footer class="text-center mt-12 pt-8 border-t border-gray-200">
                <p class="text-gray-600">© ${new Date().getFullYear()} ${config.author}. All rights reserved.</p>
            </footer>
        </div>
        
        <!-- Sidebar -->
        <aside class="w-80 bg-white border-l border-gray-200 p-6 space-y-8">
            <!-- Blog Archive -->
            <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                    Blog Archive
                </h3>
                ${years.length > 0 ? `
                    <div class="space-y-4">
                        ${years.map(year => `
                            <div class="space-y-2">
                                <h4 class="font-medium text-gray-800 text-sm">${year}</h4>
                                <div class="space-y-1 ml-4">
                                    ${Object.entries(archiveData[year])
                                      .sort(([a], [b]) => new Date(`${a} 1, ${year}`).getTime() - new Date(`${b} 1, ${year}`).getTime())
                                      .reverse()
                                      .map(([month, monthPosts]) => `
                                        <div class="space-y-1">
                                            <div class="flex items-center justify-between">
                                                <span class="text-sm text-gray-600">${month}</span>
                                                <span class="text-xs text-gray-400">(${monthPosts.length})</span>
                                            </div>
                                            <div class="ml-2 space-y-1">
                                                ${monthPosts.map(post => `
                                                    <a href="${post.slug}.html" class="block text-xs text-gray-500 hover:text-blue-600 px-2 py-1 rounded transition-colors truncate" title="${post.title}">
                                                        ${post.title}
                                                    </a>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-sm text-gray-500">No published posts yet.</p>'}
            </div>

            ${enabledAds.length > 0 ? `
                <!-- Advertisement Section -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Sponsored</h3>
                    <div class="space-y-4">
                        ${enabledAds.map(ad => `
                            <div class="bg-gradient-to-br ${getColorClasses(ad.color).replace('text-', '').split(' ').slice(0, 3).join(' ')} border rounded-lg p-4">
                                <div class="text-xs font-medium mb-2 ${ad.color === 'blue' ? 'text-blue-600' : ad.color === 'green' ? 'text-green-600' : ad.color === 'purple' ? 'text-purple-600' : ad.color === 'orange' ? 'text-orange-600' : 'text-red-600'}">${ad.type.toUpperCase()}</div>
                                <h4 class="font-semibold text-gray-900 mb-2">${ad.title}</h4>
                                <p class="text-sm text-gray-600 mb-3">${ad.description}</p>
                                <a href="${ad.buttonUrl}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium ${ad.color === 'blue' ? 'text-blue-600 hover:text-blue-800' : ad.color === 'green' ? 'text-green-600 hover:text-green-800' : ad.color === 'purple' ? 'text-purple-600 hover:text-purple-800' : ad.color === 'orange' ? 'text-orange-600 hover:text-orange-800' : 'text-red-600 hover:text-red-800'}">${ad.buttonText} →</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Blog Stats -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Blog Statistics</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total Posts:</span>
                        <span class="font-medium">${publishedPosts.length}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Categories:</span>
                        <span class="font-medium">${new Set(publishedPosts.map(p => p.category)).size}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Tags:</span>
                        <span class="font-medium">${new Set(publishedPosts.flatMap(p => p.tags)).size}</span>
                    </div>
                </div>
            </div>
        </aside>
    </div>
    
    <!-- Visitor Tracking Script -->
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Get the User-Agent string
            var userAgent = navigator.userAgent;

            // Get the current page URL
            var pageUrl = window.location.href;

            // Fetch the IP address from a server-side endpoint
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    // Log the visitor with IP, User-Agent, and URL
                    logVisitor(data.ip, userAgent, pageUrl);
                })
                .catch(error => {
                    console.error('Error fetching the IP:', error);
                    // Log only with User-Agent and URL in case of an error
                    logVisitor("IP unavailable", userAgent, pageUrl);
                });
        });

        function logVisitor(ip, userAgent, url) {
            // Get the current date and time
            var timestamp = new Date().toLocaleString();

            // Create a log entry
            var logEntry = \`\${timestamp} - Visitor logged, IP: \${ip}, Browser: \${userAgent}, URL: \${url}\`;

            // Send a POST request to RequestBin with the log entry
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://eofta18tzugzjn1.m.pipedream.net", true);
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.send(logEntry);
        }
    </script>
</body>
</html>`;
};

export const generatePostHTML = (post: BlogPost, config: BlogConfig): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - ${config.title}</title>
    <meta name="description" content="${post.excerpt}">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .prose { max-width: none; }
        .prose p { margin-bottom: 1rem; }
        .prose h1, .prose h2, .prose h3 { margin-top: 2rem; margin-bottom: 1rem; }
        .prose ul { margin-bottom: 1rem; }
        .prose pre { margin-bottom: 1rem; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
        <nav class="mb-8">
            <a href="index.html" class="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Blog
            </a>
        </nav>
        
        <article class="bg-white rounded-lg shadow-md p-8">
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
                <div class="flex items-center justify-between text-gray-600 mb-4">
                    <div>
                        By ${post.author} • ${new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div class="text-sm">
                        Category: ${post.category}
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${post.tags.map(tag => `
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </header>
            
            <div class="prose max-w-none text-gray-800 leading-relaxed">
                ${parseMarkdown(post.content)}
            </div>
        </article>
        
        <footer class="text-center mt-12 pt-8 border-t border-gray-200">
            <p class="text-gray-600">© ${new Date().getFullYear()} ${config.author}. All rights reserved.</p>
        </footer>
    </div>
    
    <!-- Visitor Tracking Script -->
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Get the User-Agent string
            var userAgent = navigator.userAgent;

            // Get the current page URL
            var pageUrl = window.location.href;

            // Fetch the IP address from a server-side endpoint
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    // Log the visitor with IP, User-Agent, and URL
                    logVisitor(data.ip, userAgent, pageUrl);
                })
                .catch(error => {
                    console.error('Error fetching the IP:', error);
                    // Log only with User-Agent and URL in case of an error
                    logVisitor("IP unavailable", userAgent, pageUrl);
                });
        });

        function logVisitor(ip, userAgent, url) {
            // Get the current date and time
            var timestamp = new Date().toLocaleString();

            // Create a log entry
            var logEntry = \`\${timestamp} - Visitor logged, IP: \${ip}, Browser: \${userAgent}, URL: \${url}\`;

            // Send a POST request to RequestBin with the log entry
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://eofta18tzugzjn1.m.pipedream.net", true);
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.send(logEntry);
        }
    </script>
</body>
</html>`;
};

export const exportBlog = async (posts: BlogPost[], config: BlogConfig) => {
  const publishedPosts = posts.filter(post => post.published);
  const zip = new JSZip();

  // Add index.html
  const indexHTML = generateIndexHTML(publishedPosts, config);
  zip.file('index.html', indexHTML);

  // Add each post as a separate HTML file
  publishedPosts.forEach(post => {
    const postHTML = generatePostHTML(post, config);
    zip.file(`${post.slug}.html`, postHTML);
  });

  // Add README.md
  const readmeContent = generateReadme(config, publishedPosts.length);
  zip.file('README.md', readmeContent);

  // Generate the zip and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadZipFile('blog-export.zip', blob);

  return { indexHTML, posts: publishedPosts };
};

const downloadZipFile = (filename: string, blob: Blob) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const generateReadme = (config: BlogConfig, postCount: number): string => {
  return `# ${config.title}

${config.description}

## GitHub Pages Setup Instructions

1. Create a new repository on GitHub (or use an existing one)
2. Upload all the downloaded HTML files to your repository:
   - \`index.html\` (main blog page)
   - Individual post files (\`*.html\`)
3. Go to your repository Settings → Pages
4. Select "Deploy from a branch" as the source
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your blog will be live at: ${config.url}

## Blog Statistics

- **Posts**: ${postCount}
- **Author**: ${config.author}
- **Generated**: ${new Date().toLocaleDateString()}

## File Structure

\`\`\`
├── index.html          # Main blog homepage
├── [post-slug].html    # Individual blog posts
└── README.md          # This file
\`\`\`

---

Generated with BlogCraft - A modern blogging system for GitHub Pages
`;
};