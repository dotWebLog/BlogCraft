import { BlogPost, BlogConfig } from '../types/blog';

const POSTS_KEY = 'blog_posts';
const CONFIG_KEY = 'blog_config';

export const storage = {
  getPosts: (): BlogPost[] => {
    const posts = localStorage.getItem(POSTS_KEY);
    return posts ? JSON.parse(posts) : [];
  },

  savePosts: (posts: BlogPost[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getConfig: (): BlogConfig => {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config) : {
      title: 'My Blog',
      description: 'A beautiful blog powered by GitHub Pages',
      author: 'Blog Author',
      url: 'https://username.github.io',
      theme: 'modern',
      ads: [
        {
          id: '1',
          title: 'Web Development Tools',
          description: 'Boost your productivity with our premium development toolkit.',
          buttonText: 'Learn More',
          buttonUrl: '#',
          type: 'advertisement',
          color: 'blue',
          enabled: true
        },
        {
          id: '2',
          title: 'Cloud Hosting',
          description: 'Deploy your projects with lightning-fast performance.',
          buttonText: 'Get Started',
          buttonUrl: '#',
          type: 'sponsored',
          color: 'green',
          enabled: true
        },
        {
          id: '3',
          title: 'Design Resources',
          description: 'Premium UI components and design systems for modern apps.',
          buttonText: 'Explore',
          buttonUrl: '#',
          type: 'featured',
          color: 'purple',
          enabled: true
        }
      ]
    };
  },

  saveConfig: (config: BlogConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }
};