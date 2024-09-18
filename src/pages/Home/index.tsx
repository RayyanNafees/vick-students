import "./style.css";
import subs from "../../subs.json";
import { useEffect, useState } from "preact/hooks";
import PhoneIcon from "./phoneIcon";

const baseURL = import.meta.env.DEV ? "http://localhost:3000" : "https://my-json-server.typicode.com/9node/vickj-stundet";

const fetchStudents = (dep: string): Promise<StudentData[]> =>
	fetch(`${baseURL}/${dep}`)
		.then((res) => res.json())
		.then((r: Record<string, StudentData>) =>
			Object.entries(r).map(([k, v]) => ({ ...v, code: k })),
		);

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
};

export function Home() {
	const [dep, setDep] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [students, setStudents] = useState<StudentData[]>([]);
	const [search, setSearch] = useState<string>();
	useEffect(() => {
		setLoading(true);
		fetchStudents(dep)
			.then(setStudents)
			.finally(() => setLoading(false));
	}, [dep]);
	return (
		<>
			<hgroup>
				<h1>Student Database</h1>
				<h2>Lagos University</h2>
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
			{loading && (
				<progress />
			)}
			{students
				.filter((s) =>
					!search ? true : s.name.toLowerCase().includes(search.toLowerCase()),
				)
				.map((student) => (
					<a
						class="no-underline hover:shadow-lg transition-shadow"
						key={student.reg}
						href={`${dep}/${student.code}`}
					>
						<Student {...{...student, search}} />
					</a>
				))}
		</>
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
			<img
				src={img}
				class="rounded-full border-2 size-24"
				aspect-ratio="1"
				width="20"
				alt={name}
				loading="lazy"
				preload="lazy"
			/>
			<div class="flex-col ml-8">
				<hgroup>
					<h4>{!search ? name: name.replace(search, `<mark>${search}</mark>`)}</h4>
					<h5>{reg}</h5>
				</hgroup>
				{phone && phone !== "None" && (
					<a href={`tel:${phone}`} class="text-neutral-400 my-8">
						<PhoneIcon /> {phone}
					</a>
				)}

				<div class="flex flex-row justify-evenly items-center space-x-8 text-neutral-200">
					{putme && (
						<div class="flex-col">
							<span>{putme}</span>
							<h6>putme</h6>
						</div>
					)}
					{+olevel && (
						<div class="flex-col">
							<span>{olevel}</span>
							<h6>olevel</h6>
						</div>
					)}
					{+utme && (
						<div class="flex-col">
							<span>{utme}</span>
							<h6>utme</h6>
						</div>
					)}
				</div>
				<p>score: {score} </p>
				<progress value={+score / 100} />
			</div>
		</div>
		<mark class="rounded">{lga}</mark>
	</article>
);
