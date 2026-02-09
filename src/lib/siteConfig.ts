// Define the configuration interface
export interface SiteConfig {
  topBanner: { text: string; enabled: boolean; speed: number };
  header?: { logoUrl?: string };
  hero: { 
    title: string; 
    subtitle: string; 
    buttonText: string; 
    imageUrl: string; 
    link: string;
    imageFit?: string;
    imagePosition?: string;
    overlayOpacity?: number;
    height?: number;
  };
  categories: { limit: number };
  contact: { 
    email: string; 
    phone: string; 
    address: string; 
    mapUrl: string;
  };
  footer: { 
    description: string; 
    socials: { facebook: string; twitter: string; instagram: string; youtube: string }; 
    copyright: string;
  };
  promos: Array<{
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    active: boolean;
  }>;
  videos: Array<{
    id: string;
    title: string;
    youtubeUrl: string;
  }>;
  blog: {
    enabled: boolean;
    title: string;
    subtitle: string;
    articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    date: string;
    link?: string;
  }>;  link?: string;
  }>;
  };
}
