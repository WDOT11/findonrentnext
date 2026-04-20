"use client";
import { useEffect, useState } from "react";
import "../../globals.css"
import styles from "./latestArticle.module.css";
import StarIcon from '/public/star.svg';
import ArrowrightIcon from '/public/arrow.svg';
import { LuCalendar } from "react-icons/lu";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function LatestArtical({ cate_id, loc_id }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cate_id && !loc_id) return;

    const fetchArticles = async () => {
      try {
        const response = await fetch(`${ROH_PUBLIC_API_BASE_URL}/getsinglecategoryrecentposts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cate_id,
              loc_id, /** category OR category/city */
            }),
          }
        );

        const data = await response.json();
        if (data.status && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [cate_id, loc_id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <img src="/infinity-loading.gif" alt="Loading..." width={100} height={80}/>
      </div>
    );
  }

  if (posts.length === 0) {
    return null; // no section if no posts
  }

  return (
    <>
       <section className={styles.roh_articles_wrap} aria-label="Latest articles and blog posts">
        <div className={`container p-0 ${styles.articles_inner}`}>
          <div className={styles.articles_wrap_main}>
            {/* Star Heading */}
            <div className={`d-flex justify-content-center align-items-center`}>
              <div className={styles.star_box}>
                <div className={` d-flex align-items-center gap-2 ${styles.star_inner}`}>
                  <StarIcon className="roh_icon" width={20} height={20} aria-hidden="true"/>
                  <span className="roh_star_title">Latest Articles</span>
                </div>
              </div>
            </div>

            <h3 className={`roh_section_title_h3 text-center`}>
              Stay informed and inspired for <br /> your next journey
            </h3>
            <div className={`container-fluid mt-5 position-relative`}>
              <div className={`row g-4`}>
                {/* Left Column — show first article big */}
                {posts[0] && (
                  <div className={`col-md-12 col-lg-6`}>
                    <a href={`${WEB_BASE_DOMAIN_URL}/blog/${posts[0].post_slug}`} className={`${styles.main_card} ${styles.htiscbox}`}
                     aria-label={`Read article ${posts[0].post_title}`}
                      style={{
                        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url('${
                          posts[0]?.post_image_url ? WEB_BASE_URL + posts[0].post_image_url : "/images/blog1.jpg"
                        }')`,
                      }}>
                      <div className={`${styles.main_carddate} ${styles.thedate} align-items-center`} style={{color: "#fff"}}>
                        <LuCalendar size={16} />{" "}
                        {new Date(posts[0].add_date).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <h5>{posts[0].post_title}</h5>
                      <span>{posts[0].post_excerpt}</span>
                      <div className={`${styles.read_more_btn}`}>
                          <span className={styles.circl_btn}>
                             <ArrowrightIcon className="roh_arrowicon" width={18} height={18} aria-hidden="true"/>
                          </span>
                      </div>
                    </a>
                  </div>
                )}

                {/* Right Column — show remaining articles small */}
                <div className={`col-md-12 col-lg-6`}>
                  {posts.slice(1).map((post, index) => (
                    <a href={`${WEB_BASE_DOMAIN_URL}/blog/${post.post_slug}`}  className={styles.sub_card} key={index}  aria-label={`Read article ${post.post_title}`}>
                      <div className={`${styles.article_sm_imgbox} ${styles.htiscbox}`}>
                        <img src={`${WEB_BASE_URL}${post?.post_image_url || "/images/blog1.jpg"}`} alt={post.post_title} width={500} height={300}/>
                      </div>
                      <div className={styles.article_sm_content}>
                        <small className={`${styles.global_heading} ${styles.gray_global_heading} ${styles.thedate}`} >
                          <LuCalendar size={16} />{" "}
                          {new Date(post.add_date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </small>
                        <h6>{post.post_title}</h6>
                        <span>{post.post_excerpt}</span>
                        <div className={styles.read_link}>
                          <span className={styles.article_read_story}> Read Story </span>
                            <span className={styles.circl_btn}>
                               <ArrowrightIcon className="roh_arrowicon" width={18} height={18} aria-hidden="true"/>
                            </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
