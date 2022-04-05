import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { db } from "../../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  // orderBy,
  // query,
  setDoc,
} from "firebase/firestore";

// stateの型
interface TaskState {
  // taskが何個あるのか管理
  idCount: number;
  // storeに保存するtask一覧
  tasks: { id: string; title: string; completed: boolean }[];
  // taskのtitleを編集する際にどのtaskが選択されているか
  selectedTask: { id: string; title: string; completed: boolean };
  // Modalを開くか閉じるかのフラグ
  isModalOpen: boolean;
}

// stateの初期値
const initialState: TaskState = {
  idCount: 1,
  tasks: [],
  selectedTask: { id: "", title: "", completed: false },
  isModalOpen: false,
};

// taskの全件取得
export const fetchTasks = createAsyncThunk("task/getAllTasks", async () => {
  const usersRef = collection(db, "users");
  // const order = query(usersRef, orderBy("dateTime", "desc"));
  const querySnapshot = await getDocs(usersRef);

  const allTasks = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    completed: doc.data().completed,
  }));

  const taskNumber = allTasks.length;
  const passData = { allTasks, taskNumber };
  return passData;
});

//taskの新規作成
export const createTask = async (title: string): Promise<void> => {
  try {
    // const dateTime = Timestamp.fromDate(new Date());
    // firestoreのtaskコレクションにデータを追加(ドキュメントidは自動で振られる)
    await addDoc(collection(db, "tasks"), {
      title: title,
      completed: false,
      // dateTime: dateTime,
    });
  } catch (err) {
    console.log("Error", err);
  }
};

// taskの編集
export const editTask = async (submitData: {
  id: string;
  title: string;
  completed: boolean;
}): Promise<void> => {
  const { id, title, completed } = submitData;
  // const dateTime = Timestamp.fromDate(new Date());
  try {
    await setDoc(
      doc(db, "tasks", id),
      {
        title: title,
        completed: completed,
        // dateTime: dateTime,
      },
      { merge: true }
    );
  } catch (err) {
    console.log("error", err);
  }
};

// taskの削除
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "tasks", id));
  } catch (err) {
    console.log("error", err);
  }
};

export const taskSlice = createSlice({
  // このsliceの名前。actionTypeを生成するときにprefixとなる。
  name: "task",
  // このsliceで用いるinitialStateの値
  initialState,
  // reducersの中身を記述
  reducers: {
    // taskの作成
    // createTask: (
    //   state: { idCount: number; tasks: any[] },
    //   action: { payload: any }
    // ) => {
    //   state.idCount++;
    //   const newTask = {
    //     id: state.idCount,
    //     title: action.payload,
    //     completed: false,
    //   };
    //   state.tasks = [newTask, ...state.tasks];
    // },
    // taskの編集
    // editTask: (state, action) => {
    //   // state.tasksの中から指定したtaskを抜き出す
    //   const task = state.tasks.find((t) => t.id === action.payload.id);
    //   if (task) {
    //     // 抜き出したtaskのtitleを書き換える
    //     task.title = action.payload.title;
    //   }
    // },
    // taskの削除
    // deleteTask: (state, action) => {
    //   // 指定したタスク以外で新しくstate.tasksの配列を作成し直している
    //   state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    // },
    // どのtaskを選択しているか管理
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    // Modalを開くか閉じるかのフラグ管理
    handleModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    // task完了未完了のチェックを変更
    completeTask: (state, action) => {
      // state.tasksの中から指定したtaskを抜き出す
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        // 抜き出したcompletedを反転
        task.completed = !task.completed;
      }
    },
  },
  extraReducers: (builder) => {
    // stateとactionの型が正しく推論されるためにbuilder関数を用いる
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      // action.payload === return passData
      state.tasks = action.payload.allTasks;
      state.idCount = action.payload.taskNumber;
    });
  },
});

export const {
  // createTask,
  // editTask,
  // deleteTask,
  selectTask,
  handleModalOpen,
  completeTask,
} = taskSlice.actions;

// コンポーネント側からuseSlectorを用いてselectTaskを指定することで
// stateの値をコンポーネントに渡すことが可能
export const selectTasks = (state: RootState): TaskState["tasks"] =>
  state.task.tasks;

export const selectIsModalOpen = (state: RootState): TaskState["isModalOpen"] =>
  state.task.isModalOpen;

export const selectSelectedTask = (
  state: RootState
): TaskState["selectedTask"] => state.task.selectedTask;

export default taskSlice.reducer;
