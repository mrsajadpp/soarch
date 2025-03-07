import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Search Page",
  description: "A simple responsive search page",
};

export default function Page() {
  return (
    <div className={styles.container}>
      <img src="https://i.postimg.cc/PJsVf5X1/soarch.png" alt="Logo" className={styles.logo} />

      <form className={styles.searchBox} action="/search" method="get">
        <input type="text" placeholder="Search..." name="q" className={styles.searchInput} />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
    </div>
  );
}
