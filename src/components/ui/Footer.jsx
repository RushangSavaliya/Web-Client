import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer mt-8">
      <div className="flex items-center justify-center gap-4 text-sm">
        <span>Crafted by Rushang</span>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/RushangSavaliya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/rushang-savaliya/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
