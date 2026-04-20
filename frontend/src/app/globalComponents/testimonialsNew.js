"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "../globals.css"
import styles from "./css/testimonialsNew.module.css";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Ritu S., Jaipur",
      role: "Project Manager",
      text: "Booked a Scooty in Jaipur — smooth experience and great pricing.",
      img: "/images/user1.jpg",
    },
    {
      id: 2,
      name: "Sneha T., Pune",
      role: "Project Manager",
      text: "Quick pickup and clean bike — definitely recommend.",
      img: "/images/user2.jpg",
    },
    {
      id: 3,
      name: "Arjun K., Delhi",
      role: "Sales Executive",
      text: "Booked a car for 2 days — smooth process and well-maintained vehicle.",
      img: "/images/user3.jpg",
    },
    {
      id: 4,
      name: "Karan P., Mumbai",
      role: "Developer",
      text: "Affordable and reliable car rental service. Highly recommended.",
      img: "/images/user4.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2);
  const [dragStartX, setDragStartX] = useState(null);
  const sliderRef = useRef(null);

  //  Adjust number of slides based on viewport
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 768) setSlidesToShow(1);
      else setSlidesToShow(2);
    };
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  //  Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [current, slidesToShow]);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev >= testimonials.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - slidesToShow : prev - 1
    );
  };

  //  Handle drag (mouse/touch)
  const handleDragStart = (e) => {
    setDragStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
  };

  const handleDragEnd = (e) => {
    if (dragStartX === null) return;
    const endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX - endX;
    if (diff > 50) nextSlide(); // swipe left
    else if (diff < -50) prevSlide(); // swipe right
    setDragStartX(null);
  };

  return (
    <section className={styles.testimonial_wrap}>
      <div className="container py-0">
        <div className={styles.testimonial_wrap_main}>
          <div className="text-center mb-4">
            <div className={styles.star_box}>
              <Image
                src="/images/homepg/star.svg"
                alt="star"
                width={20}
                height={20}
              />
              <span className="roh_star_title">Testimonials</span>
            </div>
            <h2 className={`mt-3`}>
              What our customers are <br /> saying about us
            </h2>
          </div>

          {/*  Slider */}
          <div
            className={styles.slider_container}
            ref={sliderRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <div
              className={styles.slider_inner}
              style={{
                transform: `translateX(-${(current * 100) / slidesToShow}%)`,
                width: `${(testimonials.length * 100) / slidesToShow}%`,
              }}
            >
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className={styles.slide_item}
                  style={{
                    flex: `0 0 ${100 / slidesToShow}%`,
                  }}
                >
                  <div className={`card ${styles.fleetscard}`}>
                    <div className="card-body">
                      <div className={styles.ratings}>
                        <Image
                          src="/images/rating.png"
                          alt="rating"
                          width={100}
                          height={20}
                        />
                      </div>
                      <p
                        className={`mb-3 ${styles.testimonial_desc} ${styles.gray_global_heading}`}
                      >
                        {item.text}
                      </p>
                      <div className={styles.testimonial_profile_wrap}>
                        <div className={styles.user_image}>
                          <Image
                            src={item.img}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                        </div>
                        <div className={styles.profile_data}>
                          <strong className={styles.author_name}>
                            {item.name}
                          </strong>
                          <span
                            className={`${styles.author_desc} ${styles.gray_global_heading}`}
                          >
                            {item.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*  Buttons below slider */}
          <div className={styles.slider_controls}>
            <button onClick={prevSlide} className={styles.nav_btn}>
              <Image
                src="/arrow.svg"
                width={24}
                height={24}
                alt="Previous"
                className={styles.rotateLeft}
              />
            </button>
            <button onClick={nextSlide} className={styles.nav_btn}>
              <Image src="/arrow.svg" width={24} height={24} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
