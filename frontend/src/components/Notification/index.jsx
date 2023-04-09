import React from "react";
import "./styles.css";

export default function Notification(props) {
  return (
    <a
      href="/csc309-restify/views/properties/property_view_host.html"
      className="notification list-group-item list-group-item-action  d-flex justify-content-between"
    >
      {props.notification.content}
      <span className="text-secondary">{props.notification.created_when}</span>
    </a>
  );
}
