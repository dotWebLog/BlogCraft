export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  slug: string;
}

export interface BlogConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  theme: string;
  ads: Advertisement[];
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  type: 'advertisement' | 'sponsored' | 'featured';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  enabled: boolean;
  customScript?: string; // Custom HTML/JS for ad (optional)
}