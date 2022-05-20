import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import  Link from '../components/Link'
import Image from 'next/image'

const LinkPage = ({profile}) => {


  const [links, setLinks] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getLinks()
    if (profile.avatar_url) downloadImage(profile.avatar_url)
}, [])

  async function getProfile() {
    try {
    const { username } = await router.query

      let { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
          console.log(data.id)
        setUserId(data.id)

        if (data.avatar_url) downloadImage(data.avatar_url)

      }
    } catch (error) {
      alert(error.message)
    } finally {
    }
  }

  async function getLinks() {
    try {

      let { data, error, status } = await supabase
        .from('links')
        .select(`*`)
        .eq('user_id', profile.id)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setLinks(data)
      }
    } catch (error) {
      alert(error.message)
    } finally {
    }
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }


  return (
      <>
      <div className='min-h-screen max-w-2xl mx-auto flex flex-col items-center py-10'>

      {avatar_url ? (
        <img
        className="rounded-full h-24 w-24 mb-4"
        src={avatar_url}
        alt="img"
      />
      ): <></>}
      
      <h1 className="font-bold text-lg mb-10 text-white">@{profile.username}</h1>

         {links.map((link,index) => (
          <Link key={index} title={link.title} url={link.url}/>
        ))}
        </div>
      </>
  )
}

export const getStaticPaths = async () => {
    const { data: lessons } = await supabase.from("profiles").select("username");
  
    const paths = lessons.map(({ username }) => ({
      params: {
        username: username.toString(),
      },
    }));
  
    return {
      paths,
      fallback: false,
    };
  };

export const getStaticProps = async ({ params: { username } }) => {
    let { data: profile, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
  
    return {
      props: {
        profile,
      },
    };
  };
  


export default LinkPage