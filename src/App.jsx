import { useState } from "react";
import useTop100 from "./hooks/useTop100";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#1d4ed8",
  "#1e40af",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

export default function App() {
  const data = useTop100();
  const [darkMode, setDarkMode] = useState(true);

  const monthYear = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "Jobs Scraped", value: monthYear, icon: "🔍" },
    { label: "Top Job Titles", value: "100", icon: "📊" },
    { label: "Auto-Updated", value: "Daily", icon: "🔄" },
    { label: "Duplicates Removed", value: "✓", icon: "🧹" },
  ];

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Navbar */}
      <nav
        className={`shadow-md px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h1 className="text-xl font-bold text-blue-500">OLJ Job Analyzer</h1>
        <div className="flex items-center gap-4">
          <a
            href="https://kit-job-dashboard.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-blue-500 hover:text-blue-400 transition"
          >
            VA Job Hub ↗
          </a>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-gray-700"}`}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <div className="text-center mb-10 mt-6">
          <h2 className="text-4xl font-bold mb-3">
            OLJ Job Scraper &{" "}
            <span className="text-blue-500">Top 100 Analysis</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Built an n8n workflow that scrapes OnlineJobs.ph daily, removes
            duplicates, and saves to Google Sheets. Analyzes June 2026 job
            postings and generates Top 100 in-demand job titles report.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-4 border text-center ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-500">
                {stat.value}
              </div>
              <div
                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Chart - Top 30 only */}
        <div
          className={`rounded-xl p-6 border mb-10 overflow-x-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <h3 className="text-xl font-bold mb-6">
            Top 30 Most In-Demand VA Job Titles
          </h3>
          {data.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Loading data...
            </div>
          ) : (
            <div style={{ minWidth: "500px" }}>
              <ResponsiveContainer width="100%" height={800}>
                <BarChart
                  data={data.slice(0, 30)}
                  layout="vertical"
                  margin={{ left: 10, right: 20, top: 10, bottom: 10 }}
                  barSize={18}
                >
                  <XAxis
                    type="number"
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={160}
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                    tick={{
                      fontSize: 11,
                      fill: darkMode ? "#d1d5db" : "#374151",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#fff",
                      border: "1px solid #374151",
                      color: darkMode ? "#fff" : "#000",
                    }}
                    formatter={(value) => [`${value} postings`, "Count"]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.slice(0, 30).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Table - Full Top 100 */}
        <div
          className={`rounded-xl border overflow-x-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-bold">Full Top 100 Rankings</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-500">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-500">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-500">
                  Postings
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.rank}
                  className={`border-t ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-100 hover:bg-gray-50"}`}
                >
                  <td className="px-6 py-3 text-sm font-bold text-blue-500">
                    #{row.rank}
                  </td>
                  <td
                    className={`px-6 py-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {row.title}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${(row.count / data[0]?.count) * 120}px`,
                        }}
                      />
                      <span
                        className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {row.count}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className={`text-center mt-10 pb-6 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          © 2026 Jesse Kit Ocampo · Built with n8n + Google Sheets + React
        </div>
      </div>
    </div>
  );
}
