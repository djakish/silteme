import NextLink from "next/link";
import * as React from 'react'

export default function Footer({ title, url }) {
  return (

    <footer className="h-10 flex flex-row text-white gap-2 fixed bottom-5">
      Made Using Next.js and Supabase by 
      <NextLink href="https://github.com/djakish">
         me 💚
      </NextLink>
    </footer>

  );
}
