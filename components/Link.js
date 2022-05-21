import NextLink from "next/link";

export default function Link({ title, url }) {
  const link = url.includes("http") ? url : `https://${url}`;
  return (
    <NextLink href={link}>
      <button className="bg-emerald-400 text-white border-emerald-300 border-2 py-4 px-14 w-full  hover:bg-white hover:text-emerald-300 transition-all duration-100">
        {title}
      </button>
    </NextLink>
  );
}
