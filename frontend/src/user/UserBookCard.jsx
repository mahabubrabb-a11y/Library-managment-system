import React from "react";
import { Link } from "react-router-dom";
import { userDashboardPageStyles as s } from "../assets/dummyStyle";
import { useAuth } from "../Shared/AuthContext";
import { useLibrary } from "../Shared/LibraryContext";
import UserBookCard from "./UserBookCard"; // <--- UserBookCard ইম্পোর্ট করা হয়েছে
import {
  Sparkles,
  Contact,
  GraduationCap,
  BookCopy,
  AlertTriangle,
  ReceiptText,
} from "lucide-react";

const UserDashboardPage = () => {
  const { currentUser } = useAuth();
  const { currentUserHistory = [], currentUserSummary } = useLibrary();

  const activeCount = currentUserHistory.filter(
    (item) => item.liveStatus === "Borrowed",
  ).length;

  const overdueCount = currentUserHistory.filter(
    (item) => item.liveStatus === "Overdue",
  ).length;

  const pendingFine = currentUserSummary?.totalFine ?? 0;
  const clearedFine = currentUserSummary?.totalClearedFine ?? 0;

  const overviewStats = [
    {
      key: "issues",
      label: "Total Issues",
      value: `${currentUserHistory.length}`,
      note: "All library records attached to your student account",
      icon: BookCopy,
    },
    {
      key: "borrowed",
      label: "Active Books",
      value: `${activeCount}`,
      note: "Books currently mapped to your profile",
      icon: GraduationCap,
    },
    {
      key: "overdue",
      label: "Overdue Books",
      value: `${overdueCount}`,
      note: "Needs follow-up before more penalties are added",
      icon: AlertTriangle,
    },
    {
      key: "pending-fine",
      label: "Pending Fine",
      value: `Rs. ${pendingFine}`,
      note: "Fine amount still pending on active records",
      icon: ReceiptText,
    },
    {
      key: "cleared-fine",
      label: "Fine Cleared",
      value: `Rs. ${clearedFine}`,
      note: "Total fine amount already cleared on your account",
      icon: ReceiptText,
    },
  ];

  const recentBooks = currentUserHistory.slice(0, 3);

  return (
    <div className={s.pageContainer}>
      {/* Hero Section */}
      <section className={s.heroSection}>
        <div className={s.heroGrid}>
          {/* Left Column */}
          <div className={s.heroLeft}>
            <span className={s.heroBadge}>
              <Sparkles size={14} /> Student Dashboard
            </span>
            <h1 className={s.heroTitle}>
              {currentUser?.name || "Student"} profile, semester status, and your latest library books.
            </h1>
            <p className={s.heroText}>
              Your dashboard now keeps the important account summary at the top
              and shows the most recent issued books directly below for faster access.
            </p>
          </div>

          {/* Right Column (Profile + Semester) */}
          <div className={s.rightColumnGrid}>
            {/* Student Profile Card */}
            <article className={s.profileCard}>
              <div className={s.profileHeader}>
                <div>
                  <span className={s.profileLabel}>Student Profile</span>
                  <h3 className={s.profileName}>
                    {currentUser?.name || "N/A"}
                  </h3>
                </div>
                <div className={s.profileIconWrapper}>
                  <Contact size={20} />
                </div>
              </div>
              <div className={s.profileDetails}>
                <div className={s.profileDetailItem}>
                  Student ID: {currentUser?.studentId || "N/A"}
                </div>
                <div className={s.profileDetailItem}>
                  Roll Number: {currentUser?.rollNumber || "N/A"}
                </div>
                <div className={s.profileDetailItem}>
                  Department: {currentUser?.department || "N/A"}
                </div>
              </div>
            </article>

            {/* Semester Details Card */}
            <article className={s.semesterCard}>
              <div className={s.semesterHeader}>
                <div>
                  <span className={s.semesterLabel}>Semester Details</span>
                  <h3 className={s.semesterValue}>
                    {currentUser?.semester ? `Semester ${currentUser.semester}` : "N/A"}
                  </h3>
                </div>
                <div className={s.semesterIconWrapper}>
                  <GraduationCap size={20} />
                </div>
              </div>
              <div className={s.semesterDetails}>
                <div className={s.semesterDetailItem}>
                  Stream: {currentUser?.stream || "C.Sc"}
                </div>
                <div className={s.semesterDetailItem}>
                  Academic Year: {currentUser?.academicYear || "2nd Year"}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Overview Stats Cards Grid */}
      <section className={s.statsGrid}>
        {overviewStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <article key={stat.key} className={s.statCard}>
              <div className={s.statHeader}>
                <div className={s.statIconWrapper}>
                  <IconComponent size={20} />
                </div>
                <span className={s.statLiveBadge}>Live</span>
              </div>
              <p className={s.statLabel}>{stat.label}</p>
              <p className={s.statValue}>{stat.value}</p>
              <p className={s.statNote}>{stat.note}</p>
            </article>
          );
        })}
      </section>

      {/* Recent Books Section */}
      <section className={s.recentSection}>
        <div className={s.recentHeader}>
          <div>
            <h2 className={s.recentTitle}>Recent Books</h2>
            <p className={s.recentSubtitle}>
              The latest three records from your books page are shown here with the same card design so you can continue from the dashboard.
            </p>
          </div>
          <Link to="/user/books" className={s.viewMoreButton}>
            View More
          </Link>
        </div>

        {/* Recent Books Grid / List */}
        {recentBooks.length > 0 ? (
          <div className={s.recentGrid}>
            {recentBooks.map((item, index) => (
              <UserBookCard
                key={item._id || index}
                record={item}
                borrowerName={currentUser?.name}
              />
            ))}
          </div>
        ) : (
          <div className={s.emptyRecentState}>
            No recent book records found.
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboardPage;
