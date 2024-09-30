import { ITask } from "../../components/dashboard/MyTasks";
import { axiosInstnce } from "../instance/axiosInstance";

interface Error {
  response?: {
    data?: {
      message: string;
    };
  };
}

export const addNewTask = async (newTask: ITask) => {
  try {
    const response = await axiosInstnce.post("/addTask", newTask);
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const getTask = async () => {
  try {
    const response= await axiosInstnce.get('/getTasks')
    return response.data
  } catch (error) {
    return (error as Error).response?.data;
  }
};


export const alldetails= async()=>{
  try {
    const response= await axiosInstnce.get('/alldetails')
    return response.data
  } catch (error) {
    return (error as Error).response?.data;
  }
}


export const completeTask= async()=>{
  try {
    const response= await axiosInstnce.get('/completeTasks')
    return response.data
    
  } catch (error) {
    return (error as Error).response?.data;
  }
}