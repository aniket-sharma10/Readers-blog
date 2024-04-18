import React from "react";

function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-center my-7">About Readers</h1>
          <div className="text-gray-500 flex flex-col gap-6">
            <p>
              Welcome coders and software enthusiasts! Readers is your hub for
              all things code. We dive deep into programming languages, explore
              cutting-edge frameworks, and share practical tips and tricks to
              elevate your coding game. Whether you're a seasoned developer or
              just starting your coding journey, Readers is your one-stop shop
              to learn, discuss, and be inspired by the amazing world of
              software engineering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
