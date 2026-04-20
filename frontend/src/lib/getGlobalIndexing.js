export async function getGlobalIndexing() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL}/get/site-setting`,
      { cache: 'no-store' }
    );

    const json = await res.json();

    const allow = json?.data?.find(
      (i) => i.roh_setting_key === 'allow_search_indexing'
    )?.roh_setting_value === '1';

    return allow; // true / false
  } catch {
    return false; // fail-safe: noindex
  }
}
