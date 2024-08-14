import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/themeSlice";
import { signoutSuccess } from "../../store/userSlice";

function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("search");
    setSearch(searchTerm);
  }, [location.search]);

  useEffect(() => {
    if(location.pathname === '/'){
      setSearch('')
    }
  }, [location.pathname])

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("search", search);
      const searchTerm = urlParams.toString();
      navigate(`/search?${searchTerm}`);
    }
  };

  return (
    <Navbar fluid className="border-2">
      <Link className="text-base sm:text-xl whitespace-nowrap font-semibold dark:text-white">
        <span className="p-1 bg-gradient-to-r from-pink-600 via-red-400 to-orange-400 text-white rounded-lg">
          Readers
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search.."
          rightIcon={AiOutlineSearch}
          className="w-24 sm:w-full lg:inline-block"
          value={search}
          required
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 inline-block border-2"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "dark" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block ">@{currentUser.username}</span>
              <span className="block font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link to={"/create-post"}>
              <Dropdown.Item>Create Post</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signIn"}>
            <Button outline gradientDuoTone="pinkToOrange">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as="div">
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
