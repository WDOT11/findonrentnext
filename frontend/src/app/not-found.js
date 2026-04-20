"use client";
import './globals.css';
import styles from "./notfound.module.css";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <div
        className={`relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center overflow-hidden ${styles.roh_mainWraper404}`}>
        < div className="container">

          <div className={`relative z-10 text-center px-6 animate-fadeIn ${styles.roh_page404Inner}`}>
            {/* 404 Image */}
            <Image src="/404-page-image.png" alt="404 Image" width={640} height={438} style={{ width: 'auto', height: 'auto' }} />
            {/* Message */}
            <h2 className={`text-3xl md:text-4xl text-dark font-bold mt-4 drop-shadow`}>
              Oops! Page Not Found
            </h2>
            <p className="mt-3 text-lg text-gray-200 max-w-xl mx-auto">
              The page you’re looking for doesn’t exist.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <div className="d-flex align-items-center justify-content-center roh_redBtns">
                <div className="roh_button_custom"><a href="/">Back To Home</a></div>
                <div className="roh_circl_btn">
                  <a href="/"><Image src="/arrow.svg" alt="Arrow Right" width={30} height={30} /></a>
                </div>
              </div>

            </div>
          </div>


          {/* Floating circles animation */}
          <div className="absolute w-72 h-72 bg-red-500/30 rounded-full top-10 left-10 animate-pulse"></div>
          <div className="absolute w-64 h-64 bg-orange-500/30 rounded-full bottom-10 right-10 animate-ping"></div>
        </div>
      </div>
    </>
  );
}
