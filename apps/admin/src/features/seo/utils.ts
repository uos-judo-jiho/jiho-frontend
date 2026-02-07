import type {
  Article,
  CollectionPage,
  ImageGallery,
  ImageObject,
  Organization,
} from "./types";

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
    caption?: string | null;
    datePublished?: string;
  }>;
}): CollectionPage => {
  const imageObjects: ImageObject[] = images.map((img) => ({
    "@type": "ImageObject",
    url: img.url,
    caption: img.caption ?? undefined,
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
  keywords,
}: {
  headline: string;
  description: string;
  images: string[];
  datePublished?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[] | string;
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
    keywords:
      typeof keywords === "string"
        ? keywords
        : Array.isArray(keywords)
          ? keywords
          : undefined,
  };
};

/**
 * Create Organization structured data with LocalBusiness
 * @see https://schema.org/SportsOrganization
 * @see https://schema.org/LocalBusiness
 */
export const createOrganizationData = ({
  name,
  description,
  url,
  address,
  openingHours,
  logo,
  foundingDate,
  email,
  sameAs,
  sport,
  memberOf,
  award,
  geo,
  includeLocalBusiness = true,
}: {
  name: string;
  description: string;
  url: string;
  address: {
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    streetAddress: string;
    extendedAddress: string;
  };
  openingHours?: Array<{
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  logo?: string;
  foundingDate?: string;
  email?: string;
  sameAs?: string[];
  sport?: string;
  memberOf?: {
    name: string;
  };
  award?: string[];
  geo: {
    latitude: number;
    longitude: number;
  };
  includeLocalBusiness?: boolean;
}): Organization => {
  return {
    "@context": "https://schema.org",
    "@type": includeLocalBusiness
      ? ["SportsOrganization", "LocalBusiness"]
      : "SportsOrganization",
    name,
    description,
    url,
    address: {
      "@type": "PostalAddress",
      addressCountry: address.addressCountry,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      streetAddress: address.streetAddress,
      extendedAddress: address.extendedAddress,
    },
    ...(openingHours && {
      openingHoursSpecification: openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: hours.dayOfWeek,
        opens: hours.opens,
        closes: hours.closes,
      })),
    }),
    ...(logo && { logo }),
    ...(foundingDate && { foundingDate }),
    ...(email && { email }),
    ...(sameAs && { sameAs }),
    ...(sport && { sport }),
    ...(memberOf && {
      memberOf: {
        "@type": "Organization" as const,
        name: memberOf.name,
      },
    }),
    ...(award && { award }),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
  };
};
