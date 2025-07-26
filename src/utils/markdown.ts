export const parseMarkdown = (markdown: string): string => {
  // Simple markdown parser - in production, you'd use a library like marked
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
    
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/^(?!<[h|u|p|l])/gim, '<p class="mb-4">');

  return `<div class="prose max-w-none">${html}</div>`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const extractExcerpt = (content: string, length: number = 150): string => {
  const plainText = content.replace(/[#*`\[\]()]/g, '').trim();
  return plainText.length > length 
    ? plainText.substring(0, length) + '...'
    : plainText;
};