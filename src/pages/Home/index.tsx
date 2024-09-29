import "./style.css";
import subs from "../../ui-subs.json";
import { useEffect, useState } from "preact/hooks";
import { kebabCase } from "change-case";

const baseURL = "https://vick-json.vercel.app";

type StudentData = {
  reg: string;
  img: string;
  lga: string;
  name: string;
  olevel: string;
  score: number | string;
  utme: string;
  data: string;
  agg: number;
};

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

export function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [stateCounts, setStateCounts] = useState<{ [key: string]: number }>({});

  const scoreThreshold = 25; // Set your score threshold

  useEffect(() => {
    if (!department) return;

    setLoading(true);
    setError(null);

    fetchStudents(department)
      .then((studentData) => {
        console.log("Fetched Data:", studentData); // Check fetched data

        const filteredStudents = studentData.filter(
          (student) =>
            Number(student.score) >= scoreThreshold &&
            Number(student.olevel) !== 0 &&
            Number(student.agg) !== 0
        );

        console.log("Filtered Students:", filteredStudents); // Check filtered data
        setStudents(filteredStudents);
        generateStateTableData(filteredStudents);
      })
      .catch((err) => {
        setError(err.message || "An error occurred while fetching data.");
      })
      .finally(() => setLoading(false));
  }, [department]);

  const generateStateTableData = (students: StudentData[]) => {
    const counts: { [key: string]: number } = {};

    students.forEach((student) => {
      const state = student.lga;
      counts[state] = (counts[state] || 0) + 1;
    });

    setStateCounts(counts);
  };

  const totalStudents = students.length;

  return (
    <div>
      <hgroup className="my-5">
        <h1>Aspirant List</h1>
        <h2>Obafemi Awolowo University</h2>
      </hgroup>
      {/* Department selection dropdown */}
      <select
        onChange={(e) => setDepartment(e.currentTarget.value.toLowerCase())}
      >
        <option disabled={!department} selected={!department}>
          Choose Department
        </option>
        {subs.map((sub: string) => (
          <option
            key={sub}
            value={sub.toLowerCase()}
            selected={department === sub.toLowerCase()}
          >
            {sub}
          </option>
        ))}
      </select>
      {/* Search input */}
      <input
        type="search"
        placeholder="Search Student"
        onInput={(e) => setSearchQuery(e.currentTarget.value)}
      />
      {loading && <progress />}
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {/* No results found message */}
      {!loading && !error && students.length === 0 && (
        <div className="text-gray-500 font-semibold">No results found.</div>
      )}
      {/* State data */}
      <div className="hidden mt-4 flex flex-row items-center justify-between">
        <h3 className="font-bold">Total Number of Students: {totalStudents}</h3>
        <h3>
          Student Count Per State for {department} that scores above{" "}
          {scoreThreshold}
        </h3>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="text-xs">
            <th>State (LGA)</th>
            <th>Number of Students</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stateCounts).map(([state, count]) => (
            <tr key={state}>
              <td>{state}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Student list table */}
      <table className="table-auto w-full mt-5">
        <thead>
          <tr className="text-xs whitespace-nowrap">
            <th>#</th>
            <th>Name</th>
            <th className="hidden">Registration</th>
            <th className="">State</th>
            <th>UTME</th>
            <th>PUTME</th>
            <th>O-Level</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((student) =>
              !searchQuery
                ? true
                : student.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((student, index) => (
              <tr key={student.reg}>
                <td>{index + 1}</td> {/* Row number */}
                <td>{student.name}</td>
                <td className="hidden">{student.reg}</td>
                <td>{student.lga}</td>
                <td>{student.utme}</td>
                <td>{student.agg}</td>
                <td>{student.olevel}</td>
                <td>{student.score}</td>
              </tr>
            ))}

         
        </tbody>
      </table>
    </div>
  );
}
