'use client';
import styles from "../category/css/category.module.css";

const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL;

export default function ViewModel({ model, onClose }) {
  // 1. REMOVED: const [details, setDetails] = useState(model);
  // 2. REMOVED: const [loading, setLoading] = useState(true);

  // If model is null/undefined, don't render anything
  if (!model) return null;

  return (
    <div
      className={`${styles.modalOverlay} modal d-block`}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-md modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0">

          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title mb-0">Model Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4">

            {/* We use 'model' directly here.
                Since we checked "if (!model)" at the top, we know data exists.
            */}
            <div className="row g-3">

              {/* Model Image */}
              <div className="col-12 text-center mb-4">
                {model.image_url ? (
                  <img
                    src={`${WEB_BASE_URL}${model.image_url}`}
                    alt={model.model_name}
                    width={150}
                    height={150}
                    className={styles.viewImage}
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="p-4 bg-light text-muted d-inline-block"
                    style={{ width: '150px', height: '150px', lineHeight: '100px' }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <dl className="row px-3">

                <dt className="col-sm-4 text-secondary">Model Name:</dt>
                <dd className="col-sm-8 fw-bold">{model.model_name}</dd>

                <dt className="col-sm-4 text-secondary">Model Label:</dt>
                <dd className="col-sm-8 fw-bold">{model.model_label}</dd>

                <dt className="col-sm-4 text-secondary">Slug:</dt>
                <dd className="col-sm-8 text-muted">{model.model_slug}</dd>

                {model.brand_name && (
                  <>
                    <dt className="col-sm-4 text-secondary">Brand:</dt>
                    <dd className="col-sm-8">{model.brand_name}</dd>
                  </>
                )}

                {model.tag_name && (
                  <>
                    <dt className="col-sm-4 text-secondary">Tag:</dt>
                    <dd className="col-sm-8">{model.tag_name}</dd>
                  </>
                )}

                <dt className="col-sm-4 text-secondary">Status:</dt>
                <dd className="col-sm-8">
                  <span
                    className={
                      model.active == 1
                        ? styles.statusActive
                        : styles.statusInactive
                    }
                  >
                    {model.active == 1 ? "Active" : "Inactive"}
                  </span>
                </dd>

                <dt className="col-sm-12 text-secondary mt-3">Description:</dt>
                <dd className="col-sm-12 text-break">
                  {model.description || (
                    <span className="text-muted">—</span>
                  )}
                </dd>

              </dl>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}