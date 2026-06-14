import { useState, useEffect } from "react";

const SHEET_ID = "12WhKu41BtqcPNpoIIE63cAspg_urwHXPNaeSU7FuoQI";
const TAB_NAME = "Top100 June 2026";

export default function useTop100() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
    fetch(url)
      .then((res) => res.text())
      .then((csv) => {
        console.log("RAW CSV TOP100:", csv.substring(0, 500));
        // rest of code

        const rows = csv.trim().split("\n").slice(1);
        const parsed = rows
          .map((row) => {
            const cols = [];
            let current = "";
            let inQuotes = false;
            for (let i = 0; i < row.length; i++) {
              const char = row[i];
              if (char === '"' && row[i + 1] === '"') {
                current += '"';
                i++;
              } else if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === "," && !inQuotes) {
                cols.push(current.trim());
                current = "";
              } else {
                current += char;
              }
            }
            cols.push(current.trim());

            return {
              rank: cols[0] || "",
              title: cols[1] || "",
              count: parseInt(cols[2]) || 0,
            };
          })
          .filter(
            (r) =>
              r.title !== "" &&
              r.rank !== "" &&
              !isNaN(parseInt(r.rank)) &&
              r.title.length < 60 &&
              r.count > 0,
          );
        setData(parsed);
      });
  }, []);

  return data;
}
