// HeroBottomBullets.jsx
import styles from "./home.module.css";
import { LuBadgePercent, LuHandshake, LuShieldCheck, LuCheck } from "react-icons/lu";

export default function HeroBottomBullets() {
  return (
    <div className="col-12">
      <div className={styles.roh_bottom_title}>
        {/* <h2 className="text-center">Why Rent Through FindOnRent</h2> */}

        <ul className={styles.list_bottom}>
          <li>
            <span style={{ color: "#ff3600" }}>
              <LuBadgePercent size={20} aria-hidden="true" />
            </span>
            <span>Zero Commission</span>
          </li>
          <li>
            <span style={{ color: "#ff3600" }}>
              <LuHandshake size={20} aria-hidden="true" />
            </span>
            <span>Direct Vendor Bookings</span>
          </li>
          <li>
            <span style={{ color: "#ff3600" }}>
              <LuShieldCheck size={20} aria-hidden="true" />
            </span>
            <span>Hassle-free Rentals</span>
          </li>
        </ul>
          {/* FREE BADGE */}
          <div className="mt-4 mt-sm-5 d-block px-4 py-4 rounded-4 shadow-sm m-auto text-center" style={{maxWidth: "810px", backgroundColor: "#ffffffe0"}}>
            <div className="d-flex justify-content-center flex-column align-items-center gap-3">
              <div className="d-flex justify-content-center align-items-center p-2" style={{backgroundColor: "#c5f5df", borderRadius: "100px", height: "50px", width: "50px"}}><LuCheck size={24} aria-hidden="true" style={{ color: "#139c01" }}/></div>
            <div>
              <span className="text-center fw-bold">List for Free. Rent Out for Free.</span>
              <div className="small text-muted">
              No signup fees • No hidden charges • Get verified renters
              </div>
            </div>
            </div>
          </div>
      </div>
    </div>
  );
}
