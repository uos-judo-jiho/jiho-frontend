/**
 * Structured data types for SEO
 * Based on Schema.org vocabulary
 */

export interface ImageObject {
  "@type": "ImageObject";
  url: string;
  caption?: string;
  datePublished?: string;
}

export interface CollectionPage {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  mainEntity: ImageGallery;
}

export interface ImageGallery {
  "@type": "ImageGallery";
  name: string;
  description: string;
  numberOfItems: number;
  image: ImageObject[];
}

export interface Article {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    "@type": "Person";
    name: string;
  };
}

export interface Organization {
  "@context": "https://schema.org";
  "@type": "SportsOrganization";
  name: string;
  description: string;
  url: string;
  logo?: string;
  foundingDate?: string;
  email?: string;
  sameAs?: string[];
  sport?: string;
  memberOf?: {
    "@type": "Organization";
    name: string;
  };
  award?: string[];
}
