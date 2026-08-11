import React, { useState, useEffect } from "react";
import { adminFinesPageStyles as s } from "../assets/dummyStyle";
import { useLibrary } from "../Shared/LibraryContext";

const fineIntervals = [
  { value: "day", label: "Per Day" },
  { value: "week", label: "Per Week" },
  { value: "month", label: "Per Month" },
  { value: "year", label: "Per Year" },
];

const AdminFinesPage = () => {
  const { fineSettings, saveFineSettings } = useLibrary();
  const [form, setForm] = useState(fineSettings || { amount: "", interval: "day" });
  const [toast, setToast] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (fineSettings) {
      setForm(fineSettings);
    }
  }, [fineSettings]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saveFineSettings) {
      saveFineSettings(form);
      setToast("Fine settings saved successfully!");
      setIsEditing(false);
    }
  };

  return (
    <div className={s.pageContainer}>
      {/* Toast Notification */}
      {toast && (
        <div className={s.toastWrapper}>
          <div className={s.toastContent}>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Main Section */}
      <section className={s.mainSection}>
        <div className={s.headerFlex}>
          <div>
            <h1 className={s.title}>Fine Settings</h1>
            <p className={s.subtitle}>
              Save the overdue fine rule here. After saving, use the edit icon
              to update it again.
            </p>
          </div>

          {!isEditing && fineSettings && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={s.editButton}
              title="Edit Fine Settings"
            >
              ✏️
            </button>
          )}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className={s.formContainer}>
          <label className={s.label}>
            <span className={s.labelSpan}>Fine Amount</span>
            <input
              type="number"
              name="amount"
              value={form?.amount || ""}
              onChange={handleChange}
              disabled={!isEditing && fineSettings}
              placeholder="Enter amount"
              className={s.input}
              required
            />
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Interval</span>
            <select
              name="interval"
              value={form?.interval || "day"}
              onChange={handleChange}
              disabled={!isEditing && fineSettings}
              className={s.select}
            >
              {fineIntervals.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {!isEditing && fineSettings ? (
            <div className={s.readOnlyDisplay}>
              Active Rule: {fineSettings.amount} Tk / {fineSettings.interval}
            </div>
          ) : (
            <button type="submit" className={s.submitButton}>
              Save Settings
            </button>
          )}
        </form>
      </section>
    </div>
  );
};

export default AdminFinesPage;
