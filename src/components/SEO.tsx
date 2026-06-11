"use client";

import { Product, Review } from "@/types";

interface ProductJsonLdProps {
  product: Product;
  reviews?: Review[];
  url: string;
}

export function ProductJsonLd({ product, reviews = [], url }: ProductJsonLdProps) {
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : product.rating || 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    sku: product.sku || product.id,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.category,
    url,
    offers: {
      "@type": "Offer",
      price: product.price || 0,
      priceCurrency: product.currency || "INR",
      availability: product.isAffiliate
        ? "https://schema.org/InStock"
        : (product.stock && product.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.isAffiliate ? product.platform : "TheIdeaDecorator",
      },
    },
    aggregateRating: avgRating > 0 ? {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length || product.reviewCount || 1,
      bestRating: "5",
      worstRating: "1",
    } : undefined,
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.userName },
      datePublished: r.createdAt,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
      name: r.title,
      reviewBody: r.comment,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo: string;
  description: string;
}

export function OrganizationJsonLd({ name, url, logo, description }: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7892430507",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  faqs: { question: string; answer: string }[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  url: string;
}

export function BlogPostJsonLd({ title, description, author, publishedAt, updatedAt, image, url }: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    datePublished: publishedAt,
    dateModified: updatedAt,
    image,
    url,
    publisher: {
      "@type": "Organization",
      name: "TheIdeaDecorator",
      logo: { "@type": "ImageObject", url: "/logo.svg" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
