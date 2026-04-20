// "use client";
import "../../globals.css";
import styles from "./rentEarn.module.css";
import Image from "next/image";
import { LuCircleCheck } from "react-icons/lu";
import { cookies } from "next/headers";

const WEB_BASE_DOMAIN_URL = process.env.NEXT_PUBLIC_WEB_DOMAIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

/* =========================
   COMPONENT
========================= */
export default async function RentEarn({ cate_id, cat_nm, loc_nm, modelLabel, modelImageUrl }) {

  // Create safe strings to avoid "null" printing
  const categoryName = cat_nm || "";
  const locationName = loc_nm || "";
  const vehicleModel = modelLabel || "";

  const dynamicImageSrc = modelImageUrl ? `${WEB_BASE_URL}${modelImageUrl}` : null;

  /* =========================
   CATEGORY BASED CONTENT
   (Defined inside to access props directly)
  ========================= */
  const RENT_EARN_CONTENT = {
    2: {
      image: dynamicImageSrc || "/images/vechiclespg/rent-car-and-earn.webp",
      darkTitle: "Zip through the city. Rent your car now.",
      darkDesc: (
        <>
          Our friendly customer service team is here to help. Find the perfect{" "}
          {`${vehicleModel} ${categoryName} for your journey today.`}
        </>
      ),

      lightTitle: (
        <>
          Have a {vehicleModel} {categoryName} to Rent Out in {locationName}?{" "}
          <span style={{ color: "#ff3600" }}>List it and Start Earning Today!</span>
        </>
      ),

      points: [
        <>Do you have a {vehicleModel} {categoryName} available for rent in {locationName}?</>,
        <>Looking to provide your {vehicleModel} {categoryName} for hire in {locationName}?</>,
        <>Want to turn your idle {vehicleModel} {categoryName} into a rental income?</>,
      ],

      bottomTitle: (
        <>Turn your {categoryName} into a steady source of income with</>
      ),
      bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
    },

    3: {
      image: dynamicImageSrc || "/images/vechiclespg/rent-bike-and-earn.webp",
      darkTitle: "Ride more. Earn more. Rent your bike.",
      darkDesc: (
        <>List your {vehicleModel} Bike on FindOnRent and start earning from every ride.</>
      ),

      lightTitle: (
        <>
          Have a {vehicleModel} {categoryName} to Rent Out in {locationName}?{" "}
          <span style={{ color: "#ff3600" }}>List it and Start Earning Today!</span>
        </>
      ),

      points: [
        <>Do you have a {vehicleModel} {categoryName} available for rent in {locationName}?</>,
        <>Looking to provide your {vehicleModel} {categoryName} for hire in {locationName}?</>,
        <>Want to turn your idle {vehicleModel} {categoryName} into a rental income?</>,
      ],

      bottomTitle: (
        <>Turn your {categoryName} into a steady source of income with</>
      ),
      bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
    },

    8: {
      image: dynamicImageSrc || "/images/vechiclespg/rent-scooter-and-earn.webp",
      darkTitle: "Make your scooter work for you.",
      darkDesc: (
        <>Turn your {vehicleModel} Scooter into a daily earning asset with FindOnRent.</>
      ),

      lightTitle: (
        <>
          Have a {vehicleModel} {categoryName} to Rent Out in {locationName}?{" "}
          <span style={{ color: "#ff3600" }}>List it and Start Earning Today!</span>
        </>
      ),

      points: [
        <>Do you have a {vehicleModel} {categoryName} available for rent in {locationName}?</>,
        <>Looking to provide your {vehicleModel} {categoryName} for hire in {locationName}?</>,
        <>Want to turn your idle {vehicleModel} {categoryName} into a rental income?</>,
      ],

      bottomTitle: (
        <>Turn your {categoryName} into a steady source of income with</>
      ),
      bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
    },

    10: {
      image: dynamicImageSrc || "/images/vechiclespg/rent-car-with-driver-and-earn.webp",
      darkTitle: "Make your Car with Driver work for you.",
      darkDesc: (
        <>Turn your {vehicleModel} Car with Driver into a daily earning asset with FindOnRent.</>
      ),

      lightTitle: (
        <>
          Have a {vehicleModel} {categoryName} to Rent Out in {locationName}?{" "}
          <span style={{ color: "#ff3600" }}>List it and Start Earning Today!</span>
        </>
      ),

      points: [
        <>Do you have a {vehicleModel} {categoryName} available for rent in {locationName}?</>,
        <>Looking to provide your {vehicleModel} {categoryName} for hire in {locationName}?</>,
        <>Want to turn your idle {vehicleModel} {categoryName} into a rental income?</>,
      ],

      bottomTitle: (
        <>Turn your {categoryName} into a steady source of income with</>
      ),
      bottomPeragraph: "India’s transparent marketplace for self-drive rentals.",
    },
  };

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

            <h2 className="fw-bold mb-sm-4 mb-3 text-white">{content.darkTitle}</h2>

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
                <li key={i} className="mb-2 d-flex align-items-center gap-2">
                  <LuCircleCheck size={20} style={{ color: "#139c01" }} />
                  <div>{text}</div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-start roh_redBtn mb-sm-5 mb-4">
              <a
                href={
                  isLoggedIn
                    ? `${WEB_BASE_DOMAIN_URL}/become-a-host`
                    : `${WEB_BASE_DOMAIN_URL}/register`
                }
                className="btn btn-lg px-5 fw-semibold"
              >
                Rent Your Item – It’s Free
              </a>
            </div>

            <h4 className="text-muted fw-medium mb-1">
              {content.bottomTitle}{" "}
              <strong className="fw-bold text-dark">
                Find<span style={{ color: "#ff3600" }}>On</span>Rent
              </strong>
            </h4>
            <p>{content.bottomPeragraph}</p>
          </div>
        </div>
      </div>
    </section>
  );
}