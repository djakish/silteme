import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Avatar from "./Avatar";

function AuthedLink({loading, link, deleteHandler, isDeleteLoading, updateHandler }) {
  const [title,setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  return (
    <div className="flex justify-between mt-5 p-2 ">
      <input className="bg-transparent text-white border border-gray-300 text-lg rounded-lg block w-full p-2.5" 
        onChange={e => setTitle(e.target.value)} 
        value={title} />
      <input className="bg-transparent text-white  border border-gray-300 text-lg rounded-lg block w-full p-2.5" 
        onChange={e => setUrl(e.target.value)} 
        value={url} />
      <button
        className="text-white rounded-lg bg-green-600 p-2"
        onClick={(event) => {
          event.stopPropagation();
          updateHandler({linkId:link.id,title,url});
        }}
        disabled={loading}
      >
      {loading ? "Loading" : "Update"}
      </button>
      <button
        className="text-white rounded-lg bg-red-600 p-2"
        onClick={(event) => {
          event.stopPropagation();
          deleteHandler(link.id);
        }}
        disabled={isDeleteLoading}
      >
        Delete
      </button>
    </div>
  );
}

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  // For links
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState("null");
  const [url, setUrl] = useState(null);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    getProfile();
    getLinks();
  }, [session]);

  async function getLinks() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("links")
        .select(`*`)
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setLinks(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function newLink() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const { data, error, status } = await supabase
        .from("links")
        .insert([{ user_id: user.id, title: title, url: url }]);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setLinks([...links, data[0]]);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const updateHandler = async ({linkId, title, url}) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: linkId,
        user_id: user.id,
        title,
        url,
      };
      
      const { error } = await supabase
        .from('links')
        .update({ url, title })
        .match({ id: linkId, user_id: user.id})

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }  
  };

  const deleteHandler = async (linkId) => {
    setIsDeleteLoading(true);
    const { error } = await supabase.from("links").delete().eq("id", linkId);
    if (!error) {
      setLinks(links.filter((link) => link.id !== linkId));
    }
    setIsDeleteLoading(false);
  };

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setloading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setloading(false);
    }
  }

  const inputStyle =
    "block bg-transparent text-white	disabled:text-gray-500  border border-gray-300 text-lg rounded-lg block w-full p-2.5";
  const labelStyle = "pt-4 block mb-2 text-gray-500 font-semibold";
  const buttonStyle =
    "w-full mt-4 text-white bg-emerald-400 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center";
  return (
    <div className="pt-10">
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <div>
        <label className={labelStyle} htmlFor="email">
          Email
        </label>
        <input
          className={inputStyle}
          id="email"
          type="text"
          value={session.user.email}
          disabled
        />
      </div>
      <div>
        <label className={labelStyle} htmlFor="username">
          Name
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className={inputStyle}
        />
      </div>
      <div>
        <label className={labelStyle} htmlFor="website">
          Website
        </label>
        <input
          id="website"
          type="website"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div>
        <button
          className={buttonStyle}
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button className={buttonStyle} onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>

      <div>
        <label className={labelStyle} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div>
        <label className={labelStyle} htmlFor="url">
          Url
        </label>
        <input
          id="url"
          type="url"
          value={url || ""}
          onChange={(e) => setUrl(e.target.value)}
          className={inputStyle}
        />
      </div>

      <div>
        <button className={buttonStyle} onClick={() => newLink()}>
          Add Link
        </button>
      </div>
      <label className="text-xl font-bold text-white  mt-20">My Links</label>
      
      {links.map((link, index) => (
        <AuthedLink loading={loading} link={link} key={index} deleteHandler={deleteHandler} updateHandler={updateHandler}/>
      ))}
    </div>
  );
}
