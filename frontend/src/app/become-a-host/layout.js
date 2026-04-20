import styles from "./become.module.css";
export default function OnboardingLayout({ children }) {
  return (
    <> 
    <div className={`${styles.roh_beacome_host}`}>
      <div>
      {/* <div style={{ marginBottom: 20 }}>
        <h1>Host Onboarding</h1>
        <p>Follow the steps to list your vehicle</p>
      </div> */}

      <main>{children}</main>
    </div>
    </div>
    </>
  );
}
