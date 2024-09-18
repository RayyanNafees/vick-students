import "./style.css";
import subs from "../../subs.json";
import { useEffect, useState } from "preact/hooks";
import PhoneIcon from "./phoneIcon";
import { kebabCase } from "change-case";

const baseURL = "https://vick-json.vercel.app";

// const baseURL = "https://localhost:3000";

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

  useEffect(() => {
    if (!dep) return;
    setLoading(true);
    setError(null);

    fetchStudents(dep)
      .then(setStudents)
      .catch((err) => {
        setError(err.message || "An error occurred while fetching data.");
      })
      .finally(() => setLoading(false));
  }, [dep]);

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
            class="capitalize"
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

      <table className="table-auto w-full">
        <thead>
          <tr class="text-xs whitespace-nowrap">
            <th>#</th>
            <th>Name</th>
            <th>Registration</th>
            <th>LGA</th>
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
                <td>{student.reg}</td>
                <td>{student.lga}</td>
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

export const Student = ({
  reg,
  code,
  name,
  lga,
  phone,
  img,
  olevel,
  utme,
  putme,
  score,
  search,
}: StudentData & { code: string; search: string }) => (
  <article className="flex items-start justify-between">
    <div className="flex justify-start">
      <div className="text-center">
        <img
          src={img}
          className="rounded-full border-2 size-24"
          width="20"
          alt={name}
          loading="lazy"
        />
        <h6>{code}</h6>
      </div>
      <div className="flex-col ml-8">
        <hgroup>
          <h4>
            {!search ? name : name.replace(search, `<mark>${search}</mark>`)}
          </h4>
          <h5>{reg}</h5>
        </hgroup>
        {phone && phone !== "None" && (
          <a
            href={`tel:${phone}`}
            className="text-neutral-400 my-8 no-underline"
          >
            <PhoneIcon /> {phone}
          </a>
        )}

        <p>score: {score} </p>
        <progress value={+score / 100} />
      </div>
    </div>
    <div className="flex flex-col">
      <mark className="rounded">{lga}</mark>
      <table>
        <tr>
          <td>utme</td>
          <td>{utme}</td>
        </tr>
        <tr>
          <td>putme</td>
          <td>{putme}</td>
        </tr>
        <tr>
          <td>olevel</td>
          <td>{olevel}</td>
        </tr>
      </table>
    </div>
  </article>
);
