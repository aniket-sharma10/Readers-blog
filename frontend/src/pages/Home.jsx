import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      
      <div className="flex flex-col gap-6 px-3 p-20 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to Readers</h1>
        <p className="text-gray-500 text-sm">
          Here you will find all types of tech related articles.
        </p>
        {currentUser ? (
          <Link
            to="/search"
            className="text-xs sm:text-sm text-teal-500 font-semibold hover:underline"
          >
            View all posts
          </Link>
        ) : (
          <Link
            to="/signin"
            className="text-xs sm:text-sm text-teal-500 font-semibold hover:underline"
          >
            Please sign in to create post
          </Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard post={post} key={post._id} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

      <div className="p-3 bg-amber-50 dark:bg-slate-700">
        <CallToAction />
      </div>
    </div>
  );
}

export default Home;
