import React, { useState } from "react";
import "./TaskCard.scss";
import axios from "axios";
import trash from "../assets/delete.svg";
function TaskCard({
  id,
  title,
  details,
  startTime,
  endTime,
  status,
  updateDom,
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [statusClass, setStatusClass] = useState(
    `status ${status.toLowerCase()}`
  );
  // ! update the status on changes
  const statusHandler = () => {
    if (currentStatus === "TODO") {
      setCurrentStatus("DONE");
      setStatusClass("status done");
      axios
        .post("http://localhost:5000/api/update-post", {
          _id: id,
          startTime,
          endTime,
          taskTitle: title,
          taskDetails: details,
          status: "DONE",
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    } else if (currentStatus === "DONE") {
      setCurrentStatus("TODO");
      setStatusClass("status todo");
      axios
        .post("http://localhost:5000/api/update-post", {
          _id: id,
          startTime,
          endTime,
          taskTitle: title,
          taskDetails: details,
          status: "TODO",
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
  };
  // ! delete the post from the db
  const deleteHandler = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:5000/api/delete-post", {
        _id: id,
        startTime,
        endTime,
        taskTitle: title,
        taskDetails: details,
        status: currentStatus,
      })
      .then((res) => {
        console.log(res.data);
        updateDom();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="task-card">
      <div className="task-card__left">
        <h1 className="task-card__left--title">
          {title}
          <span className={statusClass} onClick={statusHandler}>
            {currentStatus}
          </span>
        </h1>
        <p className="task-card__left--details">{details}</p>
      </div>
      <div className="task-card__right">
        <h2 className="task-card__right--from">{startTime}</h2>
        <span></span>
        <h2 className="task-card__right--to">{endTime}</h2>
      </div>
      <div className="delete-btn">
        <img src={trash} alt="" onClick={(ev) => deleteHandler(ev)} />
      </div>
    </div>
  );
}

export default TaskCard;
