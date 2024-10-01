import mongoose, { Schema, model, Document } from "mongoose";

export interface ITask{
    _id:string,
    title:string,
    description:string,
    status:string,
    dueDate:Date,
    userId:mongoose.Types.ObjectId
    createdAt:Date

}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "overdue"],
  },
  dueDate: { type: Date ,required:true},
  userId:{type:mongoose.Types.ObjectId,requried:true,ref:"User"}
},{timestamps:true});

const Task=model<ITask & Document>('Task',TaskSchema)

export {Task}