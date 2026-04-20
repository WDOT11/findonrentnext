"use client";

// import { ArrowLeft, Check } from "react-bootstrap-icons";
import {LuArrowLeft, LuCheck } from "react-icons/lu";
// import { categories } from "./CategoryTabs";

// export const PreviewScreen = ({ items, onBack, onSubmit }) => {
export const PreviewScreen = ({ items, onBack, onSubmit, categories }) => {

  // Group items by category
  const itemsByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = items.filter((item) => item.category === cat.id);
    return acc;
  }, {});

  return (
    <div className="py-4">
      <div className="card border-0 shadow-sm p-4 mb-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={onBack}
          >
            {/* <ArrowLeft size={16} /> */}
            <LuArrowLeft size={16} />
            Back to Form
          </button>

          <h2 className="h4 fw-bold mb-0 text-center flex-grow-1">
            Preview All Items
          </h2>

          <div style={{ width: "120px" }}></div>
        </div>

        {/* Category Sections */}
        {categories.map((category) => {
          const categoryItems = itemsByCategory[category.id];
          if (!categoryItems || categoryItems.length === 0) return null;

          const Icon = category.icon;

          return (
            <div key={category.id} className="mb-5">
              {/* Category Header */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <Icon size={20} className="text-primary" />
                <h3 className="h5 fw-semibold mb-0">{category.label}</h3>
                <span className="text-muted small">
                  ({categoryItems.length}{" "}
                  {categoryItems.length === 1 ? "item" : "items"})
                </span>
              </div>

              {/* Grid of Cards */}
              <div className="row g-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                      {/* Image */}
                      <div
                        className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-top"
                        style={{ height: "180px" }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="img-fluid w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <span className="text-muted small">No Image</span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="card-body p-3">
                        <h5 className="fw-semibold mb-1 text-truncate">
                          {item.title}
                        </h5>
                        <p className="text-muted small mb-3 text-truncate">
                          {item.brand} {item.model ? `• ${item.model}` : ""}
                        </p>

                        <div className="small">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Price/Day:</span>
                            <strong className="text-primary">
                              ₹{item.pricePerDay || "0"}
                            </strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Deposit:</span>
                            <strong>₹{item.securityDeposit || "0"}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Status:</span>
                            <span className="text-capitalize">
                              {item.availability || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No items added yet</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center pt-3">
        <button
          type="button"
          className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2 px-5 py-3 fw-medium"
          onClick={onSubmit}
          disabled={items.length === 0}
        >
          {/* <Check size={20} /> */}
          <LuCheck size={20} />
          Save All Listings
        </button>
      </div>
    </div>
  );
};