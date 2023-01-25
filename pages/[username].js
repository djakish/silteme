import { supabase } from "../utils/supabaseClient";
import Link from "../components/Link";
import Footer from "../components/Footer";
import Image from "next/image";
import Head from "next/head";
import React, { useState } from "react";


const LinkPage = ({ username, website, avatar_url, links }) => {
  const [copied, setCopied] = useState(false);

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(window.location.href)
      .then(() => {
        // If successful, update the isCopied state value
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>{username}</title>
        <meta
          name="description"
          content="{username} personal links."
          key="desc"
        />
      </Head>
      <div className="flex flex-col h-screen justify-start max-w-2xl mx-auto items-center py-10 ">
        <div className="rounded-full h-24 w-24 mb-4 relative select-none">
          <Image
            src={avatar_url}
            alt="Picture of the author"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            priority
          />
        </div>

        <h1
          className="font-bold text-xl mb-5 text-white flex"
          onClick={handleCopyClick}
        >
          {!copied ? "@" + username : "Copied!"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </h1>

        <h2 className="text-md mb-5 text-white">{website}</h2>

        <div className="flex-grow w-full flex flex-col items-center">
          {links.map((link, index) => (
            <Link key={index} title={link.title} url={link.url} />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  let username = context.params.username;
  let { data: profile } = await supabase
    .from("profiles")
    .select("id,website,avatar_url")
    .eq("username", username)
    .single();

  let avatar_url = null;

  if (profile?.avatar_url != null) {
    avatar_url = await downloadImage(profile.avatar_url);
  }

  let links = [];
  try {
    let { data, error, status } = await supabase
      .from("links")
      .select(`title,url`)
      .eq("user_id", profile.id);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      links = data;
    }
  } catch (error) {
    console.log(error.message);
  } finally {
  }

  return {
    props: {
      website: profile.website,
      username,
      avatar_url,
      links,
    },
  };
}

async function downloadImage(path) {
  return (
    "https://nnxkhppnqvfelyhkkkgq.supabase.co/storage/v1/object/public/avatars/" +
    path
  );
}

export default LinkPage;
