import { useState } from "react";
import useTop30 from "./hooks/useTop30";
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
  const top30Data = useTop30();
  const top100Data = useTop100();
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("top30");

  const data = activeTab === "top30" ? top30Data : top100Data;
  const chartHeight = activeTab === "top30" ? 800 : 2000;
  const domainMax = activeTab === "top30" ? 100 : 100;

  const stats = [
    { label: "Jobs Scraped", value: "June 2026", icon: "🔍" },
    {
      label: "Top Job Titles",
      value: activeTab === "top30" ? "30" : "100",
      icon: "📊",
    },
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
            <span className="text-blue-500">Job Analysis</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Built an n8n workflow that scrapes OnlineJobs.ph daily, removes
            duplicates, and saves to Google Sheets. Analyzes Start June 2026 job
            postings and generates in-demand job titles report.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab("top30")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "top30"
                ? "bg-blue-600 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            🏆 Top 30
          </button>
          <button
            onClick={() => setActiveTab("top100")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "top100"
                ? "bg-blue-600 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            📊 Top 100
          </button>
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

        {/* Chart */}
        <div
          className={`rounded-xl p-6 border mb-10 overflow-x-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <h3 className="text-xl font-bold mb-6">
            {activeTab === "top30" ? "Top 30" : "Top 100"} Most In-Demand VA Job
            Titles
          </h3>
          {data.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Loading data...
            </div>
          ) : (
            <div style={{ minWidth: "500px" }}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ left: 10, right: 20, top: 10, bottom: 10 }}
                  barSize={12}
                >
                  <XAxis
                    type="number"
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                    domain={[0, domainMax]}
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
                    {data.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Table */}
        <div
          className={`rounded-xl border overflow-x-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}
        >
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
              {data.map((row, index) => (
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
