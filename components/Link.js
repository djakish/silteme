import NextLink from "next/link";

export default function Link({ title, url }) {
  const link = url.includes("http") ? url : `https://${url}`;
  return (
    <NextLink href={link}>
      <button className="bg-emerald-400 
      text-white 
      font-bold
    border-emerald-300 
      border-2
      py-4 
      m-4
      hover:bg-white 
      hover:text-emerald-300
      w-72
      sm:w-full
      rounded-full">
        {title}
      </button>
    </NextLink>
  );
}
