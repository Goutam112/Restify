import { React } from "react";
import "./styles.css";

export default function Footer() {
  return (
    <footer class="fixed-bottom text-center">
      <div class="text-center text-secondary p-3">
        © 2023 Copyright:{" "}
        <a class="text-secondary" href="/csc309-restify/views/home.html">
          Restify.com
        </a>
      </div>
    </footer>
  );
}
