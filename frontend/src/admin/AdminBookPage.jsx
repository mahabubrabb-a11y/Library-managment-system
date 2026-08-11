import React, { useState, useEffect, useRef } from "react";
import { FilePlus2, Trash2, Search } from "lucide-react";
import { useLibrary } from "../Shared/LibraryContext"; // আপনার কনটেক্সট পাথ অনুযায়ী অ্যাডজাস্ট করুন
import { adminBooksPageStyles as s } from "../assets/dummyStyle";

const getTodayIso = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createBookDraft = () => ({
  id: `draft-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  title: "",
  bookCode: "",
  issuedOn: getTodayIso(),
  dueDate: "",
});

const createInitialForm = () => ({
  studentName: "",
  userEmail: "",
  department: "",
  stream: "",
  academicYear: "",
  semester: "",
  rollNumber: "",
  books: [createBookDraft()],
});

const AdminBooksPage = () => {
  const { issueManualBooksToStudent, fineSettings } = useLibrary();
  const [issueForm, setIssueForm] = useState(createInitialForm);
  const [formMessage, setFormMessage] = useState("");
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchError, setSearchError] = useState("");
  const searchTimeoutRef = useRef(null);

  const isStudentSelected = Boolean(selectedStudent);
  const canSearchRoll =
    issueForm.rollNumber.trim().length > 0 && !isStudentSelected;

  useEffect(() => {
    if (!canSearchRoll) return;

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    setIsSearching(true);
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        setSearchError("");
     // AdminBooksPage.jsx - Line 54
const response = await fetch(
  `http://localhost:5004/api/student/search-by-roll?roll=${encodeURIComponent(
    issueForm.rollNumber.trim()
  )}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("library-auth-token")}`,
      "Content-Type": "application/json",
    },
  }
);
        const data = await response.json();
        if (response.ok && data.success) {
          setMatchingStudents(data.students || []);
        } else {
          setMatchingStudents([]);
          setSearchError(
            data.message || "Unable to search students by roll number."
          );
        }
      } catch (error) {
        console.error("Student roll search error:", error);
        setMatchingStudents([]);
        setSearchError("Unable to fetch matching students.");
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [issueForm.rollNumber, canSearchRoll]);

  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookChange = (id, field, value) => {
    setIssueForm((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const addBookDraft = () => {
    setIssueForm((prev) => ({
      ...prev,
      books: [...prev.books, createBookDraft()],
    }));
  };

  const removeBookDraft = (id) => {
    setIssueForm((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
    }));
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
    setMatchingStudents([]);
    setSearchError("");
    setIssueForm((current) => ({
      ...current,
      studentName: "",
      userEmail: "",
      department: "",
      stream: "",
      academicYear: "",
      semester: "",
      rollNumber: "",
    }));
  };

  const selectStudent = (student) => {
    setFormMessage("");
    setSearchError("");
    setMatchingStudents([]);
    setSelectedStudent(student);
    setIssueForm((current) => ({
      ...current,
      studentName: student.name,
      userEmail: student.email,
      department: student.department || "",
      stream: student.stream || "",
      academicYear: student.academicYear || "",
      semester: student.semester || "",
      rollNumber: student.rollNumber || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");

    if (typeof issueManualBooksToStudent === "function") {
      const res = await issueManualBooksToStudent(issueForm);
      if (res?.message) {
        setFormMessage(res.message);
      }
    }
  };

  return (
    <div className={s.pageContainer}>
      <section className={s.mainSection}>
        <div className={s.innerContainer}>
          <div className={s.headerFlex}>
            <div>
              <h2 className={s.title}>Issue Book To Student</h2>
              <p className={s.subtitle}>
                Select a student, add manual book entries with book code, and
                the active overdue fine rule will be used automatically after the
                due date.
              </p>
            </div>
            <div className={s.fineRuleBadge}>
              Fine rule: Rs. {fineSettings?.amount || 10} per day
            </div>
          </div>

          <form onSubmit={handleSubmit} className={s.form}>
            {/* Student Info Inputs */}
            <div className={s.formGrid}>
              <label className={s.label}>
                <span className={s.labelSpan}>Student Name</span>
                <div className={s.searchInputWrapper}>
                  <Search size={16} className={s.searchIcon} />
                  <input
                    type="text"
                    name="studentName"
                    value={issueForm.studentName}
                    readOnly={isStudentSelected}
                    onChange={handleIssueChange}
                    placeholder="Selected student name"
                    className={
                      isStudentSelected ? s.readonlyInput : s.textInput
                    }
                  />
                </div>
              </label>

              <label className={s.label}>
                <span className={s.labelSpan}>Department</span>
                <input
                  type="text"
                  name="department"
                  value={issueForm.department}
                  readOnly={isStudentSelected}
                  onChange={handleIssueChange}
                  placeholder="Department"
                  className={s.textInput}
                />
              </label>

              <label className={s.label}>
                <span className={s.labelSpan}>Stream</span>
                <input
                  type="text"
                  name="stream"
                  value={issueForm.stream}
                  readOnly={isStudentSelected}
                  onChange={handleIssueChange}
                  placeholder="Stream"
                  className={s.textInput}
                />
              </label>

              <label className={s.label}>
                <span className={s.labelSpan}>Year</span>
                <input
                  type="text"
                  name="academicYear"
                  value={issueForm.academicYear}
                  readOnly={isStudentSelected}
                  onChange={handleIssueChange}
                  placeholder="Year"
                  className={s.textInput}
                />
              </label>

              <label className={s.label}>
                <span className={s.labelSpan}>Semester</span>
                <input
                  type="text"
                  name="semester"
                  value={issueForm.semester}
                  readOnly={isStudentSelected}
                  onChange={handleIssueChange}
                  placeholder="Semester"
                  className={s.textInput}
                />
              </label>

              <label className={s.label}>
                <span className={s.labelSpan}>Roll Number</span>
                <input
                  type="text"
                  name="rollNumber"
                  value={issueForm.rollNumber}
                  readOnly={isStudentSelected}
                  onChange={handleIssueChange}
                  placeholder="Search by roll number"
                  className={s.textInput}
                />
              </label>
            </div>

            {/* Matching Students Section */}
            <div className={s.matchingContainer}>
              <p className={s.matchingTitle}>Matching Students</p>
              <div className={s.studentList}>
                {isSearching ? (
                  <span className={s.searchingMessage}>
                    Searching for students...
                  </span>
                ) : matchingStudents.length ? (
                  matchingStudents.map((student) => (
                    <button
                      key={student.email}
                      type="button"
                      onClick={() => selectStudent(student)}
                      className={`${s.studentButtonBase} ${
                        selectedStudent?.email === student.email
                          ? s.studentButtonSelected
                          : s.studentButtonUnselected
                      }`}
                    >
                      <span>{student.name}</span>
                      <span className={s.studentRollSpan}>
                        - {student.rollNumber}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className={s.noMatchText}>
                    {issueForm.rollNumber.trim()
                      ? "No matching students found."
                      : "Type a roll number to search registered students."}
                  </p>
                )}
              </div>
              {searchError && <p className={s.errorText}>{searchError}</p>}

              {selectedStudent && (
                <div className={s.selectedStudentContainer}>
                  <span className={s.selectedStudentBadge}>
                    Selected: {selectedStudent.name} - {selectedStudent.rollNumber}
                  </span>
                  <button
                    type="button"
                    onClick={clearSelectedStudent}
                    className={s.clearButton}
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>

            {/* Books Section */}
            <div className={s.booksSection}>
              <div className={s.booksHeader}>
                <h3 className={s.booksTitle}>Manual Book Entries</h3>
                <button
                  type="button"
                  onClick={addBookDraft}
                  className={s.addBookButton}
                >
                  <FilePlus2 size={16} />
                  Add Book
                </button>
              </div>

              <div className={s.booksGrid}>
                {issueForm.books.map((book, index) => (
                  <article key={book.id} className={s.bookCard}>
                    <div className={s.bookCardHeader}>
                      <div className={s.bookIndexWrapper}>
                        <p className={s.bookIndexLabel}>Manual Book {index + 1}</p>
                        <p className={s.bookIndexHelper}>
                          Add book name and code. Issue date is set automatically to today.
                        </p>
                      </div>
                      {issueForm.books.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBookDraft(book.id)}
                          className={s.deleteButton}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className={s.bookFieldsGrid}>
                      <label className={s.bookFieldLabel}>
                        <span className={s.labelSpan}>Book Name</span>
                        <input
                          type="text"
                          value={book.title}
                          onChange={(e) =>
                            handleBookChange(book.id, "title", e.target.value)
                          }
                          placeholder="Write book name"
                          className={s.bookFieldInput}
                        />
                      </label>

                      <label className={s.bookFieldLabel}>
                        <span className={s.labelSpan}>Book Code</span>
                        <input
                          type="text"
                          value={book.bookCode}
                          onChange={(e) =>
                            handleBookChange(book.id, "bookCode", e.target.value)
                          }
                          placeholder="Write book code"
                          className={s.bookFieldInput}
                        />
                      </label>

                      <div className={s.dateGrid}>
                        <label className={s.bookFieldLabel}>
                          <span className={s.labelSpan}>Issue Date</span>
                          <input
                            type="date"
                            value={book.issuedOn}
                            readOnly
                            disabled
                            className={s.dateInputDisabled}
                          />
                        </label>

                        <label className={s.bookFieldLabel}>
                          <span className={s.labelSpan}>Due Date</span>
                          <input
                            type="date"
                            value={book.dueDate}
                            onChange={(e) =>
                              handleBookChange(book.id, "dueDate", e.target.value)
                            }
                            min={getTodayIso()}
                            className={s.dateInput}
                          />
                        </label>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Form Message & Submit Button */}
            {formMessage && <div className={s.formMessage}>{formMessage}</div>}

            <div>
              <button type="submit" className={s.submitButton}>
                Issue Manual Books
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminBooksPage;
