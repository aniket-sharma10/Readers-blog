import { Button } from "flowbite-react";
import React from "react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border text-center border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl gap-2">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Want to know more about javascript? </h2>
        <p className="text-gray-500 py-2">Checkout these sites</p>
        <Button gradientDuoTone={"purpleToBlue"} className="rounded-tl-xl rounded-br-xl">
          <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Button>
      </div>
      <div className="flex-1">
        <img className="w-full h-full object-cover" src="https://ucarecdn.com/01292099-b782-4b74-a05e-f902be3feecd/" />
      </div>
    </div>
  );
}

export default CallToAction;
