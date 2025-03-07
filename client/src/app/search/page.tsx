"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

interface SearchResult {
  item: {
    title: string;
    description: string;
    url: string;
    origin: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get search query from URL
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch search results when query changes
  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:3004/api/soarch/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
            console.log(data.result);
            
          setResults(data.result);
        } else {
          setError("No results found");
        }
      })
      .catch(() => setError("Failed to fetch results"))
      .finally(() => setLoading(false));
  }, [query]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className={styles.logo} />

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      {/* Loading & Error Messages */}
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Search Results */}
      {query && !loading && results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.resultText}>Showing results for: <strong>{query}</strong></p>
          <ul>
            {results.map((item, index) => (
              <li key={index} className={styles.resultItem}>
                <a href={item.item.url} target="_blank" rel="noopener noreferrer">
                  <h3>{item.item.title}</h3>
                  <p>{item.item.description}</p>
                  <span className={styles.origin}>{item.item.origin}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
