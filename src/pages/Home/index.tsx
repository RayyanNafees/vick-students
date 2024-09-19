import "./style.css";
import subs from "../../subs.json";

import { useEffect, useState } from "preact/hooks";
import { Bar } from "react-chartjs-2"; // Import Bar chart component from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { kebabCase } from "change-case";
import PhoneIcon from "./phoneIcon";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const baseURL = "https://vick-json.vercel.app";

// Fetch all student data without pagination
const fetchStudents = (dep: string): Promise<StudentData[]> =>
  fetch(`${baseURL}/${kebabCase(dep)}?_sort=score&_order=desc`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }
      return res.json();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

type StudentData = {
  img: string;
  lga: string;
  name: string;
  olevel: string;
  phone: string;
  putme: string;
  reg: string;
  score: string;
  utme: string;
  code: string;
  id: string;
};

export function Home() {
  const [dep, setDep] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [search, setSearch] = useState<string>();
  const [error, setError] = useState<string | null>(null); // Error state
  const [scoreDistribution, setScoreDistribution] = useState<any>(null); // State for chart data

  useEffect(() => {
    if (!dep) return;
    setLoading(true);
    setError(null);

    fetchStudents(dep)
      .then((studentData) => {
        setStudents(studentData);
        generateChartData(studentData); // Generate chart data once students are fetched
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching data.");
      })
      .finally(() => setLoading(false));
  }, [dep]);

  // Function to generate chart data based on student scores
  const generateChartData = (students: StudentData[]) => {
    const scoreCounts: { [key: string]: number } = {};

    // Count occurrences of each score
    students.forEach((student) => {
      const score = Math.floor(Number(student.score)); // Round scores to nearest integer
      scoreCounts[score] = (scoreCounts[score] || 0) + 1;
    });

    const labels = Object.keys(scoreCounts); // Get the unique score values
    const data = Object.values(scoreCounts); // Get the count for each score

    // Set the data to be used in the chart
    setScoreDistribution({
      labels,
      datasets: [
        {
          label: "Number of Students",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div>
      <hgroup className="my-5">
        <h1>Aspirant List</h1>
        <h2>Obafemi Awolowo University</h2>
      </hgroup>

      <select onChange={(e) => setDep(e.currentTarget.value.toLowerCase())}>
        <option disabled={!dep} selected={!dep}>
          Choose Department
        </option>
        {subs.map((sub: string) => (
          <option
            key={sub}
            value={sub.toLowerCase()}
            selected={dep === sub.toLowerCase()}
          >
            {sub}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="Search Student"
        onInput={(e) => setSearch(e.currentTarget.value)}
      />

      {loading && <progress />}

      {error && <div className="text-red-500 font-semibold">{error}</div>}

      {!loading && !error && students.length === 0 && (
        <div className="text-gray-500 font-semibold">No results found.</div>
      )}

      {/* Display the chart if data is available */}
      {scoreDistribution && (
        <div className="chart-container">
          <Bar
            data={scoreDistribution}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}

      <table className="table-auto w-full">
        <thead>
          <tr class="text-xs whitespace-nowrap">
            <th>#</th>
            <th>Name</th>
            <th class="hidden">Registration</th>
            <th class="hidden">LGA</th>
            <th>UTME</th>
            <th>PUTME</th>
            <th>O-Level</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((s) =>
              !search
                ? true
                : s.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((student, index) => (
              <tr key={student.reg}>
                <td>{index + 1}</td> {/* Row number */}
                <td>{student.name}</td>
                <td class="hidden">{student.reg}</td>
                <td class="hidden">{student.lga}</td>
                <td>{student.utme}</td>
                <td>{student.putme}</td>
                <td>{student.olevel}</td>
                <td>{student.score}</td>
                <td class="hidden">
                  {student.phone && student.phone !== "None" ? (
                    <a
                      href={`tel:${student.phone}`}
                      className="text-neutral-400 my-8 no-underline"
                    >
                      <PhoneIcon /> {student.phone}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
