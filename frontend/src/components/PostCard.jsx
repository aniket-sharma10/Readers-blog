import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <div className="group relative w-full sm:w-[360px] border border-teal-400 hover:border-2 transition-all h-[380px] overflow-hidden rounded-lg">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[260px] object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col p-3 gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="text-base">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 m-2 rounded-md"
        >
          Read Blog
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
