import React from 'react';
import styles from './speed-test.module.css';

// This is a Server Component by default in Next.js App Router
export const metadata = {
  title: 'Ultimate Performance Speed Test | RentOrHire',
  description: 'Testing the speed and performance of our premium server-side rendered architecture.',
};

export default function SpeedTestPage() {
  return (
    <div className={styles.speedTestWrapper}>
      <div className={styles.container}>
        
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <h1>Next-Gen Rental Experience</h1>
          <p>
            This page is 100% Server-Side Rendered (SSR). Every pixel and every style is delivered 
            directly from the server to your browser, ensuring zero flash of unstyled content 
            and maximum performance.
          </p>
          <div className={styles.btnPrimary}>Get Started Now</div>
        </section>

        {/* FEATURES GRID */}
        <div className={styles.sectionTitle}>
          <h2>Why Our Platform Rules</h2>
          <p>Built with cutting-edge technology for the fastest user experience.</p>
        </div>
        
        <div className={styles.cardGrid}>
          {[
            { title: 'Ultra Fast Load', desc: 'Optimized assets and server-side logic ensure your pages load in milliseconds.' },
            { title: 'Global Scalability', desc: 'Our infrastructure is designed to handle millions of requests without breaking a sweat.' },
            { title: 'Premium Security', desc: 'Bank-grade encryption for all your transactions and sensitive data.' },
            { title: 'Smart Search', desc: 'Find exactly what you need with our AI-powered filtering and search engine.' },
            { title: 'Real-time Updates', desc: 'Never miss a deal with instant notifications and live availability tracking.' },
            { title: 'Seamless UI', desc: 'A fluid, intuitive interface that works beautifully on every device.' }
          ].map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardIcon}>0{i + 1}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS SECTION */}
        <section className={styles.howItWorks}>
          <div className={styles.container}>
            <div className={styles.sectionTitle}>
              <h2>How It Works</h2>
              <p>Three simple steps to your dream rental.</p>
            </div>
            <div className={styles.stepGrid}>
              {[
                { title: 'Choose Your Car', desc: 'Browse our extensive catalog of premium vehicles.' },
                { title: 'Book Instantly', desc: 'Secure your rental with our 1-click booking system.' },
                { title: 'Enjoy Your Ride', desc: 'Pick up your keys and hit the road with total confidence.' }
              ].map((step, i) => (
                <div key={i} className={styles.stepItem}>
                  <div className={styles.stepNumber}>0{i + 1}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className={styles.testimonials}>
          <div className={styles.sectionTitle}>
            <h2>What Our Users Say</h2>
            <p>Don't just take our word for it—listen to our happy customers.</p>
          </div>
          <div className={styles.testimonialGrid}>
            {[
              { name: 'John Doe', text: '“The fastest car rental site I’ve ever used. The booking was done in seconds!”' },
              { name: 'Sarah Smith', text: '“The interface is so premium and smooth. I love how it feels on my phone.”' },
              { name: 'Mike Johnson', text: '“Reliable, fast, and secure. RentOrHire is my go-to platform for all my travels.”' }
            ].map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>{t.text}</p>
                <p className={styles.testimonialAuthor}>- {t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ADDITIONAL LARGE CONTENT BLOCK FOR PRESSURE TEST */}
        <section style={{ padding: '80px 0', borderTop: '1px solid #222' }}>
          <div className={styles.sectionTitle}>
            <h2>Enterprise Infrastructure</h2>
            <p>Powering thousands of rentals every single day.</p>
          </div>
          <div style={{ color: '#666', lineHeight: '2', fontSize: '1rem', columns: '2', gap: '40px' }}>
            <p>
              Our platform is built on a distributed architecture that spans multiple regions across the globe. 
              By leveraging edge computing and server-side rendering, we minimize the physical distance 
              between our data and our users. This results in incredibly low latency and a browsing experience 
              that feels instantaneous. We utilize advanced caching strategies at every layer of our stack, 
              from the database to the CDN, ensuring that even under heavy load, our response times remain consistent.
            </p>
            <p>
              Security is at the core of everything we build. Our systems are continuously monitored for vulnerabilities 
              and undergo regular third-party audits. We implement zero-trust networking principles and ensure 
              that all data is encrypted both in transit and at rest. Furthermore, our deployment pipeline is fully 
              automated, allowing us to push updates and security patches with zero downtime. This commitment 
              to architectural excellence is what allows RentOrHire to remain the most trusted name in the industry.
            </p>
          </div>
        </section>

        <footer style={{ marginTop: '100px', textAlign: 'center', padding: '40px 0', borderTop: '1px solid #111', color: '#444' }}>
          <p>&copy; 2026 RentOrHire Performance Lab. All rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
