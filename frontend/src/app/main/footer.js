import { cookies } from "next/headers";
import FooterClient from "./FooterClient";
import fs from "fs/promises";
import path from "path";

export default async function Footer() {

  const cookieStore = await cookies();

  let city = null;
  const locationCookie = cookieStore.get("user_location");

  if (locationCookie?.value) {
    try {
      const parsed = JSON.parse(locationCookie.value);
      city = parsed?.city?.toLowerCase() || null;
    } catch {}
  }

  let categories = [];
  let trending = [];
  let categoryModels = [];
  let categoryModelsLocations = [];

  /* ===========================
     READ categories.json FIRST
  =========================== */
  try {
    const catRes = await fetch(
      `${process.env.BACKEND_JSON_DIR_PATH}categories.json`,
      { next: { revalidate: 3600 } }
    );

    if (catRes.ok) {
      categories = await catRes.json();
    }
  } catch (err) {
    console.log("Remote categories.json failed");
  }

  /* ===========================
     READ footer-data.json
  =========================== */
  try {
    const res = await fetch(
      `${process.env.BACKEND_JSON_DIR_PATH}footer-data.json`,
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const jsonData = await res.json();
      trending = jsonData?.trending || [];
      categoryModels = jsonData?.categoryModels || [];
      categoryModelsLocations = jsonData?.categoryModelsLocations || [];
    }
  } catch (err) {
    console.error("Footer JSON read error:", err.message);
  }

  /* ===========================
     LOCAL FALLBACK categories
  =========================== */
  if (!categories.length) {
    try {
      const localPath = path.join(process.cwd(), "data", "categories.json");
      const file = await fs.readFile(localPath, "utf8");
      categories = JSON.parse(file);
    } catch (err) {
      console.error("Local categories.json failed:", err.message);
    }
  }

  return (
    <FooterClient
      city={city}
      categories={categories}
      trending={trending}
      categoryModels={categoryModels}
      categoryModelsLocations={categoryModelsLocations}
    />
  );
}