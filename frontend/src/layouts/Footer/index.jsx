import { React } from "react";
import "./styles.css";

export default function Footer() {
  return (
    <footer className="fixed-bottom text-center">
      <div className="text-center text-secondary p-3">
        © 2023 Copyright:{" "}
        <a className="text-secondary" href="/">
          Restify.com
        </a>
      </div>
    </footer>
  );
}
