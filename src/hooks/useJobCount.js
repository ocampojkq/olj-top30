import { useState, useEffect } from "react";

const SHEET_ID = "12WhKu41BtqcPNpoIIE63cAspg_urwHXPNaeSU7FuoQI";

export default function useJobCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const monthStr = `Posted on ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const oljCount = fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Jobs`,
    )
      .then((res) => res.text())
      .then((csv) => (csv.match(new RegExp(monthStr, "g")) || []).length);

    const vaCount = fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=VAWorkersPH`,
    )
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.trim().split("\n").slice(1);
        return rows.filter((r) => {
          const cols = r.split(",");
          // created_at is index 9
          const dateStr = cols[9]?.replace(/"/g, "").trim();
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        }).length;
      });

    Promise.all([oljCount, vaCount]).then(([olj, va]) => {
      setCount(olj + va);
    });
  }, []);

  return count;
}
