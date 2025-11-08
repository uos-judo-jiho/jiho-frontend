import type { CollectionPage, ImageGallery, ImageObject, Article } from "./types";

/**
 * Create ImageGallery structured data
 * @see https://schema.org/ImageGallery
 */
export const createImageGalleryData = ({
  name,
  description,
  url,
  images,
}: {
  name: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    caption?: string;
    datePublished?: string;
  }>;
}): CollectionPage => {
  const imageObjects: ImageObject[] = images.map((img) => ({
    "@type": "ImageObject",
    url: img.url,
    caption: img.caption,
    datePublished: img.datePublished,
  }));

  const imageGallery: ImageGallery = {
    "@type": "ImageGallery",
    name,
    description,
    numberOfItems: images.length,
    image: imageObjects,
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: imageGallery,
  };
};

/**
 * Create Article structured data
 * @see https://schema.org/Article
 */
export const createArticleData = ({
  headline,
  description,
  images,
  datePublished,
  dateModified,
  author,
}: {
  headline: string;
  description: string;
  images: string[];
  datePublished?: string;
  dateModified?: string;
  author?: string;
}): Article => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: images,
    datePublished,
    dateModified,
    author: author
      ? {
          "@type": "Person",
          name: author,
        }
      : undefined,
  };
};
