import SingleBlogInner from "./SingleBlogInner";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

/* ================= HELPERS ================= */

const truncateTitle = (title, maxLength = 62) => {
  if (!title || title.length <= maxLength) return title;

  let truncated = title.slice(0, maxLength);
  truncated = truncated.slice(
    0,
    Math.min(truncated.length, truncated.lastIndexOf(" "))
  );

  return truncated + "...";
};

const getBlogSchema = (blog, slug) => {

  if (!blog) return null;

  const imageUrl =
    blog?.file_path && blog?.file_name
      ? `${process.env.NEXT_PUBLIC_WEB_BASE_URL}${blog.file_path}${blog.file_name}`
      : null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.post_title,
    description: blog.post_excerpt || "",
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: blog.add_date,
    dateModified: blog.edit_date || blog.edit_date,
    author: {
      "@type": "Organization",
      name: "FindOnRent",
    },
    publisher: {
      "@type": "Organization",
      name: "FindOnRent",
      logo: {
        "@type": "ImageObject",
        url: "https://findonrent.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/blog/${slug}`,
    },
  };
};

/* ================= SEO METADATA ================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/viewsingleblog`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        next: { revalidate: 600 },
      }
    );

    const result = await res.json();
    const blog = result?.blog;

    const seoTitle = blog?.post_title ? truncateTitle(blog.post_title, 50) + " | FindOnRent" : "FindOnRent Blog";

    const description =
      blog?.post_excerpt ||
      "Explore insights and tips from FindOnRent community.";

    const image =
      blog?.file_path && blog?.file_name
        ? `${process.env.NEXT_PUBLIC_WEB_BASE_URL}${blog.file_path}${blog.file_name}`
        : null;

    return {
      title: seoTitle,
      description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/blog/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: seoTitle,
        description,
        type: "article",
        url: `${process.env.NEXT_PUBLIC_WEB_DOMAIN_URL}/blog/${slug}`,
        images: image ? [image] : [],
      },
    };
  } catch (err) {
    return {
      title: "FindOnRent Blog",
      description: "Explore insights and tips from FindOnRent community.",
    };
  }
}

/* ================= PAGE ================= */

export default async function SingleBlogPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    return null;
  }

  let blog = null;
  let relatedBlogs = [];
  let rentalProviders = [];

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/viewsingleblog`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        next: { revalidate: 600 },
      }
    );

    const result = await res.json();
    blog = result?.blog || null;
    relatedBlogs = result?.related || [];

    /** VENDORS SERVER SIDE */
    if (blog?.dynamic_loc_id) {
      const vendorRes = await fetch(
        `${ROH_PUBLIC_API_BASE_URL}/getVendorsByCity/${blog.dynamic_loc_id}`,
        { next: { revalidate: 600 } }
      );

      const vendorJson = await vendorRes.json();
      rentalProviders = vendorJson?.vendors || [];
    }

  } catch (e) {
    console.error("Single blog fetch error", e);
  }

  const blogSchema = getBlogSchema(blog, slug);

  return (
    <>
      {/* BlogPosting Schema */}
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema),
          }}
        />
      )}

      <SingleBlogInner
        blog={blog}
        relatedBlogs={relatedBlogs}
        rentalProviders={rentalProviders}
      />
    </>
  );
}
