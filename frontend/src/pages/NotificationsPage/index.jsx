import React, { useState, useEffect } from "react";
import "./styles.css";

import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import Notification from "../../components/Notification";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [notificationList, setNotificationList] = useState([]);

  const nextPage = async () => {
    let newPage = page + 1;
    await setPage(newPage);
  };
  const prevPage = async () => {
    let newPage = page - 1;
    await setPage(newPage);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/notifications/list/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token ? localStorage.token : ""}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNotificationList(data.results);
        setNextEnabled(data.next ? true : false);
      })
      .catch((err) => console.error("Fetch notifications ERROR: ", err));
  }, [page]);
  return (
    <>
      <Header />
      <main className="card d-block" id="notificationsPage">
        <h4>Notifications</h4>
        <div className="notifications-list-new list-group">
          {notificationList &&
            notificationList.map(function (notification, i) {
              return <Notification key={i} notification={notification} />;
            })}
        </div>
        <div className="d-flex flex-column justify-content-center paginator-custom">
          <p>
            Page: <b>{page}</b>
          </p>
          <div className="btn-group" role="group">
            <button
              id="notificationPrev"
              onClick={prevPage}
              className="btn btn-secondary btn-sm"
              disabled={page > 1 ? false : true}
            >
              Prev
            </button>
            <button
              id="notificationNext"
              onClick={nextPage}
              className="btn btn-secondary btn-sm"
              disabled={!nextEnabled}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
