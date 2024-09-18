import "./style.css";
import subs from "../../subs.json";
import { useEffect, useState } from "preact/hooks";
import PhoneIcon from "./phoneIcon";
import { kebabCase } from "change-case";

const baseURL = "https://vick-json.vercel.app";

const fetchStudents = (
  dep: string,
  limit: number,
  currentPage: number
): Promise<{ students: StudentData[]; total: number }> =>
  fetch(
    `${baseURL}/${kebabCase(dep)}?_limit=${limit}&_page=${currentPage}`
  ).then(async (res) => {
    const total = parseInt(res.headers.get("X-Total-Count") || "0", 10);
    const students = await res.json();
    return { students, total };
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
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    let buttons = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      buttons.push(
        <button
          key={1}
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-100"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (start > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            currentPage === i
              ? "bg-[#ED8850] text-white"
              : "text-gray-500 bg-white hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-100"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  useEffect(() => {
    if (!dep) return;
    setLoading(true);

    fetchStudents(dep, limit, currentPage)
      .then(({ students, total }) => {
        setStudents(students);
        setTotalPages(Math.ceil(total / limit));
      })
      .finally(() => setLoading(false));
  }, [dep, limit, currentPage]);

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-x-1 gap-y-2 py-4">
        <button
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="flex flex-wrap justify-center items-center space-x-1">
          {renderPaginationButtons()}
        </div>
        <button
          className="px-3 py-1 text-sm font-medium text-gray-500 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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

      {students
        .filter((s) =>
          !search ? true : s.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((student) => (
          <div
            className="no-underline hover:shadow-lg transition-shadow"
            key={student.reg}
          >
            <Student {...{ ...student, search }} />
          </div>
        ))}
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
          className="rounded-full border-2 size-18 size-24"
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
