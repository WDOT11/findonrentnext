'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from "../../../utils/utilities";
import styles from './setting.module.css';

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;

export default function SiteSettingsPage() {
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [settings, setSettings] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /* FETCH SAVED SITE SETTINGS */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getAuthToken();

        const res = await fetch(`${API_ADMIN_BASE_URL}/get/site-setting`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (!json?.status || !Array.isArray(json.data)) return;

        // allow_search_indexing
        const indexingSetting = json.data.find(
          (item) => item.roh_setting_key === 'allow_search_indexing'
        );

        if (indexingSetting) {
          setAllowIndexing(indexingSetting.roh_setting_value === '1');
        }

        // Other settings
        const otherSettings = json.data
          .filter(
            (item) => item.roh_setting_key !== 'allow_search_indexing'
          )
          .map((item) => ({
            key: item.roh_setting_key,
            value: item.roh_setting_value,
          }));

        setSettings(
          otherSettings.length > 0
            ? otherSettings
            : [{ key: '', value: '' }]
        );
      } catch (err) {
        console.error('Failed to load site settings', err);
      }
    };

    fetchSettings();
  }, []);

  /* FORM HELPERS */
  const addMoreSetting = () => {
    setSettings([...settings, { key: '', value: '' }]);
  };

  const updateSetting = (index, field, value) => {
    const updated = [...settings];
    updated[index][field] = value;
    setSettings(updated);
  };

  const removeSetting = (index) => {
    setSettings(settings.filter((_, i) => i !== index));
  };

  /* SAVE + SYNC SETTINGS */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setLoading(true);
      const token = getAuthToken();

      // Final payload = jo UI me hai wahi DB me rahega
      const payload = [
        {
          key: 'allow_search_indexing',
          value: allowIndexing ? '1' : '0',
        },
        ...settings
          .filter((item) => item.key.trim())
          .map((item) => ({
            key: item.key.trim().toLowerCase(),
            value: item.value || '',
          })),
      ];

      await fetch(`${API_ADMIN_BASE_URL}/sync/site-setting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: payload,
        }),
      });

      setMessage('Site settings saved successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to save site settings');
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <section className={`container ${styles.rohsite_wrap}`}>
      <h2 className={styles.rohsite_title}>Site Settings</h2>

      <form onSubmit={handleSubmit} className={styles.rohsite_card}>

        {/* Search Engine Indexing */}
        <div className={styles.rohsite_block}>
          <h5 className={styles.rohsite_block_title}>Search Engine Indexing</h5>
          <p className={styles.rohsite_help}>
            Control whether search engines can crawl and index the website.
          </p>

          <div className={styles.rohsite_radio_group}>
            <label className={styles.rohsite_radio}>
              <input
                type="radio"
                name="indexing"
                checked={allowIndexing}
                onChange={() => setAllowIndexing(true)}
              />
              <span>Enable</span>
            </label>

            <label className={styles.rohsite_radio}>
              <input
                type="radio"
                name="indexing"
                checked={!allowIndexing}
                onChange={() => setAllowIndexing(false)}
              />
              <span>Disable</span>
            </label>
          </div>
        </div>

        <hr className={styles.rohsite_divider} />

        {/* Dynamic Settings */}
        <div className={styles.rohsite_block}>
          <h5 className={styles.rohsite_block_title}>Other Site Settings</h5>

          {settings.map((item, index) => (
            <div key={index} className={styles.rohsite_row}>
              <input
                type="text"
                className={styles.rohsite_input}
                placeholder="Setting key (e.g. google_map_api)"
                value={item.key}
                onChange={(e) =>
                  updateSetting(index, 'key', e.target.value)
                }
              />

              <textarea
                className={styles.rohsite_textarea}
                placeholder="Setting value"
                value={item.value}
                onChange={(e) =>
                  updateSetting(index, 'value', e.target.value)
                }
              />

              {settings.length > 1 && (
                <button
                  type="button"
                  className={styles.rohsite_remove_btn}
                  onClick={() => removeSetting(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.rohsite_add_btn}
            onClick={addMoreSetting}
          >
            + Add More
          </button>
        </div>

        {error && <div className={styles.rohsite_error}>{error}</div>}
        {message && <div className={styles.rohsite_success}>{message}</div>}

        <button
          type="submit"
          className={styles.rohsite_submit_btn}
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </section>
  );
}
