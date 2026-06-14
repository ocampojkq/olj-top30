import { useState, useEffect } from "react";

const SHEET_ID = "12WhKu41BtqcPNpoIIE63cAspg_urwHXPNaeSU7FuoQI";
const TAB_NAME = "Jobs";

export default function useJobCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
    fetch(url)
      .then((res) => res.text())
      .then((csv) => {
        const now = new Date();
        const monthStr = `Posted on ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const count = (csv.match(new RegExp(monthStr, "g")) || []).length;
        setCount(count);
      });
  }, []);

  return count;
}
