import * as React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#2A2A2A] pt-16 pb-0 px-9 max-sm:pt-12 max-sm:pb-0 max-sm:px-4">
      <div className="flex justify-between mb-16 max-md:flex-col max-md:gap-12">
        <div className="max-w-[210px]">
          <div className="flex items-center gap-4 mb-6">
            <span aria-hidden="true">🖌️</span>
            <span className="text-white text-xl font-semibold">DesignPro</span>
          </div>
          <p className="text-[#666] text-base leading-6">
            Professional graphic design software for everyone.
          </p>
        </div>
        <nav className="flex gap-32 max-md:flex-col max-md:gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-semibold mb-2">Product</h3>
            <a
              href="#features"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#enterprise"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Enterprise
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-semibold mb-2">
              Resources
            </h3>
            <a
              href="#blog"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Blog
            </a>
            <a
              href="#tutorials"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Tutorials
            </a>
            <a
              href="#support"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Support
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-base font-semibold mb-2">Company</h3>
            <a
              href="#about"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#careers"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Careers
            </a>
            <a
              href="#contact"
              className="text-[#666] text-base hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>
      <div className="flex justify-between items-center px-0 py-8 border-t-[#333] border-t border-solid max-sm:flex-col max-sm:items-start max-sm:gap-4">
        <p className="text-[#666] text-base">
          © 2024 DesignPro. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <a
            href="/privacy"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-[#666] text-base hover:text-white transition-colors"
          >
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
};
