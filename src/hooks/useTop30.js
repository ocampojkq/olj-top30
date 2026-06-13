import { useState, useEffect } from "react";

const SHEET_ID = "1XWR3YCl7Pms2AjoSbwI-tvECZP9a-wEK-GwyhHmJeug";
const TAB_NAME = "Top 30 Summary";

export default function useTop30() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
    fetch(url)
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.trim().split("\n").slice(1);
        const parsed = rows
          .map((row) => {
            const cols = row
              .split(",")
              .map((c) => c.replace(/^"|"$/g, "").trim());
            return {
              rank: cols[0] || "",
              title: cols[1] || "",
              count: parseInt(cols[2]) || 0,
            };
          })
          .filter((r) => r.title !== "");
        setData(parsed);
      });
  }, []);

  return data;
}
