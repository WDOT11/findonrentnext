// ItemSummaryCard.js

"use client";

// import { Pencil, Trash, Image } from "react-bootstrap-icons";
import { BsPencil, BsTrash, BsImage } from "react-icons/bs";
import styles from "../additem.module.css";

export const ItemSummaryCard = ({ item, onEdit, onDelete }) => {

    // access the image URLs array
    const imageUrls = Array.isArray(item.image) ? item.image : [];

    // Get the primary image URL (the first one)
    const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

    return (
        <div className={`card shadow-sm hover-shadow ${styles.roh_additemsPriview_summary}`}>
            <div className="card-body p-3">
                <div className="row g-3 align-items-center">
                    {/* Image Section */}
                    <div className="col-12 col-sm-2">
                        <div className={`bg-light rounded overflow-hidden d-flex align-items-center justify-content-center ${styles.roh_summery_imgWrapper}`}>
                            {/* Use primaryImageUrl for the src */}
                            {primaryImageUrl ? (
                                <img src={primaryImageUrl || "/iteams-deafault-img.webp"} alt={item.title} className="img-fluid w-100 h-100 object-fit-cover"/>
                            ) : (
                                // <BsImage size={36} className="text-secondary" />
                                <img src="/iteams-deafault-img.webp" alt={item.title} className="img-fluid w-100 h-100 object-fit-cover"/>
                            )}
                        </div>
                        {/* Show count of additional images */}
                        {imageUrls.length > 1 && (
                            <div className="text-center mt-1">
                                <span className="badge bg-secondary text-light">
                                    +{imageUrls.length - 1} Photos
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="col-12 col-sm-10">
                        <div className="d-flex justify-content-between align-items-start" style={{ borderBottom: "1px solid #0000000f" }}>
                            <div>
                                <h5 className={`fw-semibold mb-1 text-truncate ${styles.roh_summeryCard_title}`}>{item.title}</h5>
                            </div>

                            {/* Edit/Delete Buttons */}
                            <button type="button" className={`btn btn-sm ${styles.roh_deleteBtn_icon}`} title="Delete"
                                // onEdit is commented out, using onDelete
                                onClick={() => onDelete(item.id)} style={{lineHeight: "1em"}}
                            >
                                <BsTrash size={16} />
                            </button>

                        </div>
                        <p className="text-muted small mt-2 mb-0">
                            {/* Assuming item.brand and item.model are available in 'item' object */}
                            {item.brand} {item.model ? `• ${item.model}` : ""}
                        </p>
                        {/* Info Grid */}
                        <div className={styles.roh_summery_list_grid}>
                            <div className={styles.roh_summeryList_items}>
                                <strong className="text-dark">Price/Day:</strong>{" "}
                                <span className={`fw-medium ${styles.text_orange}`}>
                                    ₹{item.pricePerDay || "0"}
                                </span>
                            </div>
                            <div className={styles.roh_summeryList_items}>
                                <strong className="text-dark">Deposit:</strong>{" "}
                                <span className="fw-medium">
                                    ₹{item.securityDeposit || "0"}
                                </span>
                            </div>
                            <div className={styles.roh_summeryList_items}>
                                <strong className="text-dark">Transmission:</strong>{" "}
                                <span className="fw-medium">{item.transmission || "N/A"}</span>
                            </div>
                            <div className={styles.roh_summeryList_items}>
                                <strong className="text-dark">Availability Status:</strong>{" "}
                                <span className="text-capitalize fw-medium">
                                    {item.availability || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};