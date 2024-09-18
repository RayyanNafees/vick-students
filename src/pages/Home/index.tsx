import "./style.css";
import subs from "../../subs.json";
import { useEffect, useState } from "preact/hooks";
import PhoneIcon from "./phoneIcon";
import { kebabCase } from "change-case";

// const baseURL = import.meta.env.DEV
//   ? "http://localhost:3000"
//   : "https://vick-json.vercel.app";

const baseURL = "https://vick-json.vercel.app";

const fetchStudents = (dep: string, limit = 10): Promise<StudentData[]> =>
  fetch(`${baseURL}/${dep}?_limit=${limit}`).then((res) => res.json());

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

  useEffect(() => {
    if (!dep) return;
    setLoading(true);

    fetchStudents(dep, limit)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [dep, limit]);
  return (
    <div
      onScroll={(e) => {
        console.log("width", e.currentTarget.scrollWidth);
        console.log("height", e.currentTarget.scrollHeight);
      }}
    >
      <hgroup class="my-4">
        <h1>OAU ASpirant 2024</h1>
        <h2></h2>
      </hgroup>
      <select
        onChange={(e) => {
          setDep(e.currentTarget.value.toLowerCase());
        }}
      >
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
            class="no-underline hover:shadow-lg transition-shadow"
            key={student.reg}
            href={`${dep}/${student.code}`}
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
  ...props
}: StudentData & { code: string; search: string }) => (
  <article class="flex items-start justify-between">
    <div class="flex justify-start">
      <div class="text-center">
        <img
          src={img}
          class="rounded-full border-2 size-24"
          aspect-ratio="1"
          width="20"
          alt={name}
          loading="lazy"
          preload="lazy"
        />
        <h6>{code}</h6>
      </div>
      <div class="flex-col ml-8">
        <hgroup>
          <h4>
            {!search ? name : name.replace(search, `<mark>${search}</mark>`)}
          </h4>
          <h5>{reg}</h5>
        </hgroup>
        {phone && phone !== "None" && (
          <a href={`tel:${phone}`} class="text-neutral-400 my-8 no-underline">
            <PhoneIcon /> {phone}
          </a>
        )}

        <p>score: {score} </p>
        <progress value={+score / 100} />
      </div>
    </div>
    <div class="flex flex-col ">
      <mark class="rounded">{lga}</mark>
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
