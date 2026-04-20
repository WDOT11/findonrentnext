"use client";
import Image from "next/image";
import styles from "../../newdashboard.module.css";

export default function VehiclesView({
  isOpen,
  onClose,
  loading,
  item,
}) {
  if (!isOpen) return null;

  // --- DIRECT STATUS VALUES ---
  const itemStatus = Number(item?.item_status ?? 0);
  const adminStatus = Number(item?.admin_item_status ?? 0);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        {loading ? (
          <p>Loading item details...</p>
        ) : item ? (
          <>
            <button className={styles.modalClose} onClick={onClose}>×</button>

            <h2>{item.item_name}</h2>

            <p>
              <strong>Status:</strong> {itemStatus === 1 ? "Active" : "Inactive"}{" "}
              {adminStatus !== 1 && "(Admin pending)"}
            </p>

            <p>
              <strong>Description:</strong> {item.vehicle_description}
            </p>

            <div className={styles.roh_hosting_viewDetails_inner}>
              {/* PRICE SECTION */}
              <div className={styles.roh_sidebar_pricing}>
                <h3>
                  <sup>
                    <span>Starting from </span>
                  </sup>
                  ₹{item.price_per_day}
                  <span>/Per Day</span>
                </h3>

                <div className={styles.roh_productPrice}>
                  <div className={styles.roh_content_layer}>
                    <span>Per/Week:</span>
                    <span>₹{item.price_per_week}</span>
                  </div>

                  <div className={styles.roh_content_layer}>
                    <span>Per/Month:</span>
                    <span>₹{item.price_per_month}</span>
                  </div>
                </div>
              </div>

              {/* FEATURES LIST */}
              <div className={styles.roh_hostingOwner_info}>
                <ul className={styles.roh_check_list}>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/vehicle-category.svg" alt="Category" width={28} height={28} />
                      <h6>Category: <span>{item.category_name}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/brand.svg" alt="Brand" width={28} height={28} />
                      <h6>Brand: <span>{item.brand_name}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/vehicle-model.svg" alt="Model" width={28} height={28} />
                      <h6>Model: <span>{item.model_name}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-security-deposit.svg" alt="Deposit" width={28} height={28} />
                      <h6>Security Deposit: <span>₹{item.security_deposit}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/car-availability.svg" alt="Availability" width={28} height={28} />
                      <h6>Availability: <span>{item.availability_status}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-engine.svg" alt="Engine" width={28} height={28} />
                      <h6>Engine: <span>{item.engine_type}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-transmission.svg" alt="Transmission" width={28} height={28} />
                      <h6>Transmission: <span>{item.transmission_type}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-mileage.svg" alt="Fuel" width={28} height={28} />
                      <h6>Fuel Consumption: <span>{item.fuel_consumption} km/l</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-seats.svg" alt="Seats" width={28} height={28} />
                      <h6>Seating Capacity: <span>{item.seating_capacity}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-color.svg" alt="Color" width={28} height={28} />
                      <h6>Color: <span>{item.color}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/images/product-popup/car-condition.svg" alt="Condition" width={28} height={28} />
                      <h6>Vehicle Condition: <span>{item.vehicle_condition}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/rental-period.svg" alt="Period" width={28} height={28} />
                      <h6>Rental Period: <span>{item.rental_period}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/location.svg" alt="Location" width={28} height={28} />
                      <h6>Address: <span>{item.address_1}, {item.city}</span></h6>
                    </div>
                  </li>

                  <li>
                    <div className={styles.roh_featureList}>
                      <Image src="/address-pincode.svg" alt="Pincode" width={28} height={28} />
                      <h6>Pincode: <span>{item.pincode}</span></h6>
                    </div>
                  </li>

                </ul>
              </div>

              <p><strong>Booking Instructions:</strong> {item.booking_instructions}</p>
            </div>

          </>
        ) : (
          <p>Something went wrong.</p>
        )}
      </div>
    </div>
  );
}
