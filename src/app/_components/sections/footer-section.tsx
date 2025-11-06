"use client";

import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="bg-linear-to-r from-slate-800 via-slate-900 to-slate-800 px-4 py-16 text-slate-300 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          {/* Left Section */}
          <div>
            <div className="mb-4 flex items-center">
              <Image
                src="/logo.png"
                alt="MindEase Logo"
                width={60}
                height={40}
              />
              <span className="text-2xl font-bold text-white">MindEase</span>
            </div>
            <p className="max-w-sm leading-relaxed text-slate-400">
              Supporting your mental health journey with compassionate AI and
              human expertise.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Emergency
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between border-t border-slate-700 pt-8 text-sm text-slate-400 md:flex-row">
          <p>&copy; 2025 MindEase. All rights reserved.</p>
          <p>Crafted with compassion for your wellbeing.</p>
        </div>
      </div>
    </footer>
  );
}
