import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'

function UpdatePost() {
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [formdata, setFormdata] = useState({});
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()
  const {postId} = useParams()
  const {currentUser} = useSelector((state) => state.user)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (res.ok) {
          setPublishError(null)
          setFormdata(data.posts[0])
        }
        if(!res.ok){
          setPublishError(data.msg)
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts()
  }, [postId])

  const handleFileChange = (e) => {
    setFileUploadError(null);
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setFileUploadError("Selected file must be an image.");
    }
    if (file.size >= 2 * 1024 * 1024) {
      setFileUploadError("Image size must be less than 2mb.");
    }
    setFile(file);
  };

  const handleUploadImage = async () => {
    try {
      setFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError("Failed to upload image.");
          setFile(null);
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
            setFileUploadProgress(null);
            setFileUploadError(null);
            setFormdata({ ...formdata, image: downloadURl });
          });
        }
      );
    } catch (error) {
      setFileUploadError("Image upload failed");
      setFileUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.msg)
        return
      }
      if(res.ok){
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      }
    } catch (error) {
      setPublishError(error.message)
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className="flex-1"
            value={formdata.title}
            onChange={(e) =>
              setFormdata({ ...formdata, title: e.target.value })
            }
          />
          <Select
            value={formdata.category}
            onChange={(e) =>
              setFormdata({ ...formdata, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="nodejs">Node.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-2 border-green-500 border-dashed p-3">
          <FileInput
            typeof="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            onClick={handleUploadImage}
            disabled={fileUploadProgress}
          >
            {fileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {fileUploadError && <Alert color={"failure"}>{fileUploadError}</Alert>}
        {formdata.image && (
          <img
            src={formdata.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formdata.content}
          required
          placeholder="Write your blog here.."
          className="h-72 mb-12"
          onChange={(value) => {
            setFormdata({ ...formdata, content: value });
          }}
        />
        {
          publishError && (
            <Alert color={'failure'}>{publishError}</Alert>
          )
        }
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
      </form>
    </div>
  );
}

export default UpdatePost;
