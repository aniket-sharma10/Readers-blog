import { Alert, Button, Modal, Spinner, TextInput, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  let [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const [commentDeleteId, setCommentDeleteId] = useState(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments/${postId}`);
        const data = await res.json();

        if (res.ok) {
          setAllComments(data);
        }
      } catch (error) {
        setCommentError(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    comment = comment.trim();
    if (comment.length > 200) {
      return;
    }

    try {
      setLoading(true);
      let res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id,
        }),
      });

      let data = await res.json();
      if (res.ok) {
        setComment("");
        setAllComments([data, ...allComments]);
        setLoading(false);
        setCommentError(null);
      } else {
        setLoading(false);
        setCommentError(data.msg);
      }
    } catch (error) {
      setLoading(false);
      setCommentError(error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const res = await fetch(`/api/comment/like/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setAllComments(
          allComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editContent) => {
    setAllComments(
      allComments.map((prevComment) =>
        prevComment._id === comment._id
          ? { ...prevComment, content: editContent }
          : prevComment
      )
    );
  };

  const handleDelete = async(commentId) => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if(res.ok){
        setAllComments(
          allComments.filter((prevComment) => prevComment._id !== commentId)
        )
      }
    } catch (error) {
        console.log(error.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-700 dark:text-gray-300">
          <p>Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            className="h-6 w-6 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-sm text-teal-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-1 my-5 text-gray-700 dark:text-gray-300">
          Please sign in to comment.
          <Link to={"/signin"} className="text-teal-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border-teal-300 border rounded-md p-4"
        >
          <Textarea
            type="text"
            placeholder="Add a comment.."
            rows={"3"}
            maxLength={"200"}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            required
          />
          <div className="flex justify-between mt-4 px-3">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </div>
          {commentError && (
            <Alert className="mt-3" color={"failure"}>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {allComments.length === 0 ? (
        <h1 className="text-lg mt-5 text-center">No Comments yet!!!</h1>
      ) : (
        <>
          <div className="w-full max-w-2xl my-5 rounded-md flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-500 p-1 px-2 rounded-sm">
              {allComments.length}
            </div>
          </div>
          {allComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true)
                setCommentDeleteId(commentId)
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentDeleteId)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CommentSection;
