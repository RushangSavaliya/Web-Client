// File: src/components/Footer.jsx

import { FaGithub, FaLinkedin } from "react-icons/fa";

// Footer component for the application
export default function Footer() {
  return (
    <footer className="mt-8 mb-4 text-center">
      {/* Container for footer content */}
      <div className="footer flex items-center justify-center gap-3 text-sm">
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
            className="footer inline-flex items-center justify-center p-2 rounded-lg transition-colors"
          >
            <FaGithub className="w-4 h-4" />
          </a>
          {/* LinkedIn Profile Link */}
          <a
            href="https://www.linkedin.com/in/rushang-savaliya/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="footer inline-flex items-center justify-center p-2 rounded-lg transition-colors"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
