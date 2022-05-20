import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import  Link from '../components/Link'
import Image from 'next/image'

const LinkPage = ({profile,avatar_url,links}) => {


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


  function downloadImage(path) {
    return "https://elhwmvlgafwmydwmaumb.supabase.co/storage/v1/object/public/avatars/" + path
  }
  
export const getStaticProps = async ({ params: { username } }) => {
    let { data: profile, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()


    let avatar_url = null;

    if(profile.avatar_url != null){
      avatar_url = downloadImage(profile.avatar_url)
    }
    


      let links = [];
        try {

          let { data, error, status } = await supabase
            .from('links')
            .select(`*`)
            .eq('user_id', profile.id)
    
          if (error && status !== 406) {
            throw error
          }
    
          if (data) {
            links = data
          }
        } catch (error) {
          alert(error.message)
        } finally {
        }
  
    return {
      props: {
        profile,
        avatar_url,
        links
      },
    };
  };
  


export default LinkPage