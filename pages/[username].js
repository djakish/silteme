import { supabase } from "../utils/supabaseClient";
import Link from "../components/Link";
import Image from "next/image";
import Head from "next/head";

import { useRouter } from 'next/router'
import { useEffect, useState } from "react";

const LinkPage = () => {
  const router = useRouter()
  const { username } = router.query

  const [profile, setProfile] = useState({})
  const [avatar_url, setAvatar] = useState('')
  const [links, setLinks] = useState([])

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await getData(username);
      setAvatar(data.props.avatar_url)
      setProfile(data.props.profile)
      setLinks(data.props.links)
    }
    
    fetchData()
      .catch(console.error);

  }, [username])

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
      <div className="min-h-screen max-w-2xl mx-auto flex flex-col items-center py-10">
        {avatar_url ? (
          <div className="rounded-full h-24 w-24 mb-4 relative">
            <Image
              src={avatar_url}
              alt="Picture of the author"
              layout="fill" // required
              objectFit="cover" // change to suit your needs
              className="rounded-full" // just an example
            />
          </div>
        ) : (
          <></>
        )}

        <h1 className="font-bold text-lg mb-10 text-white">
          @{username}
        </h1>

        {links.map((link, index) => (
          <Link key={index} title={link.title} url={link.url} />
        ))}
      </div>
    </>
  );
};

async function getData(username) {
  let {
    data: profile,
    error,
    status,
  } = await supabase
    .from("profiles")
    .select("*")
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
      .select(`*`)
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
      profile,
      avatar_url,
      links,
    },
  };
}

async function downloadImage(path) {
  return (
    "https://elhwmvlgafwmydwmaumb.supabase.co/storage/v1/object/public/avatars/" +
    path
  );
}

export default LinkPage;
