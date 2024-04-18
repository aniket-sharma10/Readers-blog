import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, TextInput, Modal } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [pfp, setPfp] = useState(null);
  const [pfpUrl, setPfpUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setImageUploadError("Selected file must be an image.");
      return;
    }
    if (file.size >= 2 * 1024 * 1024) {
      setImageUploadError("File size must be less than 2mb.");
      return;
    }
    setPfp(file);
    setPfpUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (pfp) {
      uploadImage();
    }
  }, [pfp]);

  // Upload image to db
  const uploadImage = async () => {
    setImageUploading(true);
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + pfp.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, pfp);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progres = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progres.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "Failed to upload image. File must be less than 2mb"
        );
        setImageUploadProgress(null);
        setPfp(null);
        setPfpUrl(null);
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPfpUrl(downloadURL);
          setImageUploadProgress(null);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.msg));
        setUpdateUserError(data.msg);
      }
      if (res.ok) {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully!!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  // handle delete user
  const handleDeleteUser = async (e) => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.msg));
      }
      if (res.ok) {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // handle sign out
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.msg);
      }
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center fontseq text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full relative">
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 230, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={pfpUrl || currentUser.profilePicture}
            alt={currentUser.name}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-50"
            }`}
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {error && (
          <Alert color={"failure"} className="mt-4">
            {error}
          </Alert>
        )}
        {imageUploadError && (
          <Alert color={"failure"} className="mt-4">
            {imageUploadError}
          </Alert>
        )}
        {updateUserError && (
          <Alert color={"failure"} className="mt-4 text-base">
            {updateUserError}
          </Alert>
        )}
        {updateUserSuccess && (
          <Alert color={"success"} className="mt-4">
            {updateUserSuccess}
          </Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="pinkToOrange" disabled={loading || imageUploading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button type="button" gradientDuoTone="pinkToOrange" className="w-full">
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5 font-semibold">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>

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
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
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

export default DashProfile;
