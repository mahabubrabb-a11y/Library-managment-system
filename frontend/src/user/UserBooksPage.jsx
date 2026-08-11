import React, { useState, useMemo } from "react";
import { userBooksPageStyles as s } from "../assets/dummyStyle";
import { Search } from "lucide-react";
import { useAuth } from "../Shared/AuthContext";
import { useLibrary } from "../Shared/LibraryContext";
import UserBookCard from "./UserBookCard";

const UserBooksPage = () => {
  const { currentUser } = useAuth();
  const { currentUserHistory = [] } = useLibrary();

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const filteredIssuedBooks = useMemo(() => {
    return currentUserHistory.filter((record) => {
      const term = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        record.title?.toLowerCase().includes(term) ||
        record.author?.toLowerCase().includes(term) ||
        record.bookCode?.toLowerCase().includes(term) ||
        currentUser?.name?.toLowerCase().includes(term);

      const matchesStatus =
        filters.status === "All" || record.liveStatus === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [currentUser?.name, currentUserHistory, filters]);

  return (
    <div className={s.pageContainer}>
      {/* Hero Section */}
      <section className={s.heroSection}>
        <div className={s.heroFlex}>
          <div>
            <span className={s.heroBadge}>Student books page</span>
            <h1 className={s.heroTitle}>
              Book cards with richer content and cleaner grouped details.
            </h1>
            <p className={s.heroText}>
              Each card now uses a clearer top summary, status badge, context
              chips, and a better medium-card layout so the details feel more
              organized.
            </p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <main className={s.mainSection}>
        <div className={s.sectionHeader}>
          <div>
            <h2 className={s.sectionTitle}>Issued Books</h2>
            <p className={s.sectionSubtitle}>
              Manage and track all your borrowed library books
            </p>
          </div>
        </div>

        {/* Filters Container */}
        <div className={s.filtersContainer}>
          <label className={s.filterLabel}>
            <span className={s.filterLabelSpan}>Search Books</span>
            <div className={s.searchWrapper}>
              <Search className={s.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search by title, author, or code..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className={s.searchInput}
              />
            </div>
          </label>

          <label className={s.filterLabel}>
            <span className={s.filterLabelSpan}>Filter by Status</span>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className={s.selectInput}
            >
              <option value="All">All Status</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </label>
        </div>

        {/* Books Grid */}
        <div className={s.booksGrid}>
          {filteredIssuedBooks.length > 0 ? (
            filteredIssuedBooks.map((record, index) => (
              <UserBookCard
                key={record._id || index}
                record={record}
                borrowerName={currentUser?.name}
              />
            ))
          ) : (
            <div className={s.emptyState}>
              No books found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserBooksPage;