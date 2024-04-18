import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { signInStart, signInSuccess, signInFailure } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.msg));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link className=" text-3xl font-bold ">
            <span className="p-1 bg-gradient-to-r from-pink-600 via-red-400 to-orange-400 text-white rounded-lg">
              Readers
            </span>
          </Link>
          <p className="text-base mt-6">
            This is a blog project where you can write your own blogs and read
            other blogs.
          </p>
        </div>

        <div className="flex-1">
          <h2 className="text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
            Sign In
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="example@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            {error && <Alert color="failure">{error}</Alert>}

            <Button
              gradientDuoTone="pinkToOrange"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Loading..</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="mt-2">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500 ml-2 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;