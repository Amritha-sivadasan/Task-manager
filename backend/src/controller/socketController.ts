import { Server } from "socket.io";
import http from "http";
import { ITask } from "../model/taskSchema";
import { Task } from "../model/taskSchema";

export const createServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("addnewTask", async (task: ITask) => {
      try {
        const addedTask = new Task(task);
        await addedTask.save();
        socket.emit("taskAdded", addedTask);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    });
    socket.on("updateStatus", async (id: string, status: string) => {
      try {
        await Task.updateOne({ _id: id }, { $set: { status } });
        socket.emit("statusUpdated", status, id);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    });

    socket.on("updateTask", async (task: ITask) => {
      await Task.findByIdAndUpdate(task._id, task);
      socket.emit("taskUpdated", task);
    });

    socket.on("deleteTask", async (taskId: string) => {
      await Task.deleteOne({ _id: taskId });
      socket.emit("taskDeleted", taskId);
    });

  //   socket.on("search",async(search:string)=>{
  //  const result=  await Task.find({status:{$ne:"completed"}, $or:[{title:{$regex:search,$options: "i"}},{description:{$regex:search,$options:'i'}}]})
  // //  console.log('result',result)
  // const serializedResult = JSON.parse(JSON.stringify(result));
  //  socket.emit('searchResult',serializedResult)
  //   });
  });
};
