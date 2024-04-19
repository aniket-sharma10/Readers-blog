import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

function Footerr() {
  return (
    <Footer container className="border border-t-4 border-blue-600">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex md:flex md:grid-cols-1">
          <div>
            <Link className="text-lg sm:text-xl whitespace-nowrap font-semibold dark:text-white">
              <span className="p-1 bg-gradient-to-r from-pink-600 via-red-400 to-orange-400 text-white rounded-lg">
                Readers
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank" rel="noopener noreferrer">Blogs</Footer.Link>
                <Footer.Link href="https://tailwindcss.com/docs/installation" target="_blank" rel="noopener noreferrer">Tailwind CSS</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/aniket-sharma10" target="_blank" rel="noopener noreferrer">Github</Footer.Link>
                <Footer.Link href="https://twitter.com/aniket_sharmaa_" target="_blank" rel="noopener noreferrer">Twitter</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="/" target="_blank" rel="noopener noreferrer">Privacy Policy</Footer.Link>
                <Footer.Link href="/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Aniket" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" target="_blank" rel="noopener noreferrer" icon={BsFacebook} />
            <Footer.Icon href="#" target="_blank" rel="noopener noreferrer" icon={BsInstagram} />
            <Footer.Icon href="https://twitter.com/aniket_sharmaa_" target="_blank" rel="noopener noreferrer" icon={BsTwitter} />
            <Footer.Icon href="https://github.com/aniket-sharma10" target="_blank" rel="noopener noreferrer" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default Footerr;
