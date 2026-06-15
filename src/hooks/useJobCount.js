import { useState, useEffect } from "react";

const SHEET_ID = "12WhKu41BtqcPNpoIIE63cAspg_urwHXPNaeSU7FuoQI";

export default function useJobCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const monthStr = `Posted on ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Jobs`,
    )
      .then((res) => res.text())
      .then((csv) => {
        const oljCount = (csv.match(new RegExp(monthStr, "g")) || []).length;
        setCount(oljCount + 409);
      });
  }, []);

  return count;
}
