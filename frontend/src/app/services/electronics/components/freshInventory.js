"use client";

import styles from "./freshInventory.module.css";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import {
  LuRegex,
  LuStore,
  LuArrowRight,
  LuChevronRight,
  LuMapPin,
  LuArrowLeft
} from "react-icons/lu";

export default function FreshInventory() {

 const [emblaRef, emblaApi] = useEmblaCarousel({
  align: "start",
  dragFree: true,
  loop: true
});

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const latestIteams = [
    {
      image: "/images/electronicspg/tech_devices_electronics.webp",
      name: "Apple MacBook Pro M3 (14-inch, 16GB RAM)",
      location: "Mumbai",
      rentelProvider: "TechRentals Hub",
      tag: "Trending",
      price: "899"
    },
    {
      image: "/images/electronicspg/cameras-cear.webp",
      name: "Sony Alpha A7 IV Mirrorless Camera",
      location: "Delhi NCR",
      rentelProvider: "Snap & Go Gear",
      tag: "New",
      price: "1200"
    },
    {
      image: "/images/electronicspg/ps5-controller.webp",
      name: "Sony PlayStation 5 + 2 Controllers",
      location: "Bangalore",
      rentelProvider: "Gaming Vault",
      tag: "TRENDING",
      price: "450"
    },
    {
      image: "/images/electronicspg/drones-action.webp",
      name: "DJI Mini 3 Pro Fly More Combo",
      location: "Mumbai",
      rentelProvider: "Aerial Views Co.",
      tag: "Just Added",
      price: "650"
    },
    {
      image: "/images/electronicspg/tech_devices_electronics.webp",
      name: "Apple MacBook Pro M3 (14-inch, 16GB RAM)",
      location: "Mumbai",
      rentelProvider: "TechRentals Hub",
      tag: "Trending",
      price: "899"
    },
    {
      image: "/images/electronicspg/cameras-cear.webp",
      name: "Sony Alpha A7 IV Mirrorless Camera",
      location: "Delhi NCR",
      rentelProvider: "Snap & Go Gear",
      tag: "New",
      price: "1200"
    }
  ];


  return (
    <section className={styles.roh_freshInventory_section}>

      <div className={styles.roh_container}>

        <span className={`${styles.roh_section_label} mx-sm-0 mx-auto`}>
          <LuRegex size={16} /> Fresh Inventory
        </span>


        <div className={styles.roh_freshInventory_content}>

          <div className="d-flex justify-content-between align-items-center">

            <h2 className={`text-dark mx-sm-0 mx-auto ${styles.roh_second_heading}`}>
              Latest Electronics Available for Rent
            </h2>

            <a href="#" className="text-dark fw-semibold d-sm-block d-none">View All Products</a>

          </div>


          {/* SLIDER WRAPPER */}
          <div className={styles.sliderWrapper}>

            {/* LEFT ARROW */}
            <button className={styles.sliderArrowLeft} onClick={scrollPrev}> <LuArrowLeft size={20} /> </button>


            {/* EMBLA VIEWPORT */}
            <div className={styles.embla} ref={emblaRef}>

              <div className={styles.emblaContainer}>

                {latestIteams.map((item, index) => (

                  <div className={styles.emblaSlide} key={index}>

                    <div className={styles.roh_latestIteam_card}>

                      <div className={styles.roh_latestIteam_card_inner}>

                        <div className={styles.roh_latestIteam_image}>

                          <Image src={item.image} alt={item.name} width={200} height={200} className="img-fluid" />

                        </div>


                        <div className={styles.roh_latestIteam_content}>

                          <span className={`d-flex align-items-center ${styles.roh_latestIteam_provider}`}>
                            <LuStore size={16} /> {item.rentelProvider}
                          </span>

                          <h3>{item.name}</h3>

                          <p className={styles.roh_latestIteam_location}>
                            <LuMapPin size={12} /> {item.location}
                          </p>


                          {item.tag && (
                            <span className={`${styles.roh_latestIteam_tag} ${styles[item.tag.toLowerCase().replace(/\s+/g, "")]}`}>{item.tag}</span>
                          )}

                        </div>

                      </div>


                      <div className={styles.roh_latestIteam_priceFooter}>

                        <span className={styles.roh_latestIteam_price}>${item.price}</span>

                        <a href="#" className={styles.roh_latestIteam_rentBtn}> Rent Now </a>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* RIGHT ARROW */}
            <button className={styles.sliderArrowRight} onClick={scrollNext}>
              <LuArrowRight size={20} />
            </button>
          </div>


          <a href="#" className="text-dark fw-semibold d-sm-none d-block mt-4 text-center">View All Products</a>
        </div>

      </div>

    </section>
  );
}