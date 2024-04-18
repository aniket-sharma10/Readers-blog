import React, { useEffect, useState } from "react";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from '../components/PostCard'

function Search() {
  const [sidebar, setSidebar] = useState({
    search: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("search");
    const sortTerm = urlParams.get("sort");
    const categoryTerm = urlParams.get("category");
    if (searchTerm || sortTerm || categoryTerm) {
      setSidebar({
        ...sidebar,
        search: searchTerm,
        sort: sortTerm,
        category: categoryTerm,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else setShowMore(false);
      }
      else{
        setLoading(false)
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if(e.target.id === 'search'){
        setSidebar({...sidebar, search: e.target.value})
    }
    if(e.target.id === 'sort'){
        const order = e.target.value || 'desc'
        setSidebar({...sidebar, sort: order})
    }
    if(e.target.id === 'category'){
        const category = e.target.value || 'uncategorized'
        setSidebar({...sidebar, category: category})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('search', sidebar.search)
    urlParams.set('sort', sidebar.sort)
    urlParams.set('category', sidebar.category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const handleShowMore = async () => {
    const numberOfPosts = posts.length
    const start = numberOfPosts
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('start', start)
    const searchQuery = urlParams.toString()
    const res = await fetch(`/api/post/getposts?${searchQuery}`)
    const data = await res.json()
    if (res.ok) {
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else setShowMore(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search.."
              value={sidebar.search}
              id="search"
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select id="sort" onChange={handleChange} value={sidebar.sort}>
                <option value='desc'>Latest</option>
                <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category</label>
            <Select id="category" onChange={handleChange} value={sidebar.category}>
                <option value='uncategorized'>Uncategorized</option>
                <option value='reactjs'>ReactJs</option>
                <option value='javascript'>JavaScript</option>
                <option value='nextjs'>NextJs</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone='purpleToBlue'>Submit</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Search results:</h1>
        <div className="p-7 flex justify-center flex-wrap gap-4">
          {
            loading && (
              <Spinner className="mt-10" size='xl' />
            )
          }
          {
            !loading && posts.length===0 && (
              <p className="text-2xl text-gray-500 text-center mt-10">No posts found!</p>
            )
          }
          {
            posts && posts.length>0 && posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }
          {
            showMore && (
              <button onClick={handleShowMore} className="text-teal-500 text-lg hover:underline p-7 w-full">Show More</button>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Search;
