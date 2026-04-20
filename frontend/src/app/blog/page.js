import { Suspense } from "react";
import AllBlogsPageInner from "./AllBlogsPageInner";
import Seo from "../../components/seo/Seo";
import { getSeoMeta } from "../../lib/getSeoMeta";

const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default async function AllBlogsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page) || 1;
  const limit = 21;

  const metaSchema = await getSeoMeta("/blog/");


  let posts = [];
  let total = 0;

  try {
    const res = await fetch(
      `${ROH_PUBLIC_API_BASE_URL}/getallactiveblogs?page=${page}&limit=${limit}`,
      { 
        cache: "no-store" 
      }
    );
    const result = await res.json();

    posts = result?.data || [];
    total = result?.total || 0;
  } catch (e) {
    console.error("Server blog fetch error", e);
  }

  return (
    <>
      <Seo slug="/blog/" />
      
      {/*Schema Injection */}
      {metaSchema.meta_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metaSchema.meta_schema,
          }}
        />
      )}

      <Suspense fallback={<div>Loading blogs...</div>}>
        <AllBlogsPageInner
          posts={posts}
          total={total}
          page={page}
          limit={limit}
        />
      </Suspense>
    </>
  );
}
