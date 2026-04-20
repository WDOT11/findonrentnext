"use client";
import React, { useState } from "react";
import NeedHelp from '../globalComponents/needHelp';
import "../globals.css";
import styles from '../vendor-old/vendorPage.module.css';
import Image from 'next/image';
import ViewCatDtlPop from '../vendor-old/components/viewcatdtlpop';
export default function VendorDetailsPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedCategory(null);
    };
    return (
        <>
            {/* Vendor profile  */}

            <section className="pt-5 pb-2 pb-md-2 pb-lg-2 mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className="roh_vendorProfile_wrap">
                                <div className={`${styles.roh_vendorProfile_inner}`}>
                                    <div className={`${styles.roh_img_wrap_single}`}>
                                        <Image src="/images/assets/team-4.jpg" alt="Vendor Image" width={300} height={364} />
                                    </div>
                                    <div className={`${styles.roh_img_content_right}`}>
                                        <div className={`${styles.roh_img_contentinner}`}>
                                            <div className="d-flex justify-content-start">
                                                <h1 className={`mb-2 ${styles.roh_vendorUsername}`}>Urban Drive Rentals, Delhi NCR</h1>
                                                <div className={`d-flex align-items-center gap-2 ms-3 ${styles.roh_verifiedbox}`}>
                                                    <Image src="/verified.svg" alt="Verified" width={35} height={35} />
                                                    <span className="d-block">Verified</span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-wrap align-items-center gap-2">
                                                <Image src="/vendor-location-icon-red.svg" alt="Map Icon" width={20} height={20} />

                                                <h4 className={`mb-0 ${styles.roh_about_user}`}>Karol Bagh, New Delhi, India</h4>
                                            </div>
                                        </div>
                                        <ul className={`d-flex flex-wrap ${styles.roh_contactinfo}`}>
                                            <li>
                                                <a href="tel:789 456 789">
                                                    <Image src="/vendor-call-red-icon.svg" alt="Call" width={35} height={35} />

                                                    <span><strong className="infotitle">Phone</strong>: +91-9876543210</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="mailto:xyz@gmail.com"> <Image src="/vendor-email-red-icon.svg" alt="Email" width={35} height={35} />

                                                    <span><strong className="infotitle">Email</strong>: urbandriverentals@gmail.com</span>
                                                </a>
                                            </li>

                                        </ul>
                                        <ul className={`${styles.roh_solial_medialink}`}>
                                            <li>
                                                <a target="_blank" href="#" rel="noopener">
                                                    <Image src="/facebook-icon.svg" alt="Facebook" width={25} height={25} />

                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#" rel="noopener">
                                                    <Image src="/twitter-x-icon.svg" alt="Twitter X" width={25} height={25} />

                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#" rel="noopener">
                                                    <Image src="/instagram-icon.svg" alt="Instagram" width={25} height={25} />

                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#" rel="noopener">
                                                    <Image src="/youtube-icon.svg" alt="Youtube" width={25} height={25} />

                                                </a>
                                            </li>
                                        </ul>

                                        {/* Categories */}
                                        <div className={`${styles.roh_verndorService_category}`}>
                                        <div className={styles.roh_categoryContent}>
                                            <button
                                            className={`${styles.roh_categoryBox}`}
                                            onClick={() => handleCategoryClick("Bike")}
                                            >
                                            <div className={`${styles.roh_back_circle}`}>
                                                <Image
                                                src="/bike-red-icon.svg"
                                                alt="Bike"
                                                width={60}
                                                height={60}
                                                />
                                            </div>
                                            Bike
                                            </button>

                                            <button
                                            className={`${styles.roh_categoryBox}`}
                                            onClick={() => handleCategoryClick("Scooty")}
                                            >
                                            <div className={`${styles.roh_back_circle}`}>
                                                <Image
                                                src="/scooty-red-icon.svg"
                                                alt="Scooty"
                                                width={60}
                                                height={60}
                                                />
                                            </div>
                                            Scooty
                                            </button>

                                            <button
                                            className={`${styles.roh_categoryBox}`}
                                            onClick={() => handleCategoryClick("Car")}
                                            >
                                            <div className={`${styles.roh_back_circle}`}>
                                                <Image
                                                src="/car-red-icon.svg"
                                                alt="Car"
                                                width={60}
                                                height={60}
                                                />
                                            </div>
                                            Car
                                            </button>

                                            <button
                                            className={`${styles.roh_categoryBox}`}
                                            onClick={() => handleCategoryClick("SUV")}
                                            >
                                            <div className={`${styles.roh_back_circle}`}>
                                                <Image
                                                src="/suv-red-icon.svg"
                                                alt="SUV"
                                                width={60}
                                                height={60}
                                                />
                                            </div>
                                            SUV
                                            </button>
                                        </div>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us / Business Overview */}

            <section className="mb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className={`${styles.roh_general_info_wrap}`}>
                                <div className="star_box">
                                    <div className="star_inner d-flex align-items-center gap-1">
                                        <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17" />
                                        <span className="roh_star_title">About Us</span>
                                    </div>
                                </div>
                                <h2>About Us / Business User</h2>
                                <p className="global_heading gray_global_heading media_desc ">At Urban Drive Rentals, we specialize in offering premium vehicle rentals to tourists, professionals, and locals alike. Whether you're looking for a stylish car for a weekend getaway or a powerful bike to cruise the coast, we've got the perfect ride for every journey. Our fleet is maintained to the highest standards, and our customer service is unmatched.</p>
                                <ul className={`${styles.roh_check_list}`}>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Over 8 Years in Business</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>100+ Vehicles Available</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Flexible Pickup &amp; Drop Timings</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Delivery Available Across Goa</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Multiple Payment Modes</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>4.8+ Star Rated by Customers</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className={`${styles.roh_general_info_wrap}`}>
                                <div className="star_box">
                                    <div className="star_inner d-flex align-items-center gap-1">
                                        <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17" />
                                        <span className="roh_star_title">Features</span>
                                    </div>
                                </div>
                                <h2>Services Offered</h2>

                                <ul className={`${styles.roh_check_list}`}>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Daily &amp; Weekly Rentals</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Airport Pickup/Drop</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Doorstep Delivery</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Self-Drive &amp; Chauffeur-Driven Options</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Corporate Rentals</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={`${styles.roh_list}`}>
                                            <Image src="/roh-list-icon.svg" alt="List Icon" width="20" height="20" />
                                            <span>Special Packages for Tourists</span>
                                        </div>
                                    </li>


                                </ul>
                            </div>

                            {/*------------------ Testimonials start --------*/}

                            <div className={` ${styles.roh_general_info_twowrap}`}>
                                <div className="star_box">
                                    <div className="star_inner d-flex align-items-center gap-1">
                                        <Image src="/images/homepg/star.svg" alt="star icon" width="19" height="17" />
                                        <span className="roh_star_title">Testimonials</span>
                                    </div>
                                </div>
                                <h2>Customer Testimonials</h2>

                                <div id="mainslider" className="owl-carousel owl-theme owl-loaded owl-drag d-none">




                                    <div className="owl-stage-outer owl-height" style={{ height: "206.761px" }}>
                                        <div className="owl-stage" style={{ transform: "translate3d(-1701px, 0px, 0px)", transition: "0.25s linear", width: "3403px" }}><div className="owl-item cloned" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap h-100">
                                                <div className="quots">

                                                </div>
                                                <div className="feedbacktext">
                                                    <p className="global_heading gray_global_heading media_desc mb-0">“We booked a Swift for 3 days in Goa. Super affordable and smooth ride!” </p>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Ananya Desai, Pune</h4>

                                                </div>
                                            </div>
                                        </div></div><div className="owl-item cloned" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap  h-100">
                                                <div>
                                                    <div className="quots">

                                                    </div>
                                                    <div className="feedbacktext">
                                                        <p className="global_heading gray_global_heading media_desc mb-0">“I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!” </p>
                                                    </div>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Nikhil Sharma, Mumbai</h4>
                                                    <p className="global_heading gray_global_heading media_desc ">John bringsM</p>
                                                </div>
                                            </div>
                                        </div></div><div className="owl-item cloned" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap h-100">
                                                <div className="quots">

                                                </div>
                                                <div className="feedbacktext">
                                                    <p className="global_heading gray_global_heading media_desc mb-0">“We booked a Swift for 3 days in Goa. Super affordable and smooth ride!” </p>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Ananya Desai, Pune</h4>

                                                </div>
                                            </div>
                                        </div></div><div className="owl-item" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap  h-100">
                                                <div>
                                                    <div className="quots">

                                                    </div>
                                                    <div className="feedbacktext">
                                                        <p className="global_heading gray_global_heading media_desc mb-0">“I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!” </p>
                                                    </div>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Nikhil Sharma, Mumbai</h4>
                                                    <p className="global_heading gray_global_heading media_desc ">John bringsM</p>
                                                </div>
                                            </div>
                                        </div></div><div className="owl-item active" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap h-100">
                                                <div className="quots">

                                                </div>
                                                <div className="feedbacktext">
                                                    <p className="global_heading gray_global_heading media_desc mb-0">“We booked a Swift for 3 days in Goa. Super affordable and smooth ride!” </p>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Ananya Desai, Pune</h4>

                                                </div>
                                            </div>
                                        </div></div><div className="owl-item cloned active" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap  h-100">
                                                <div>
                                                    <div className="quots">

                                                    </div>
                                                    <div className="feedbacktext">
                                                        <p className="global_heading gray_global_heading media_desc mb-0">“I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!” </p>
                                                    </div>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Nikhil Sharma, Mumbai</h4>
                                                    <p className="global_heading gray_global_heading media_desc ">John bringsM</p>
                                                </div>
                                            </div>
                                        </div></div><div className="owl-item cloned active" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap h-100">
                                                <div className="quots">

                                                </div>
                                                <div className="feedbacktext">
                                                    <p className="global_heading gray_global_heading media_desc mb-0">“We booked a Swift for 3 days in Goa. Super affordable and smooth ride!” </p>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Ananya Desai, Pune</h4>

                                                </div>
                                            </div>
                                        </div></div><div className="owl-item cloned" style={{ width: "425.34px" }}><div className="item">
                                            <div className="right_slide_imgwrap  h-100">
                                                <div>
                                                    <div className="quots">

                                                    </div>
                                                    <div className="feedbacktext">
                                                        <p className="global_heading gray_global_heading media_desc mb-0">“I rented a Royal Enfield from them and the experience was seamless. The bike was in excellent condition!” </p>
                                                    </div>
                                                </div>
                                                <div className="userinfo mt-1">
                                                    <h4>— Nikhil Sharma, Mumbai</h4>
                                                    <p className="global_heading gray_global_heading media_desc ">John bringsM</p>
                                                </div>
                                            </div>
                                        </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="owl-nav disabled"><button type="button" role="presentation" className="owl-prev"><span aria-label="Previous">‹</span></button><button type="button" role="presentation" className="owl-next"><span aria-label="Next">›</span></button>
                                    </div>
                                    <div className="owl-dots disabled"><button role="button" className="owl-dot active"><span></span></button>
                                    </div> */}
                                </div>
                            </div>
                            {/*------------------ Testimonials END --------*/}


                        </div>
                    </div>
                </div>
            </section>




            {/* need help component */}
            <NeedHelp />
            {/* Popup */}
            {showPopup && (
                <ViewCatDtlPop
                category={selectedCategory}
                onClose={closePopup}
                />
            )}
        </>
    )
}