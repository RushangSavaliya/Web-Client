// File: src/components/Footer.jsx

import { FaGithub, FaLinkedin } from "react-icons/fa";

// Footer component for the application
export default function Footer() {
  return (
    <footer className="mt-8 mb-4 text-center">
      {/* Container for footer content */}
      <div className="flex items-center justify-center gap-3 text-sm text-base-content/60">
        {/* Footer text */}
        <span>Cooked by Rushang</span>
        {/* Social media icons section */}
        <div className="flex items-center gap-2">
          {/* GitHub Profile Link */}
          <a
            href="https://github.com/RushangSavaliya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="btn btn-ghost btn-sm p-2 rounded-lg text-base-content/70 hover:text-primary hover:bg-primary/10"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          {/* LinkedIn Profile Link */}
          <a
            href="https://www.linkedin.com/in/rushang-savaliya/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="btn btn-ghost btn-sm p-2 rounded-lg text-base-content/70 hover:text-primary hover:bg-primary/10"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
