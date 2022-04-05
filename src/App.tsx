import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/header/Header";
import styles from "./App.module.scss";
import TaskForm from "./features/counter/task/taskForm/TaskForm";
import TaskList from "./features/counter/task/taskList/TaskList";
import { fetchTasks } from "./features/counter/task/taskSlice";
import { AppDispatch } from "./app/store";

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const getData = () => {
      dispatch(fetchTasks());
    };
    getData();
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <Header />
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
};

export default App;
