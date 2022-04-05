import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchTasks,
  createTask,
  editTask,
  handleModalOpen,
  selectSelectedTask,
} from "../taskSlice";
import { AppDispatch } from "../../../../app/store";
import styles from "./TaskForm.module.scss";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// type Inputs = {
//   taskTitle: string;
// };

type PropTyeps = {
  edit?: boolean;
};

const TaskForm: React.FC<PropTyeps> = ({ edit }) => {
  const dispatch: AppDispatch = useDispatch();
  const selectedTask = useSelector(selectSelectedTask);
  const { register, handleSubmit, reset } = useForm();
  const handleCreate = async (data: any) => {
    await createTask(data.taskTitle);
    reset();
    dispatch(fetchTasks());
  };
  const handleEdit = async (data: any) => {
    const sendData = { ...selectedTask, title: data.taskTitle };
    await editTask(sendData);
    dispatch(handleModalOpen(false));
    dispatch(fetchTasks());
    console.log(data);
  };
  return (
    <div className={styles.root}>
      <Box
        onSubmit={edit ? handleSubmit(handleEdit) : handleSubmit(handleCreate)}
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        className={styles.form}
      >
        <TextField
          id="standard-basic"
          label={edit ? "Edit Task" : "New Task"}
          defaultValue={edit ? selectedTask.title : ""}
          variant="standard"
          {...register("taskTitle")}
          className={styles.text_field}
        />
        {edit ? (
          <div className={styles.button_wrapper}>
            <button type="submit" className={styles.submit_button}>
              Submit
            </button>
            <button
              type="button"
              onClick={() => dispatch(handleModalOpen(false))}
              className={styles.cancel_button}
            >
              Cancel
            </button>
          </div>
        ) : null}
      </Box>
    </div>
  );
};

export default TaskForm;
