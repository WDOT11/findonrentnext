"use client";
import { useEffect, useState } from "react";
import styles from "../newdashboard.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

/* helpers */
const toStr = (v) => (v == null ? "" : String(v).trim());
const toDigits = (v, len) => toStr(v).replace(/\D/g, "").slice(0, len);

export default function BusinessDetailsView() {
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    business_name: "",
    business_slug: "",
    gst_number: "",
    phone_number: "",
    street_address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    categories: [], // merged list
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  /* ------------------- LOAD BUSINESS DETAILS ------------------- */
  useEffect(() => {
    const authUser = getCookie("authUser");
    if (!authUser) return;
    const parsed = JSON.parse(authUser);

    if (parsed?.id) {
      setUserId(parsed.id);
      fetchBusinessDetails(parsed.id);
    }
  }, []);

  async function fetchBusinessDetails(uid) {
    try {
      const res = await fetch(`${API_BASE_URL}/getserbusinessdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid }),
      });

      const { business, address, categories } = await res.json();

      setFormData((s) => ({
        ...s,
        business_name: toStr(business.business_name),
        business_slug: toStr(business.business_slug),
        gst_number: toStr(business.gst_number),
        phone_number: toDigits(business.phone_number, 10),

        street_address: toStr(address?.street_address),
        landmark: toStr(address?.landmark),
        city: toStr(address?.city),
        state: toStr(address?.state),
        pincode: toDigits(address?.pincode, 6),

        categories: categories || [], // TEMP, will merge later
      }));

      // Now load child categories
      fetchChildCategories(categories);
    } catch (err) {
      console.error(err);
    }
  }

  /* ------------------- FETCH CHILD CATEGORIES ------------------- */
  async function fetchChildCategories(selectedCategories) {
    try {
      const res = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent_category_id: 1 }),
      });

      const data = await res.json();

      mergeCategorySelection(data, selectedCategories);
    } catch (err) {
      console.error("Child categories fetch error:", err);
    }
  }

  /* ------------------- MERGE SELECTED + UNSELECTED ------------------- */
  function mergeCategorySelection(allChildCats, selected) {
    // selected is the original DB selected category list
    const selectedMap = new Map();
    selected.forEach((s) => {
      selectedMap.set(s.sub_category_id, s.fleet_size);
    });

    const finalList = allChildCats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      sub_category_id: cat.id,
      category_id: 1,
      checked: selectedMap.has(cat.id),
      fleet_size: selectedMap.get(cat.id) || "",
    }));

    setFormData((s) => ({
      ...s,
      categories: finalList,
    }));

    setLoading(false);
  }

  /* ------------------- Handle Input Change ------------------- */
    const handleChange = (e) => {
        let { id, value } = e.target;

        if (id === "phone_number") value = toDigits(value, 10);
        else if (id === "pincode") value = toDigits(value, 6);
        else value = value; // allow spaces

        setFormData((s) => ({ ...s, [id]: value }));
        setErrors((s) => ({ ...s, [id]: "" }));
    };


  /* ------------------- Checkbox Change ------------------- */
  const handleCategoryCheck = (index, checked) => {
    setFormData((prev) => {
      const copy = [...prev.categories];
      copy[index].checked = checked;
      return { ...prev, categories: copy };
    });
  };

  /* ------------------- Fleet Size Change ------------------- */
  const handleFleetChange = (index, val) => {
    setFormData((prev) => {
      const copy = [...prev.categories];
      copy[index].fleet_size = toDigits(val, 3);
      return { ...prev, categories: copy };
    });
  };

  /* ------------------- Validate ------------------- */
  const validate = () => {
    const newErrors = {};

    if (!formData.business_name)
      newErrors.business_name = "Business name required.";
    if (formData.phone_number.length !== 10)
      newErrors.phone_number = "Phone must be 10 digits.";
    if (formData.pincode.length !== 6)
      newErrors.pincode = "Pincode must be 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------- Submit ------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Only selected categories
    const selectedCats = formData.categories
      .filter((c) => c.checked)
      .map((c) => ({
        category_id: 1,
        sub_category_id: c.sub_category_id,
        fleet_size: c.fleet_size || null,
      }));

    const payload = {
      user_id: userId,
      business_name: formData.business_name,
      business_slug: formData.business_slug,
      gst_number: formData.gst_number,
      phone_number: formData.phone_number,

      street_address: formData.street_address,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,

      categories: selectedCats, // send final selected
    };

    try {
      const res = await fetch(`${API_BASE_URL}/updateserbusinessdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Business Details Updated Successfully");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  /* ------------------- UI ------------------- */
  return (
    <div className={styles.viewSection}>
      <h2 className={styles.pageTitle}>Business Details</h2>

      <div className={styles.card}>
        <form className={styles.editForm} onSubmit={handleSubmit}>

          {/* Business Info */}
            <div className={styles.formGroup}>
              <label>Business Name</label>
              <input
                id="business_name"
                value={formData.business_name}
                onChange={handleChange}
              />
              {errors.business_name && (
                <p className={styles.errorText}>{errors.business_name}</p>
              )}
            </div>



          {/* Phone */}
          <div className={`${styles.formRow} ${styles.formRow4Mob}`}>
             <div className={styles.formGroup}>
              <label>GST Number</label>
              <input
                id="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && (
                <p className={styles.errorText}>{errors.phone_number}</p>
              )}
            </div>


          </div>

          {/* Address */}
          <div className={`${styles.formRow} ${styles.formRow4Mob}`}>
            <div className={styles.formGroup}>
              <label>Street Address</label>
              <input
                id="street_address"
                value={formData.street_address}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Landmark</label>
              <input
                id="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={`${styles.formRow}`}>
            <div className={styles.formGroup}>
              <label>City</label>
              <input id="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>State</label>
              <input id="state" value={formData.state} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Pincode</label>
              <input
                id="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
              {errors.pincode && (
                <p className={styles.errorText}>{errors.pincode}</p>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className={`${styles.formRow} ${styles.formRow4Mob} mt-4`}>
            <div className={styles.formGroup}>
              <label>Select Subcategories</label>

              <div className={styles.catListBox}>
                {formData.categories.map((cat, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <div className="d-flex gap-2">
                    <div className={styles.roh_business_checkbox}>
                    <input
                      type="checkbox"
                      checked={cat.checked}
                      onChange={(e) =>
                        handleCategoryCheck(i, e.target.checked)
                      }
                    />
                    </div>

                    <span style={{ width: "150px" }}>{cat.name}</span>
                    </div>

                    <input
                      placeholder="Fleet Size"
                      value={cat.fleet_size}
                      onChange={(e) =>
                        handleFleetChange(i, e.target.value)
                      }
                      style={{ width: "100%", maxWidth: "100px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.formActions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Save Changes
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => history.back()}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
