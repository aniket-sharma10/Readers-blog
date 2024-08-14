import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/header/Header";
import Footerr from "./components/footer/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from './components/ScrollToTop'
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/about"} element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={"/create-post"} element={<CreatePost />} />
          <Route path={"/update-post/:postId"} element={<UpdatePost />} />
        </Route>
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/search"} element={<Search />} />
        <Route path={"/post/:slug"} element={<PostPage />} />
      </Routes>
      <Footerr />
    </BrowserRouter>
  );
}

export default App;
