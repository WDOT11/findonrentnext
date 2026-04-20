"use client";

import style from "./blog.module.css";
import ArrowrightIcon from "../../../public/arrow.svg";
import { LuArrowLeft, LuArrowRight, LuCalendarDays } from "react-icons/lu";

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

export default function AllBlogsPageInner({
  posts = [],
  total = 0,
  page = 1,
  limit = 21,
}) {
  const totalPages = Math.ceil(total / limit);

  const createRipple = (e) => {
    const target = e.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add(style.ripple);
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 60;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    target.appendChild(ripple);
    ripple.classList.add(style.ripple_effect);
    setTimeout(() => ripple.remove(), 1500);
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    window.location.href = `/blog?page=${p}`;
  };

  const handlePrev = () => goToPage(page - 1);
  const handleNext = () => goToPage(page + 1);

  return (
    <>
      {/* ===== Hero Section ===== */}
      <div className={style.roh_prouct_hero_wrap}>
        <div className={style.roh_prouct_hero_inner}>
          <div className={style.roh_prouct_hero}>
            <img
                src={`${WEB_BASE_DOMAIN_URL}/images/blog-hero-banner.webp`}
                alt={"Blog Hero Image"}
                className={style.roh_hero_img}
                fetchPriority="high"
                decoding="sync"
              />
              <div className={style.roh_image_overlay}></div>
            <div className="container">
              <div className={style.roh_Zindex}>
                <div className={style.roh_hero_heading}>
                  <h1 data-wow-duration="2s" className="mb-sm-2 mb-2">Blog</h1>
                </div>
                 <nav aria-label="Breadcrumb" className={style.breadcrumbWrap}>
                  <ol className={style.breadcrumbList}>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li className={style.separator}>›</li>
                    <li aria-current="page">Blog</li>
                  </ol>
              </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Blog Grid ===== */}
      <div className={style.roh_blog_post_inner}>
        <div className={style.roh_container}>
          <div className={style.roh_blog_grid}>
            {posts.length === 0 ? (
              <p className="text-center py-5">Loading blogs...</p>
            ) : (
              posts.map((post) => (
                <a
                  key={post.id}
                  className={style.roh_blog_card}
                  href={`/blog/${post.post_slug}`}
                >
                  <div
                    className={style.roh_blog_img}
                    onMouseEnter={createRipple}
                  >
                    <img
                      src={`${WEB_BASE_URL}${post.file_path}${post.file_name}`}
                      alt={post.post_title}
                      className={style.roh_postFeature_img_cover}
                      loading="lazy"
                    />
                  </div>

                  <div className={style.roh_blog_content}>
                    <div>
                      <p className={style.roh_blog_date}>
                        <LuCalendarDays size={18} />
                        {new Date(post.add_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                      <h2 className={style.roh_blog_heading}>
                        {post.post_title}
                      </h2>

                      <p className={style.roh_blog_excerpt}>
                        {post.post_excerpt}
                      </p>
                    </div>

                    <div
                      className={`d-flex align-items-center justify-content-start ${style.roh_redBtns}`}
                    >
                      <div className={style.roh_button_custom}>
                        <button>Read More</button>
                      </div>
                      <div className={style.roh_circl_btn}>
                        <button>
                          <ArrowrightIcon width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>

          {/* ===== Pagination ===== */}
          {totalPages > 1 && (
            <div
              className={`${style.rohproducts_pagination} d-flex justify-content-center mt-4 gap-2 flex-wrap mt-5`}
            >
              <button
                onClick={handlePrev}
                className={style.roh_paginationPrev_btn}
                disabled={page === 1}
              >
                <LuArrowLeft size={18} />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = page === pageNum;
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(pageNum)}
                    className={`${style.rohproducts_btn_page} ${
                      isActive
                        ? style.rohproducts_btn_active
                        : style.rohproducts_btn_inactive
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={handleNext}
                className={style.roh_paginationNext_btn}
                disabled={page === totalPages}
              >
                <LuArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
