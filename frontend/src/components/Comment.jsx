import { Alert, Button, Spinner, Textarea } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = async () => {
    try {
      setIsEdit(true);
      setError(null)
      setEditContent(comment.content)
    } catch (error) {
      setError("Failed to edit the comment");
    }
  };

  const handleSave = async() => {
    try {
      if(editContent.trim().length <= 0){
        setError('Cannot add blank comment')
        return;
      } 
      const res = await fetch(`/api/comment/edit/${comment._id}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          content: editContent.trim()
        })
      })
      const data = await res.json()
      if(res.ok){
        setIsEdit(false)
        setError(null)
        onEdit(comment, editContent)
      }        
    } catch (error) {
      setError('Failed to edit the comment')
    }
  }

  return (
    <div className="flex p-4 border-b text-sm dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-10 h-10 bg-gray-200 rounded-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="text-xs font-semibold">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <BsDot color="gray" />
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEdit ? (
          <>
            <Textarea
            className="mb-2"
            type="text"
            maxLength={"200"}
            onChange={(e) => setEditContent(e.target.value)}
            value={editContent}
            required
          />
          <div className="flex justify-end gap-2 text-sm">
            {error && (<Alert color='failure'>{error}</Alert>)}
            <Button type="button" size={'sm'} gradientDuoTone='purpleToBlue' onClick={handleSave}>
              Save
            </Button>
            <Button type="button" size={'sm'} gradientDuoTone='purpleToBlue' outline onClick={()=>setIsEdit(false)}>
              Cancel
            </Button>
          </div>
          </>
        ) : (
          <>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-2">
              {comment.content}
            </p>
            <div className="flex items-center gap-1 pt-2 text-sm">
              <button
                className={`text=gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-600 dark:text-gray-300">
                {comment.numberOfLikes > 0 && comment.numberOfLikes}
              </p>
              {currentUser && currentUser._id === comment.userId && (
                <>
                  <button
                  type="button"
                  onClick={handleEdit}
                  className="hover:text-teal-500 ml-1 text-sm text-gray-600 dark:text-gray-300 dark:hover:text-teal-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(comment._id)}
                  className="hover:text-red-600 ml-1 text-sm text-red-500 dark:text-red-400 dark:hover:text-red-500"
                >
                  Delete
                </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
