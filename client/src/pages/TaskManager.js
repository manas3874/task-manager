import React, { useState, useRef, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import "./TaskManager.scss";
import axios from "axios";
function TaskManager() {
  // ! Refs to clear the inputs post submission
  const titleInput = useRef(null);
  const detailsInput = useRef(null);
  const startTimeInput = useRef(null);
  const endTimeInput = useRef(null);
  // ! States to hold data
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("TODO");
  // ! previous posts
  const [posts, setPosts] = useState([]);
  // ! classname manager
  const [todoClass, setTodoClass] = useState("todo active");
  const [doneClass, setDoneClass] = useState("done");
  // ! update posts array after deleting
  const updatePosts = () => {
    fetchPosts();
  };
  // ! function to fetch posts
  const fetchPosts = async () => {
    const posts = (await axios.get("http://localhost:5000/api/get-posts")).data;
    console.log(posts);
    const arrayOfTasks = posts.map((item) => (
      <TaskCard
        id={item._id}
        title={item.taskTitle}
        details={item.taskDetails}
        startTime={item.startTime}
        endTime={item.endTime}
        status={item.status}
        updateDom={updatePosts}
      />
    ));
    setPosts(arrayOfTasks);
  };

  // ! Effect to fetched pre-saved data
  useEffect(() => {
    fetchPosts();
  }, []);

  // ! Submit post handler
  const submitHandler = async () => {
    if (title === "" || details === "" || startTime === "" || endTime === "") {
      alert("fill all the required details");
    } else {
      titleInput.current.value = "";
      detailsInput.current.value = "";
      startTimeInput.current.value = "";
      endTimeInput.current.value = "";
      const id = new Date().toString();
      await axios.post("http://localhost:5000/api/create-post", {
        _id: id,
        startTime,
        endTime,
        taskTitle: title,
        taskDetails: details,
        status,
      });
      await setPosts([
        <TaskCard
          id={id}
          title={title}
          details={details}
          startTime={startTime}
          endTime={endTime}
          status={status}
          updateDom={updatePosts}
        />,
        ...posts,
      ]);

      await setStatus("TODO");
      await setTodoClass("todo active");
      await setDoneClass("done");
    }
  };

  return (
    <div className="task-manager-wrapper">
      <section className="task-manager">
        <input
          type="text"
          className="task-manager-title"
          placeholder="Task title"
          onChange={(ev) => setTitle(ev.target.value)}
          ref={titleInput}
          required
        />
        <div className="details-area">
          <textarea
            className="task-manager-details"
            placeholder="Details"
            onChange={(ev) => setDetails(ev.target.value)}
            ref={detailsInput}
            required
            cols="30"
            rows="10"
          ></textarea>
          <div className="time-status-selection">
            <input
              type="text"
              className="start-time"
              placeholder="start-time ( HH:MM 24hour )"
              onChange={(ev) => setStartTime(ev.target.value)}
              ref={startTimeInput}
              required
            />
            <input
              type="text"
              className="end-time"
              placeholder="end-time  ( HH:MM 24hour )"
              onChange={(ev) => setEndTime(ev.target.value)}
              ref={endTimeInput}
              required
            />
            <div className="status-selection">
              <div
                className={todoClass}
                onClick={() => {
                  setStatus("TODO");
                  setDoneClass("done");
                  setTodoClass("todo active");
                }}
              >
                TODO
              </div>
              <div
                className={doneClass}
                onClick={() => {
                  setStatus("DONE");
                  setDoneClass("done active");
                  setTodoClass("todo");
                }}
              >
                DONE
              </div>
            </div>
            <button className="submit-button" onClick={submitHandler}>
              ADD TASK
            </button>
          </div>
        </div>
      </section>
      <div className="task-cards">{posts.length > 0 && posts}</div>
    </div>
  );
}

export default TaskManager;
