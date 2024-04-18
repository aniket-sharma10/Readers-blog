import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import Oauth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill out all the fields");
    }
    if(formData.password.length < 6){
      return setError('Password length must be atleast 6 characters long!')
    }

    try {
      setError(null)
      setLoading(true)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.status === 400) {
        setError(data.msg);
      }
      setLoading(false)
      if(res.ok){
        navigate('/signin')
      }
    } catch (error) {
      setError(error.message)
      setLoading(false)
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
        <h2 className="text-center mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">Sign Up</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            {error && <Alert color="failure">{error}</Alert>}

            <Button gradientDuoTone="pinkToOrange" type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className="ml-2">Loading..</span>
                  </>
                ) : 'Sign Up'
              }
            </Button>
            <Oauth />
          </form>
          <div className="mt-2">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500 ml-2 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
