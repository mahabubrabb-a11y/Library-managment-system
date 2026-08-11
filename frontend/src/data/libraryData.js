// src/data/libraryData.js

// ১. লাইব্রেরির বইয়ের ক্যাটালগ
export const initialBooks = [
  {
    id: "B101",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "978-0132350884",
    totalCopies: 5,
    availableCopies: 3,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300",
  },
  {
    id: "B102",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Programming",
    isbn: "978-0596517748",
    totalCopies: 4,
    availableCopies: 1,
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300",
  },
  {
    id: "B103",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "978-0262033848",
    totalCopies: 6,
    availableCopies: 4,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300",
  },
];

// ২. বই ইস্যু বা ধারের রেকর্ড (Issue Records)
export const initialBorrowedRecords = [
  {
    id: "REC-001",
    bookId: "B101",
    bookTitle: "Clean Code",
    studentName: "Mahabub Rabbi",
    studentEmail: "mahabubrabbi@gmail.com",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    status: "Issued", // Issued, Returned, Overdue
  },
  {
    id: "REC-002",
    bookId: "B102",
    bookTitle: "JavaScript: The Good Parts",
    studentName: "BORO BORO",
    studentEmail: "mmhduh7549@gmail.com",
    issueDate: "2026-07-20",
    dueDate: "2026-08-03",
    status: "Overdue",
  },
];

// ৩. অ্যাডমিন ও স্টুডেন্ট ড্যাশবোর্ড কার্ডের কাউন্টার বা তথ্য
export const dashboardStats = {
  admin: {
    totalBooks: 1250,
    issuedBooks: 340,
    registeredStudents: 850,
    overdueReturns: 12,
  },
  student: {
    currentlyBorrowed: 2,
    totalReadHistory: 15,
    pendingFines: 0,
  },
};

// ৪. ক্যাটাগরি ফিল্টার ড্রপডাউনের অপশনসমূহ
export const categories = [
  "All Categories",
  "Programming",
  "Computer Science",
  "Software Engineering",
  "Database Systems",
  "Networking",
];