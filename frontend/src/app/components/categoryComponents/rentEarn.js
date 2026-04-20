// "use client";
import "../../globals.css";
import styles from "./rentEarn.module.css";
import Image from "next/image";
import { LuCircleCheck } from "react-icons/lu";
import { cookies } from "next/headers";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;

/* =========================
   CATEGORY BASED CONTENT
========================= */
const RENT_EARN_CONTENT = {

  2: {
    image: "/images/vechiclespg/rent-car-and-earn.webp",
    darkTitle: "Zip through the city. Rent your car now.",
    darkDesc:
      "Our friendly customer service team is here to help. Find the perfect self-drive car for your journey today.",

    lightTitle: (
      <>
        Have a Self-Drive Car to Rent Out?{" "}
        <span style={{ color: "#ff3600" }}>List it and Start Earning Today!</span>
      </>
    ),

    points: [
      "Do you have a self-drive car available for rent?",
      "Looking to provide your car for hire in your city?",
      "Want to turn your idle car into a rental business?",
    ],

    bottomTitle: "Turn your car into a steady source of income with",
    bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
  },

  3: {
    image: "/images/vechiclespg/rent-bike-and-earn.webp",
    darkTitle: "Ride more. Earn more. Rent your bike.",
    darkDesc:
      "List your bike on FindOnRent and start earning from every ride.",

    lightTitle: (
      <>
        Own a Bike?{" "}
        <span style={{ color: "#ff3600" }}>
          Rent it out and Earn Effortlessly!
        </span>
      </>
    ),

    points: [
      "Do you have a bike that stays idle most of the time?",
      "Want to earn daily income from your bike?",
      "Looking to start a bike rental business?",
    ],

    bottomTitle: "Turn your bike into a reliable income source with",
    bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
  },

  8: {
    image: "/images/vechiclespg/rent-scooter-and-earn.webp",
    darkTitle: "Make your scooty/scooter work for you.",
    darkDesc:
      "Turn your scooty/scooter into a daily earning asset with FindOnRent.",

    lightTitle: (
      <>
        Have a Scooty/Scooter to Rent?{" "}
        <span style={{ color: "#ff3600" }}>
          List it & Start Earning!
        </span>
      </>
    ),

    points: [
      "Have a scooty/scooter that you don’t use daily?",
      "Want passive income from your scooty/scooter?",
      "Start your scooty/scooter rental journey today!",
    ],

    bottomTitle: "Convert your scooty/scooter into income with",
    bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
  },

  10: {
    image: "/images/vechiclespg/rent-car-with-driver-and-earn.webp",
    darkTitle: "Make your Car with Driver work for you.",
    darkDesc:
      "Turn your Car with Driver into a daily earning asset with FindOnRent.",

    lightTitle: (
      <>
        Have a Car with Driver to Rent?{" "}
        <span style={{ color: "#ff3600" }}>
          List it & Start Earning!
        </span>
      </>
    ),

    points: [
      "Have a car with driver that you don’t use daily?",
      "Want passive income from your Car with Driver?",
      "Start your Car with Driver rental journey today!",
    ],

    bottomTitle: "Convert your Car with Driver into income with",
    bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
  },

};

/* =========================
   COMPONENT
========================= */
export default async function RentEarn({ cate_id }) {

  const content = RENT_EARN_CONTENT[cate_id] || RENT_EARN_CONTENT[2];

  /** MUST be awaited */
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("authUser");

  return (
    <section className={styles.roh_rent_earn_section} aria-label="Rent & Earn">
      <div className={styles.roh_container}>
        <div className={styles.roh_rentEarn_inner}>

          {/* ---------- LEFT DARK CTA ---------- */}
          <div className={styles.roh_ctaDrak}>
            <div className={styles.roh_darkCta_img_wrapper}>
              <Image
                className="rounded-4 w-100 h-auto"
                alt="Rent and earn"
                width={500}
                height={300}
                src={content.image}
              />
            </div>

            <h2 className="fw-bold mb-sm-4 mb-3 text-white">
              {content.darkTitle}
            </h2>

            <p className="text-white">{content.darkDesc}</p>

            <div className="d-flex justify-content-start roh_whiteBtn mt-4">
              <a
                href={`${WEB_BASE_DOMAIN_URL}/contact-us`}
                className="btn btn-lg px-5 fw-semibold"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* ---------- RIGHT CONTENT ---------- */}
          <div className="px-4 px-sm-5 py-4 text-start bg-white m-auto">
            <h2 className="fw-bold mb-4 mt-0">
              {content.lightTitle}
            </h2>

            <ul className={`list-unstyled mb-4 ${styles.roh_rent_earn_list}`}>
              {content.points.map((text, i) => (
                <li
                  key={i}
                  className="mb-2 d-flex align-items-center gap-2"
                >
                  <LuCircleCheck size={20} style={{ color: "#139c01" }} />
                  <div>{text}</div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-start roh_redBtn mb-sm-5 mb-4">
              <a href={isLoggedIn ? `${WEB_BASE_DOMAIN_URL}/become-a-host` : `${WEB_BASE_DOMAIN_URL}/register` } className="btn btn-lg px-5 fw-semibold">
                Rent Your Item – It’s Free
              </a>
            </div>

            <h4 className="text-muted fw-medium mb-1">
              {content.bottomTitle}{" "}
              <strong className="fw-bold text-dark">
                Find<span style={{ color: "#ff3600" }}>On</span>Rent
              </strong>
            </h4>
            <p>
              {content.bottomPeragraph}{" "}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
