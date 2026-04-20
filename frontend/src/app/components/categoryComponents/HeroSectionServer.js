import Image from "next/image";
import styles from "./vehiclelist.module.css";
// import HeroSearchClient from "./HeroSearchClient";

export default function HeroSectionServer({
  categorySinName,
  categoryFullName,
  brands,
  categorySlug,
}) {
  return (
    <section className={styles.hero_wrap}>
        <div
        className={styles.hero_section}
        style={{
            position: "relative",
            backgroundImage: "url(/images/homepg/bg-img-3.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >

        <div className={`container ${styles.hero_container}`}>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className={styles.main_heading}>
                <h1 className="mb-0 mb-sm-3">
                  {categorySinName} Rentals
                </h1>

                <nav className={styles.breadcrumbWrap}>
                  <ol className={styles.breadcrumbList}>
                    <li><a href="/">Home</a></li>
                    <li className={styles.separator}>›</li>
                    <li>{categoryFullName}</li>
                  </ol>
                </nav>
              </div>
            </div>

            {/* ⭐ Client Search injected */}
            {/* <HeroSearchClient
              brands={brands}
              categorySlug={categorySlug}
              categorySinName={categorySinName}
            />

            <div className="col-12 d-sm-block d-none">
              <div className="bottom_title">
                <ul className={styles.list_bottom}>
                  <li>Zero Commission</li>
                  <li>Direct Vendor Bookings</li>
                  <li>Hassle-free Rentals</li>
                </ul>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </section>
  );
}