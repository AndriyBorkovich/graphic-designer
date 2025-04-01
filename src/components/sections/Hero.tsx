import * as React from "react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="text-center bg-[#1A1A1A] px-9 py-[130px] max-sm:px-4 max-sm:py-16">
      <div className="max-w-[917px] mx-auto my-0">
        <h1 className="text-white text-[56px] font-bold leading-[61.6px] mb-10 max-md:text-[44px] max-md:leading-[48px] max-sm:text-4xl max-sm:leading-10">
          Create stunning designs with powerful tools
        </h1>
        <p className="text-[#666] text-xl leading-8 max-w-[507px] mx-auto mb-10 max-md:text-lg max-md:leading-7 max-sm:text-base max-sm:leading-6">
          Professional graphic design software that makes creation simple.
          Powerful features, intuitive interface, endless possibilities.
        </p>
        <div className="flex gap-4 justify-center max-sm:flex-col max-sm:gap-4">
          <button
            className="text-white text-base font-medium bg-[#4318D1] px-8 py-[17px] rounded-lg hover:bg-[#3614B8] transition-colors"
            onClick={() => navigate("/sign-in")}
          >
            Start designing now
          </button>
          <button
            className="border text-white text-base font-medium px-8 py-[17px] rounded-lg border-solid border-[#333] hover:bg-[#333] transition-colors"
            onClick={() => console.log("Watch demo")}
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};
