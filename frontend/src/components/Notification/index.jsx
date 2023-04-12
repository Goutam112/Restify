import React from "react";
import "./styles.css";

export default function Notification(props) {
  let text = props.notification.content.split("_").join(" ");
  text = text.slice(0, text.indexOf(" ")) + ":" + text.slice(text.indexOf(" "));
  text =
    text.charAt(0).toUpperCase() +
    text.slice(1, text.indexOf(" ") + 1) +
    text.charAt(text.indexOf(" ") + 1).toUpperCase() +
    text.slice(text.indexOf(" ") + 2);

  const timestamp = props.notification.created_when
    ? ` ${props.notification.created_when.slice(
        11,
        16
      )} (${props.notification.created_when.slice(0, 10)})`
    : "";

  function deleteNotification() {
    fetch(
      `http://localhost:8000/notifications/clear/${props.notification.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            localStorage.token ? localStorage.token : ""
          }`,
        },
      }
    )
      .then((res) => window.location.replace("/notifications"))
      .catch((err) => console.error("Notification Clear ERROR:", err));
  }

  return (
    <div
      href="/csc309-restify/views/properties/property_view_host.html"
      className="notification list-group-item list-group-item-action d-flex justify-content-between"
    >
      {text}
      <span className="text-secondary">{timestamp}</span>
      <button className="btn btn-danger" onClick={deleteNotification}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-x"
          viewBox="0 0 16 16"
        >
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
    </div>
  );
}
