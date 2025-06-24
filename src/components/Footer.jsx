import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <div className="text-center mt-8 mb-4">
      <div className="flex items-center justify-center gap-3 text-sm text-base-content/60">
        <span>Cooked by Rushang</span>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/RushangSavaliya"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:text-primary hover:bg-primary/10"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/rushang-savaliya/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:text-primary hover:bg-primary/10"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
