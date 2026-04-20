'use client';
import { useEffect, useState } from 'react';
import styles from './viewvehiclepopup.module.css';
import { getAuthToken } from '../../../../../utils/utilities';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ViewVehiclePopup({ vehicleId, onClose }) {
  const token = getAuthToken();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);

  const [currentImg, setCurrentImg] = useState(0);

  // useEffect(() => {
  //   if (vehicleId) fetchVehicle();
  // }, [vehicleId]);


  useEffect(() => {
    if (vehicleId) fetchVehicle();

    const handleEsc = (e) => {
      if (e.key === "Escape" && vehicleId) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };

  }, [vehicleId, onClose]);
  async function fetchVehicle() {
    try {
      const res = await fetch(`${API_ADMIN_BASE_URL}/product/adminvehicleview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicle_id: vehicleId })
      });

      const data = await res.json();
      if (data.success) {
        setVehicle(data.vehicle);
      }
      setLoading(false);

    } catch (err) {
      console.error("Fetch vehicle error:", err);
      setLoading(false);
    }
  }

  if (!vehicleId) return null;

  const images = vehicle?.images || [];

  const handlePrev = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className={`${styles.overlay} modal d-block`} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }} 
      tabIndex="-1" 
      role="dialog" 
      aria-modal="true" 
      onClick={onClose}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '24px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards', maxHeight: '90vh' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', padding: '24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Vehicle Data</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-0" style={{ background: '#f8fafc' }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : !vehicle ? (
              <div className="p-5 text-center text-muted"><h4>No data found</h4></div>
            ) : (
              <div className="container-fluid p-4">
                 
                 {/* Main Grid: Images + Overview */}
                 <div className="row g-4 mb-4">
                   
                   {/* Left: Images */}
                   <div className="col-lg-5">
                      <div className="position-relative rounded-4 overflow-hidden border border-4 border-white shadow-sm" style={{ aspectRatio: '4/3', backgroundColor: '#e2e8f0' }}>
                         {images.length > 0 ? (
                            <img 
                               src={`${WEB_BASE_URL}${images[currentImg].file_path}${images[currentImg].file_name}`} 
                               alt="Vehicle" 
                               className="w-100 h-100" 
                               style={{ objectFit: 'cover' }} 
                            />
                         ) : (
                            <div className="d-flex w-100 h-100 align-items-center justify-content-center bg-white">
                               <span style={{ fontSize: '48px' }}>🚗</span>
                            </div>
                         )}
                      </div>
                      
                      {/* Thumbnails */}
                      {images.length > 1 && (
                         <div className="d-flex gap-2 mt-3 overflow-auto pb-2" style={{ MsOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {images.map((img, index) => (
                               <div 
                                 key={img.id || index} 
                                 onClick={() => setCurrentImg(index)}
                                 className="rounded-3 overflow-hidden flex-shrink-0 shadow-sm transition-all"
                                 style={{ 
                                   width: '64px', height: '64px', cursor: 'pointer', 
                                   border: currentImg === index ? '3px solid #2563eb' : '3px solid transparent', 
                                   opacity: currentImg === index ? 1 : 0.6 
                                 }}
                               >
                                  <img src={`${WEB_BASE_URL}${img.file_path}${img.file_name}`} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   {/* Right: Overview & Pricing */}
                   <div className="col-lg-7 d-flex flex-column">
                      <h2 className="fw-bolder text-dark mb-2" style={{ color: '#0f172a' }}>{vehicle.item_name}</h2>
                      
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm" style={{ letterSpacing: '0.5px' }}>{vehicle.category_name}</span>
                        {vehicle.sub_category_name && <span className="badge bg-secondary opacity-75 px-3 py-2 rounded-pill shadow-sm">{vehicle.sub_category_name}</span>}
                        {vehicle.brand_name && <span className="badge bg-dark px-3 py-2 rounded-pill shadow-sm">{vehicle.brand_name}</span>}
                      </div>

                      <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {vehicle.vehicle_description || "No specific description available for this vehicle."}
                      </p>

                      <div className="row g-3">
                         {/* Provider Info */}
                         <div className="col-sm-6">
                            <div className="p-3 bg-white rounded-4 shadow-sm border border-light h-100">
                              <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Provider Details</div>
                              <div className="fw-bold text-dark fs-6">{vehicle.sp_first_name} {vehicle.sp_last_name}</div>
                              <div className="text-muted small text-truncate" title={vehicle.business_name}>{vehicle.business_name}</div>
                            </div>
                         </div>

                         {/* Pricing */}
                         <div className="col-sm-6">
                            <div className="p-3 bg-white rounded-4 shadow-sm border border-light h-100">
                              <div className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Pricing Strategy</div>
                              <div className="fw-bolder text-success" style={{ fontSize: '1.2rem' }}>
                                 ₹{vehicle.price_per_day} <span className="text-muted fw-normal" style={{ fontSize: '0.85rem' }}>/ day</span>
                              </div>
                              <div className="text-muted small mt-1">
                                 ₹{vehicle.price_per_month} / mo • Dep: ₹{vehicle.security_deposit}
                              </div>
                            </div>
                         </div>
                      </div>
                   </div>

                 </div>

                 {/* Lower Grid: Sections */}
                 <div className="row g-4 mt-2">
                    
                    {/* Vehicle Attributes */}
                    <div className="col-md-6">
                       <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-light">
                          <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1e293b' }}>
                             <span className="bg-info bg-opacity-10 text-info p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>⚙️</span> 
                             Vehicle Specifications
                          </h6>
                          <div className="d-flex flex-column gap-3">
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Transmission</span><span className="fw-bold text-dark">{vehicle.transmission_type}</span></div>
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Engine / Fuel</span><span className="fw-bold text-dark">{vehicle.engine_type} ({vehicle.fuel_consumption})</span></div>
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Seating Capacity</span><span className="fw-bold text-dark">{vehicle.seating_capacity} Seats</span></div>
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Color</span><span className="fw-bold text-dark">{vehicle.color}</span></div>
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Model</span><span className="fw-bold text-dark">{vehicle.model_name || '-'}</span></div>
                             <div className="d-flex justify-content-between border-bottom pb-2 border-opacity-50"><span className="text-muted fw-medium">Vehicle Type</span><span className="fw-bold text-dark">{vehicle.vehicle_type}</span></div>
                             
                             <div className="d-flex justify-content-between pt-1 align-items-center">
                               <span className="text-muted fw-medium">Registration</span>
                               <span className="fw-bold text-dark bg-light px-3 py-1 rounded-2 shadow-sm border border-secondary border-opacity-25" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>{vehicle.registration_number}</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Right column for Location and Terms */}
                    <div className="col-md-6 d-flex flex-column gap-4">
                       
                       {/* Location */}
                       <div className="bg-white p-4 rounded-4 shadow-sm border border-light flex-grow-1">
                          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1e293b' }}>
                             <span className="bg-danger bg-opacity-10 text-danger p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>📍</span> 
                             Pickup Location
                          </h6>
                          <div className="text-dark bg-light p-3 rounded-4" style={{ fontSize: '0.95rem', lineHeight: '1.6', border: '1px solid #f1f5f9' }}>
                             <div className="fw-bold mb-1 text-primary">{vehicle.address_1}</div>
                             <div className="text-muted mb-2">{vehicle.landmark && `Landmark: ${vehicle.landmark}`}</div>
                             <div className="d-flex align-items-center gap-2 mt-2 pt-2 border-top flex-wrap">
                               <span className="badge bg-secondary bg-opacity-10 text-dark border">{vehicle.city}</span>
                               <span className="badge bg-secondary bg-opacity-10 text-dark border">{vehicle.item_state}</span>
                               <span className="badge bg-secondary bg-opacity-10 text-dark border">{vehicle.pincode}</span>
                             </div>
                          </div>
                       </div>

                       {/* Terms */}
                       <div className="bg-white p-4 rounded-4 shadow-sm border border-light">
                          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1e293b' }}>
                             <span className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>📝</span> 
                             Booking Terms
                          </h6>
                          <div className="text-muted fst-italic p-3 bg-light rounded-4" style={{ fontSize: '0.85rem', lineHeight: '1.6', border: '1px solid #f1f5f9' }}>
                             {vehicle.booking_terms || "No specific booking terms provided by the host."}
                          </div>
                       </div>

                    </div>

                 </div>

              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        /* Hide scrollbar for images row */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
