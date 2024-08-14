import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null)
  const [writer, setWriter] = useState("")

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${slug}`);
        const data = await res.json();

        if (res.ok) {
          setPost(data.posts[0]);
          // console.log(data)
          // console.log(data.posts)

          if(data.posts[0].userId){
            const userRes = await fetch(`/api/user/${data.posts[0].userId}`)
            const userData = await userRes.json()

            if(userRes.ok){
              setWriter(userData.username)
            }
          }

          setLoading(false);
          setError(null);
        } else {
          setLoading(false);
          setError(data.msg);
        }
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.log(error);
      }
    };
    getPost();
  }, [slug]);

  useEffect(() => {
    const fetchRecent = async() => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if(res.ok){
          setRecentPosts(data.posts)
        }
        else return;
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchRecent()
  }, [])


  if (loading) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <Spinner size={"xl"} />
        <h2>Loading post..</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <h2>{error}</h2>
      </div>
    );
  }
  return (
    <main className="min-h-screen p-3 flex flex-col max-w-6xl mx-auto">
      <h1 className="text-3xl lg:text-4xl mt-10 p-3 text-center font-serif mx-auto max-w-2xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-5 self-center"
      >
        <Button outline gradientDuoTone="greenToBlue">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="w-full max-w-5xl max-h-[600px] object-cover mt-10 p-3 mx-auto"
      />
      <div className="w-full max-w-2xl mx-auto p-3 flex justify-between border-b border-slate-500 text-xs">
        <div className="flex flex-col gap-2">
        <span>By: {post && writer}</span>
        <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>
        <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="w-full max-w-2xl mx-auto p-3 mt-2 text-lg content-class"
      ></div>
      <div className="w-full max-w-4xl mx-auto py-4">
        <CallToAction />
      </div>
      <CommentSection postId={post && post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl mt-8">Recent articles</h1>
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          {
            recentPosts && (
              recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )
          }
        </div>
      </div>
    </main>
  );
}

export default PostPage;
