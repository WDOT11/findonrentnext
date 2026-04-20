"use client";

import styles from "./innerservices.module.css";
import Image from "next/image";
import { useState } from "react";
import { LuGrid3X3, LuArrowRight, LuChevronRight } from "react-icons/lu";

export default function Categories() {

  const categories = [
  {
    image: "/images/electronicspg/tech_devices_electronics.webp",
    name: "Laptops & PCs",
    desc: "High-performance machines for work & study.",
    count: "120+ devices available",
    tag: "MOST POPULAR"
  },
  {
    image: "/images/electronicspg/cameras-cear.webp",
    name: "Cameras & Gear",
    desc: "Professional cameras, lenses & accessories.",
    count: "85+ devices available",
    tag: "MOST POPULAR"
  },
  {
    image: "/images/electronicspg/ps5-controller.webp",
    name: "Gaming Consoles",
    desc: "PS5, Xbox rentals.",
    count: "40+ devices available",
    tag: "TRENDING"
  },
  {
    image: "/images/electronicspg/audio-vr.webp",
    name: "Audio & VR",
    desc: "Headphones, speakers & VR headsets.",
    count: "60+ devices available",
    tag: ""
  },
  {
    image: "/images/electronicspg/tablets-ipads.webp",
    name: "Tablets & iPads",
    desc: "Versatile devices for design & reading.",
    count: "55+ devices available",
    tag: ""
  },
  {
    image: "/images/electronicspg/drones-action.webp",
    name: "Drones & Action",
    desc: "Aerial photography devices.",
    count: "30+ devices available",
    tag: ""
  },
  {
    image: "/images/electronicspg/projectors.webp",
    name: "Projectors",
    desc: "Perfect for presentations and movie nights.",
    count: "135+ devices available",
    tag: ""
  },
  {
    image: "/images/electronicspg/wearables-watch.webp",
    name: "Wearables",
    desc: "Smartwatches and fitness tracking bands.",
    count: "75+ devices available",
    tag: ""
  }
];


  return (

    <section className={`${styles.roh_categories_section}`}>
      <div className={styles.roh_container}>

        <div className={styles.roh_categories_inner}>

            <span className={styles.roh_categories_title}><LuGrid3X3 size={16}/>Categories</span>
            <h2>Explore the latest tech<br/> available for rent</h2>

            {/* Categories Grid  */}
            <div className={styles.roh_cat_grid}>

                {categories.map((cat, index) => (
                  <div key={cat.name} className={styles.roh_cat_card}>
                    <div className={styles.roh_cat_card_inner}>

                    <div className={styles.roh_cat_card_img}>
                      <Image src={cat.image} alt={cat.name} width={300} height={300}/>
                    </div>

                    <div className={styles.roh_cat_card_content}>
                      <h3>{cat.name}</h3>
                      <p className={styles.roh_cat_desc}>{cat.desc}</p>
                      <span className={styles.roh_cat_count}>{cat.count}</span>
                      {cat.tag &&
                      <span className={styles.roh_cat_tag}>{cat.tag}</span>
                      }
                    </div>
                    </div>
                      <a className={styles.roh_cat_link} href="#">Explore <LuArrowRight size={16}/></a>

                  </div>
                ))}
            </div>
             {/* BOTTOM CTA */}
        <div className="mt-5">
          <p className="text-secondary small mb-4">
            Discover our electronics rental services designed for flexible daily, weekly, and monthly plans.
          </p>

          <a href="#" className={styles.view_all_btn}>View All Categories <LuArrowRight size={28} /> </a>


        </div>
        
        </div>

      </div>

    </section>

  );

}