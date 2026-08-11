import React, { useState, useEffect } from "react";
import { userEditProfilePageStyles as s } from "../assets/dummyStyle";
import { useAuth } from "../Shared/AuthContext";
import { Pencil, Check, AlertCircle } from "lucide-react";

const studentSemesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const studentYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const UserEditProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    stream: "",
    semester: "",
    academicYear: "",
    rollNumber: "",
  });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setForm({
      name: currentUser.name ?? "",
      email: currentUser.email ?? "",
      phone: currentUser.phone ?? "",
      department: currentUser.department ?? "",
      stream: currentUser.stream ?? "",
      semester: currentUser.semester ?? "",
      academicYear: currentUser.academicYear ?? "",
      rollNumber: currentUser.rollNumber ?? "",
    });
    setIsEditing(false);
    setError("");
  }, [currentUser]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, [name]: digitsOnly }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (updateProfile) {
        await updateProfile(form);
      }
      setToast("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.pageContainer}>
      {/* Toast Notification */}
      {toast && (
        <div className={s.toastWrapper}>
          <div className={s.toastContent}>
            <Check size={18} className="text-emerald-600" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Main Section */}
      <main className={s.mainSection}>
        <div className={s.headerFlex}>
          <div>
            <h1 className={s.title}>Edit Profile</h1>
            <p className={s.subtitle}>
              Update your student details and save the latest profile information.
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={s.editButton}
            >
              <Pencil size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Form Container */}
        <form className={s.formContainer} onSubmit={handleSubmit}>
          <label className={s.label}>
            <span className={s.labelSpan}>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.input}
              placeholder="Enter full name"
            />
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Email</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={true}
              className={s.inputDisabled}
            />
            <span className={s.helperText}>
              Email address cannot be changed.
            </span>
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Mobile Number</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.input}
              placeholder="10 digit number"
            />
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Department</span>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.input}
              placeholder="e.g. Computer Science"
            />
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Stream</span>
            <input
              name="stream"
              value={form.stream}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.input}
              placeholder="e.g. B.Tech / B.Sc"
            />
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Semester</span>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.select}
            >
              <option value="">Select Semester</option>
              {studentSemesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Year</span>
            <select
              name="academicYear"
              value={form.academicYear}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.select}
            >
              <option value="">Select Year</option>
              {studentYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className={s.label}>
            <span className={s.labelSpan}>Roll Number</span>
            <input
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={s.input}
              placeholder="Enter roll number"
            />
          </label>

          {error && (
            <div className={s.errorMessage}>
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {isEditing && (
            <div className={s.buttonGroup}>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setIsEditing(false);
                  setForm({
                    name: currentUser?.name ?? "",
                    email: currentUser?.email ?? "",
                    phone: currentUser?.phone ?? "",
                    department: currentUser?.department ?? "",
                    stream: currentUser?.stream ?? "",
                    semester: currentUser?.semester ?? "",
                    academicYear: currentUser?.academicYear ?? "",
                    rollNumber: currentUser?.rollNumber ?? "",
                  });
                }}
                disabled={loading}
                className={s.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={s.saveButton}
              >
                {loading ? "Saving Profile..." : "Save Profile"}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default UserEditProfilePage;
