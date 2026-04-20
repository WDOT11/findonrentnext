"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslate() {
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setLoad(true);
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        };

        window.addEventListener("scroll", handleInteraction, { passive: true });
        window.addEventListener("click", handleInteraction);
        window.addEventListener("touchstart", handleInteraction, { passive: true });

        // Fallback: load after 7 seconds if no interaction
        const timer = setTimeout(() => {
            setLoad(true);
        }, 7000);

        return () => {
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            clearTimeout(timer);
        };
    }, []);

    if (!load) return null;

    return (
        <>
            <Script strategy="afterInteractive" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
            <Script id="google-translate-init" strategy="afterInteractive">
                {`
            window.googleTranslateElementInit = function() {
                new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,as,bn,brx,doi,gu,hi,kn,ks,gom,mai,ml,mni-Mtei,mr,ne,or,pa,sa,sat,sd,ta,te,ur',
                autoDisplay: false,
                }, 'google_translate_element');
            };
            `}
            </Script>
        </>
    );
}