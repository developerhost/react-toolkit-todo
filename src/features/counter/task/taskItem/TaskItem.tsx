import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import styles from "./TaskItem.module.scss";
import EventNoteIcon from "@mui/icons-material/EventNote";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TaskForm from "../taskForm/TaskForm";
import {
  selectTask,
  deleteTask,
  handleModalOpen,
  selectIsModalOpen,
  editTask,
  fetchTasks,
} from "../taskSlice";
import { AppDispatch } from "../../../../app/store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface PropTypes {
  task: { id: string; title: string; completed: boolean };
}

const TaskItem: React.FC<PropTypes> = ({ task }) => {
  const isModalOpen = useSelector(selectIsModalOpen);
  const dispatch: AppDispatch = useDispatch();
  const handleOpen = () => {
    dispatch(selectTask(task));
    dispatch(handleModalOpen(true));
  };
  const handleClose = () => {
    dispatch(handleModalOpen(false));
  };

  const handleEdit = async (id: string, title: string, completed: boolean) => {
    const sendData = { id, title, completed: !completed };
    await editTask(sendData);
    dispatch(fetchTasks());
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    dispatch(fetchTasks());
  };
  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <EventNoteIcon />
        <div className={styles.title_text}>{task.title}</div>
      </div>
      <div className={styles.right_item}>
        <Checkbox
          checked={task.completed}
          onClick={() => handleEdit(task.id, task.title, task.completed)}
          className={styles.checkbox}
        />
        <button onClick={handleOpen} className={styles.edit_button}>
          <EditIcon className={styles.icon} />
        </button>
        <button
          onClick={() => handleDelete(task.id)}
          className={styles.delete_button}
        >
          <DeleteIcon className={styles.icon} />
        </button>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TaskForm edit />
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default TaskItem;
