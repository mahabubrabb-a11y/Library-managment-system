import React from "react";
import {
  UserRound,
  Activity,
  ShieldEllipsis,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useLibrary } from "../Shared/LibraryContext";
import { Link } from "react-router-dom";

const icons = [UserRound, Activity, ShieldEllipsis, AlertTriangle];

const AdminDashboardPage = () => {
  const { adminStats, studentSummaries } = useLibrary();

  // ১. Overdue স্টুডেন্টদের ফিল্টার করে নেওয়া
  const overdueStudents = (studentSummaries || []).filter(
    (student) => student.status === "Overdue" || student.totalFine > 0
  );

  // ২. ফাইন অনুযায়ী সর্ট করে টপ রেকর্ড বের করা
  const attentionRecords = overdueStudents
    .map((student) => {
      // যদি student.records থাকে তবে সেখান থেকে topOverdueRecord বের করবে
      const topOverdueRecord = student.records?.find(
        (rec) => rec.status === "Overdue"
      ) || {};

      return {
        studentName: student.name || "N/A",
        studentId: student.studentId || "N/A",
        email: student.email || "N/A",
        department: student.department || "N/A",
        totalFine: student.totalFine || 0,
        borrowedCount: student.borrowedCount || 0,
        ...topOverdueRecord,
      };
    })
    .sort((a, b) => b.totalFine - a.totalFine)
    .slice(0, 4); // টপ ৪ জন

  // স্ট্যাট কার্ডের জন্য কনফিগারেশন
  const statsConfig = [
    {
      label: "Total Issued",
      value: adminStats?.totalIssued || 0,
      desc: "All manual book issue records",
      icon: UserRound,
    },
    {
      label: "Currently Borrowed",
      value: adminStats?.currentlyBorrowed || 0,
      desc: "Books currently out with students",
      icon: Activity,
    },
    {
      label: "Overdue Books",
      value: adminStats?.overdueBooks || 0,
      desc: "Status changes automatically after due date",
      icon: ShieldEllipsis,
    },
    {
      label: "Cleared Fine",
      value: `Rs. ${adminStats?.clearedFine || 0}`,
      desc: "Fine amount already cleared by students",
      icon: AlertTriangle,
    },
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <span style={badgeStyle}>COLLEGE ADMINISTRATION WORKSPACE</span>
        <h1 style={headingStyle}>
          Manage issued books, student records, returns, overdue status, and
          fines.
        </h1>
        <p style={heroParagraphStyle}>
          The admin area now focuses on visual trend graphs while keeping the
          existing admin workflow unchanged.
        </p>
      </section>

      {/* 4 Stats Cards */}
      <div style={statsGridStyle}>
        {statsConfig.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} style={statCardStyle}>
              <div style={iconBoxStyle}>
                <IconComponent size={20} color="#0e382c" />
              </div>
              <span style={statLabelStyle}>{stat.label}</span>
              <h2 style={statValueStyle}>{stat.value}</h2>
              <p style={statDescStyle}>{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Overdue Attention List Section */}
      <section style={attentionSectionStyle}>
        <div style={attentionHeaderStyle}>
          <div>
            <h2 style={attentionTitleStyle}>Overdue Attention List</h2>
            <p style={attentionSubtitleStyle}>
              Top 4 overdue students ranked by total imposed fine, with the highest fine shown first.
            </p>
          </div>
          <div style={alertIconCircleStyle}>
            <AlertTriangle size={20} color="#dc2626" />
          </div>
        </div>

        {/* Content Area */}
        {attentionRecords.length === 0 ? (
          <div style={emptyBoxStyle}>
            <p style={emptyTextStyle}>
              No overdue books need urgent attention right now.
            </p>
          </div>
        ) : (
          <div style={recordsGridStyle}>
            {attentionRecords.map((item, index) => (
              <div key={index} style={recordCardStyle}>
                <div style={recordHeaderStyle}>
                  <div>
                    <h4 style={studentNameStyle}>{item.studentName}</h4>
                    <span style={studentMetaStyle}>
                      ID: {item.studentId} | {item.department}
                    </span>
                  </div>
                  <div style={fineBadgeStyle}>
                    Fine: Rs. {item.totalFine}
                  </div>
                </div>

                {item.bookTitle && (
                  <div style={bookDetailsStyle}>
                    <p style={{ margin: "4px 0", fontSize: "13px", color: "#374151" }}>
                      <strong>Book:</strong> {item.bookTitle}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "12px", color: "#6b7280" }}>
                      <strong>Due Date:</strong> {item.dueDate || "N/A"}
                    </p>
                  </div>
                )}

                <div style={recordFooterStyle}>
                  <span style={{ fontSize: "12px", color: "#4b5563" }}>
                    Borrowed: {item.borrowedCount} books
                  </span>
                  <Link to="/admin/users" style={viewLinkStyle}>
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// --- In-line CSS Styles matching UI Theme ---

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const heroSectionStyle = {
  backgroundColor: "#0e382c",
  color: "#ffffff",
  padding: "36px 40px",
  borderRadius: "24px",
};

const badgeStyle = {
  fontSize: "11px",
  letterSpacing: "1px",
  color: "#a3e635",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "600",
  display: "inline-block",
  marginBottom: "16px",
};

const headingStyle = {
  fontSize: "32px",
  fontWeight: "400",
  fontFamily: "Georgia, serif",
  lineHeight: "1.3",
  margin: "0 0 16px 0",
};

const heroParagraphStyle = {
  fontSize: "14px",
  color: "#a7f3d0",
  margin: 0,
  opacity: 0.9,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

const statCardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const iconBoxStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  backgroundColor: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statLabelStyle = {
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: "500",
  marginTop: "4px",
};

const statValueStyle = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#111827",
  margin: 0,
};

const statDescStyle = {
  fontSize: "11px",
  color: "#9ca3af",
  margin: 0,
};

const attentionSectionStyle = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
};

const attentionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
};

const attentionTitleStyle = {
  fontSize: "20px",
  fontFamily: "Georgia, serif",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 4px 0",
};

const attentionSubtitleStyle = {
  fontSize: "12px",
  color: "#6b7280",
  margin: 0,
};

const alertIconCircleStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#fef2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyBoxStyle = {
  backgroundColor: "#f9fafb",
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
  border: "1px dashed #e5e7eb",
};

const emptyTextStyle = {
  color: "#6b7280",
  fontSize: "14px",
  margin: 0,
};

const recordsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const recordCardStyle = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #f3f4f6",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const recordHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const studentNameStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#111827",
  margin: 0,
};

const studentMetaStyle = {
  fontSize: "11px",
  color: "#6b7280",
};

const fineBadgeStyle = {
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: "11px",
  fontWeight: "700",
  padding: "4px 8px",
  borderRadius: "6px",
};

const bookDetailsStyle = {
  margin: "12px 0",
  padding: "8px 12px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
};

const recordFooterStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
};

const viewLinkStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#0e382c",
  textDecoration: "none",
};

export default AdminDashboardPage;
