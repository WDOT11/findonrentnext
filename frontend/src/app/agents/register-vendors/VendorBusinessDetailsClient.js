"use client";

import { useEffect, useState } from "react";
import styles from "./become.module.css";
import CarForm from "./AddCars";
import BikeForm from "./AddBikes";
import ScooterForm from "./AddScooters";
import CarWithDriverForm from "./AddCarWithDriver";
import PrivateAircraftForm from "./AddAircraft";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_USER_URL;

export default function BusinessDetailsStep({ data, setData, onBack, onNext }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ------------------------------------------------
    FETCH CATEGORIES & AUTO-SELECT VEHICLE (ID: 1)
  ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(`${API_BASE_URL}/getallactivecategory`);
        const json = await res.json();
        const fetchedCategories = Array.isArray(json) ? json : [];
        setCategories(fetchedCategories);

        const hasVehicle = fetchedCategories.find((c) => String(c.id) === "1");
        if (hasVehicle && !data.categories.includes(hasVehicle.id)) {
          handleCategorySelect([hasVehicle.id]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  /* ------------------------------------------------
    FETCH SUBCATEGORIES
  ------------------------------------------------ */
  useEffect(() => {
    if (!data.categories?.length) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getallactivechildcategory`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parent_category_id: data.categories }),
        });
        const json = await res.json();
        setSubCategories(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [data.categories]);

  /* ------------------------------------------------
    FETCH STATES
  ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/getallactivestates`);
        const json = await res.json();
        setStates(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ------------------------------------------------
    FETCH CITIES BY STATE
  ------------------------------------------------ */
  const fetchCities = async (stateId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/getcitiesbystate/${stateId}`);
      const json = await res.json();
      setCities(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setCities([]);
    }
  };

  /* ------------------------------------------------
    HANDLERS
  ------------------------------------------------ */
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    const selectedState = states.find(
      (s) => String(s.state_id) === String(stateId)
    );

    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state_id: stateId,
        state_slug: selectedState?.state_slug || "",
        state_name: selectedState?.state_name || "",
        city_id: "",
        city_slug: "",
      },
    }));

    if (stateId) {
      fetchCities(stateId);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const selectedCity = cities.find(
      (c) => String(c.city_id) === String(cityId)
    );

    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city_id: cityId,
        city_name: selectedCity?.city_name || "",
        city_slug: selectedCity?.city_slug || "",
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setData((p) => ({
        ...p,
        address: { ...p.address, [field]: value },
      }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleCategorySelect = (ids) => {
    setData((prev) => ({
    ...prev,
    categories: ids,
    subCategories: [],
    subCategoryDetails: [],
    itemsBySubCategory: {},
    }));
  };

  const handleSubCategoryChange = (sub) => {
    const isAlreadySelected = data.subCategories.includes(sub.id);

    setData((prev) => ({
      ...prev,
      subCategories: isAlreadySelected
        ? prev.subCategories.filter((id) => id !== sub.id)
        : [...prev.subCategories, sub.id],
      subCategoryDetails: isAlreadySelected
        ? prev.subCategoryDetails.filter((s) => s.id !== sub.id)
        : [...prev.subCategoryDetails, { id: sub.id, name: sub.name }],
    }));
  };

  // const handleNext = () => {
  //   if (
  //     !data.businessName ||
  //     !data.address.state_id ||
  //     !data.address.city_id ||
  //     !data.subCategories.length
  //   ) {
  //     alert("Please fill all required fields.");
  //     return;
  //   }
  //   onNext();
  // };
  const handleNext = () => {
    // 1. Basic Business Validations
    if (
      !data.businessName?.trim() ||
      !data.address.streetAddress?.trim() ||
      !data.address.state_id ||
      !data.address.city_id ||
      !data.address.pinCode ||
      !data.subCategories.length
    ) {
      alert("Please fill all required business details and select at least one service.");
      return;
    }

    // 2. Dynamic Item Validations (Brand, Model, Car Name)
    for (const sub of data.subCategoryDetails) {
      const items = data.itemsBySubCategory[sub.id] || [];

      // If a subcategory is selected, it must have at least one item
      if (items.length === 0) {
        alert(`Please add at least one item for ${sub.name}`);
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemLabel = `${sub.name} #${i + 1}`;

        if (!item.brand_id) {
          alert(`Please select a Brand for ${itemLabel}`);
          return;
        }
        if (!item.model_id) {
          alert(`Please select a Model for ${itemLabel}`);
          return;
        }
        if (!item.title || !item.title.trim()) {
          alert(`Please enter a Name/Title for ${itemLabel}`);
          return;
        }
      }
    }

    onNext();
  };

  return (
    <div className="roh_register_content">
      <main className="rohuserres_shell">
        <section className="rohuserres_card">
          <h1 className="rohuserres_title text-center mb-4">Business Details</h1>

          <div className="mb-3">
            <label className="form-label fw-bold">Business Name *</label>
            <input className="form-control" placeholder="Enter Business Name" name="businessName" value={data.businessName} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Business Description (Optional)</label>
            <textarea type="textarea" className="form-control" placeholder="Enter Business Description" name="businessDesc" value={data.businessDesc} onChange={handleChange}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">GST Number (optional)</label>
            <input className="form-control" placeholder="Enter GST Number" name="gstNumber" value={data.gstNumber} onChange={handleChange} />
          </div>

          <hr className="my-4" />
          <h4 className="mb-3">Business Address</h4>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Street Address *</label>
              <input className="form-control" placeholder="Street, Building, Area" name="address.streetAddress" value={data.address.streetAddress} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">State *</label>
              <select className="form-control" value={data.address.state_id} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.state_id} value={s.state_id}>
                    {s.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">City *</label>
              <select className="form-control" value={data.address.city_id} onChange={handleCityChange} disabled={!cities.length}>
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Pincode *</label>
              <input className="form-control" placeholder="6-digit Pincode" maxLength={6} value={data.address.pinCode}
                onChange={(e) => handleChange({ target: { name: "address.pinCode", value: e.target.value.replace(/\D/g, "") }})} />
            </div>
          </div>

          <hr className="my-4" />

          {/* SUBCATEGORIES USING BRAND TAB STYLING */}
          {subCategories.length > 0 && (
            <div className="mb-4">
              <label className="form-label fw-bold mb-3">Select Service Types *</label>
              <div className="d-flex flex-wrap gap-2">
                {subCategories.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    // REUSING YOUR BRAND TAB CLASSES
                    className={data.subCategories.includes(sub.id) ? styles.roh_brandtab_active : styles.roh_brandtab}
                    onClick={() => handleSubCategoryChange(sub)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC FORMS */}
          {data.subCategoryDetails?.map((sub) => {
            const name = sub.name.toLowerCase();
            return (
              <div key={sub.id} className="mt-5 border-top pt-4">
                <h3 className="mb-3 fw-bold">{sub.name}</h3>
                {name.includes("car") && !name.includes("driver") && <CarForm subCategory={sub} data={data} setData={setData} />}
                {name.includes("bike") && <BikeForm subCategory={sub} data={data} setData={setData} />}
                {name.includes("scooter") && <ScooterForm subCategory={sub} data={data} setData={setData} />}
                {name.includes("driver") && <CarWithDriverForm subCategory={sub} data={data} setData={setData} />}
                {name.includes("aircraft") && <PrivateAircraftForm subCategory={sub} data={data} setData={setData} />}
              </div>
            );
          })}

          <div className="d-flex justify-content-between mt-5 pt-3 border-top">
            <button className="btn btn-light px-4" onClick={onBack}>Back</button>
            <button className="btn btn-primary px-4" onClick={handleNext}>Continue</button>
          </div>
        </section>
      </main>
    </div>
  );
}