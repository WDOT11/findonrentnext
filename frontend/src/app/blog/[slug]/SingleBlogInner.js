"use client";
import style from "./singleblog.module.css";
import ArrowrightIcon from "../../../../public/arrow.svg";
import CarIcon from "../../../../public/arrow.svg";
import Image from "next/image";
import "./singleblog.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuMapPin, LuLayers, LuArrowRight, LuPhoneCall,  } from "react-icons/lu";

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;
const ROH_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_ROH_PUBLIC_API_BASE_USER_URL;

export default function SingleBlogInner({ blog, relatedBlogs, rentalProviders }) {

  const cityName =
  rentalProviders.length > 0
    ? rentalProviders[0].city
    : "";

    const citySlug =
    rentalProviders.length > 0
    ? rentalProviders[0].city?.toLowerCase().replace(/\s+/g, "-")
    : "";

    const stateName =
    rentalProviders.length > 0
      ? rentalProviders[0].state
      : "";

  const { slug } = useParams();

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
    requestAnimationFrame(() =>
      ripple.classList.add(style.ripple_effect)
    );
    setTimeout(() => ripple.remove(), 700);
  };

  const getServicesText = (categories = []) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return "N/A";
    }

    return categories
      .map(cat => cat.sub_category_name)
      .filter(Boolean)
      .join(", ");
  };

  const formatCityName = (city = "") => {
    if (!city) return "";

    return city
      .toString()
      .toLowerCase()
      .split("-")
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const displayCityName = formatCityName(cityName);
  const displayStateName = formatCityName(stateName);


  const categoryIcons = {
    bikes: "/bike-red-icon.svg",
    scooty: "/scooty-red-icon.svg",
    scooters: "/scooty-red-icon.svg",
    cars: "/car-red-icon.svg",
    suv: "/suv-red-icon.svg",
    jeep: "/suv-red-icon.svg",
    truck: "/truck-red-icon.svg",
    bus: "/bus-red-icon.svg",
    commercial_vehicles: "/commercial-vehicles.svg",
    recreational_vehicles: "/recreational-vehicles.svg",
    default: "/car-red-icon.svg",
  };

  const decodeHtml = (html) => {
    if (typeof window === "undefined") return html;
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const renderBlogBreadcrumb = () => {
    return (
      <nav aria-label="Breadcrumb" className={style.roh_breadcrumb_wrap}>
        <ol className={style.roh_breadcrumb_list}>
          <li>
            <a href="/">Home</a>
          </li>

          <li className={style.roh_breadcrumb_sep}>›</li>

          <li>
            <a href="/blog">Blog</a>
          </li>

          <li className={style.roh_breadcrumb_sep}>›</li>

          <li aria-current="page">
            {blog.post_title}
          </li>
        </ol>
      </nav>
    );
  };


  return (
    <>
      {/* === Hero Section === */}
      <div className="container-fluid">
        <div className={style.roh_post_hero_wrap}>
          <div className={style.roh_post_hero_inner}>
            <div className={style.roh_post_hero}>
              <img
                src={`${WEB_BASE_URL}${blog.file_path + blog.file_name}`}
                alt={blog.post_title}
                className={style.roh_hero_img}
                fetchPriority="high"
                decoding="sync"
              />
              <div className={style.roh_image_overlay}></div>
              <div className="container">
                <div className={style.roh_Zindex}>
                  <div className={style.roh_hero_left_content}>
                    <h1 className={style.roh_hero_title}>
                      {blog.post_title}
                    </h1>

                    <div className={style.roh_meta}>
                      <span>
                        📅{" "}
                        {new Date(blog.add_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        📅{" "}
                        {new Date(blog.edit_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {blog.category_name && (
                        <span> | 🏷️ {blog.category_name}</span>
                      )}
                      <span> ⏳ 8 min read</span>
                    </div>

                    <p className={style.roh_hero_desc}>
                      {blog.post_excerpt}
                    </p>
                    {/* === Breadcrumb === */}
                    {renderBlogBreadcrumb()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Blog Content === */}
      <div className={style.roh_singlePost_innerContainer}>
        <article className={style.roh_blog_content} dangerouslySetInnerHTML={{ __html: decodeHtml(blog.description || ""), }}/>

        {/* Top Rated Rental Providers */}
        {rentalProviders && rentalProviders.length > 0 && (
          <div className={`${style.roh_provider_section_wrapper}`}>
            <div className={style.roh_section_header}>
              <h2 className="mt-0">Top Rated Rental Providers in {displayCityName}</h2>
              <p >Trusted local rental providers based on ratings and availability</p>
            </div>

            <div className={style.roh_providers_grid}>
              {rentalProviders.map((vendor) => (
                <div key={vendor.user_id} className={style.roh_provider_card}>
                  <div className={style.roh_provider_card_top}>
                    <div className={style.roh_provider_card_info}>
                      <div className="d-flex align-items-start align-items-sm-start justify-content-between">
                      <a  href={`/rental-service-provider/${vendor.business_slug}`} target="_blank" rel="noopener"><h2>{vendor.business_name}</h2></a>

                      {vendor.is_verified == 1 && (
                        <span className={style.roh_provider_badge}>
                          <img src="/verified.svg" alt="Verified" />
                        </span>
                      )}

                      </div>
                      <p className={style.roh_provider_card_desc}>
                        {vendor.business_description ? (
                          vendor.business_description
                        ) : (
                          <>
                            {vendor.business_name} is a trusted rental service provider based in {displayCityName}, {displayStateName}, offering reliable and affordable rental solutions.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={style.roh_provider_card_body}>
                    <div className={style.roh_meta_item}>
                      <span className={style.roh_meta_label}><LuMapPin size={16} /> Location</span>
                      <span className={style.roh_meta_value}>{displayCityName}, {displayStateName}</span>
                    </div>
                    <div className={style.roh_meta_item}>
                      <span className={style.roh_meta_label}><LuLayers size={16} /> Services</span>
                      <span className={style.roh_meta_value}>{getServicesText(vendor.categories)}</span>
                    </div>

                    <div className={`${style.roh_meta_item} ${style.roh_meta_itemPricewrap}`}>
                      <span className={style.roh_meta_label}>Starting From</span>
                      {vendor.min_price_per_day ? (
                        <span className={style.roh_price_tag}>
                          ₹{vendor.min_price_per_day}
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#97999c" }}>
                            /Day
                          </span>
                        </span>
                      ) : (
                        <a
                          className={style.roh_call_for_price}
                          href={`/rental-service-provider/${vendor.business_slug}`}
                          target="_blank"
                          rel="noopener"
                        >
                          <span>
                            <LuPhoneCall size={18} style={{ color: "#ff3600" }} />
                          </span>{" "}
                          Call For Price
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={style.roh_provider_card_footer}>
                    {/* <a href={`/contact-us/`} className={styles.roh_btn_card_primary} target="_blank">Contact</a> */}
                    <a href={`/rental-service-provider/${vendor.business_slug}`} className={style.roh_btn_card_secondary} target="_blank" rel="noopener">View Provider</a>
                  </div>
                </div>
              ))}
            </div>

            <div className={style.roh_view_all_container}>
              <a href={`/rental-service-providers?city=${citySlug}`} className={style.roh_btn_view_all}>
                View All Rental Providers in {displayCityName}
                <LuArrowRight  size={16}/>
              </a>
            </div>
          </div>
        )}

        {/* === Related Blogs === */}
        {relatedBlogs.length > 0 && (
          <div className={style.roh_related_section}>
            <h2>Related Posts</h2>

            <div className={style.roh_related_grid}>
              {relatedBlogs.map((rel) => (
                <a
                  key={rel.post_slug}
                  href={`/blog/${rel.post_slug}`}
                  className={style.roh_related_card}
                  onClick={createRipple}
                >
                  <div
                    className={style.roh_related_img}
                    onMouseEnter={createRipple}
                  >
                    <img
                      src={`${WEB_BASE_URL}${
                        rel.file_path + rel.file_name
                      }`}
                      alt={rel.post_title}
                      className={style.roh_img_cover}
                      loading="lazy"
                    />
                  </div>

                  <div className={style.roh_related_info}>
                    <div>
                      <h3>{rel.post_title}</h3>
                      <p className={style.roh_related_date}>
                        {new Date(rel.add_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
