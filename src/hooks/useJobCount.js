import { useState, useEffect } from "react";

const SHEET_ID = "12WhKu41BtqcPNpoIIE63cAspg_urwHXPNaeSU7FuoQI";

export default function useJobCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const monthStr = `Posted on ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const oljCount = fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Jobs`,
    )
      .then((res) => res.text())
      .then((csv) => (csv.match(new RegExp(monthStr, "g")) || []).length);

    // Use json format instead of csv for accurate count
    const vaCount = fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=VAWorkersPH&tq=select count(A) where A is not null`,
    )
      .then((res) => res.text())
      .then((text) => {
        const json = JSON.parse(text.replace(/.*?({.*}).*/s, "$1"));
        return json?.table?.rows?.[0]?.c?.[0]?.v || 0;
      })
      .catch(() => 409);

    Promise.all([oljCount, vaCount]).then(([olj, va]) => {
      setCount(olj + va);
    });
  }, []);

  return count;
}
