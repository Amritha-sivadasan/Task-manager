import { Request, Response } from "express";
import { Task } from "../model/taskSchema";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const getCategoryFromTitle = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("work")) return "Work";
  if (lowerTitle.includes("study")) return "Study";
  if (lowerTitle.includes("health")) return "Health";
  if (lowerTitle.includes("personal")) return "Personal";
  return "Uncategorized";
};

class TaskController {
  public getallTask = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user;

    try {
      const allTask = await Task.find({ userId, status: { $ne: "completed" } });

      res.status(200).json({ message: "", success: true, data: allTask });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };

  public getAllItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tasks = await Task.find();

      const categoryCounts: { [key: string]: number } = {
        Work: 0,
        Study: 0,
        Health: 0,
        Personal: 0,
        Uncategorized: 0,
      };
      const statusCounts: {
        completed: number;
        inProgress: number;
        notStarted: number;
      } = {
        completed: 0,
        inProgress: 0,
        notStarted: 0,
      };
   

      tasks.forEach((task) => {
        const category = getCategoryFromTitle(task.title);
        categoryCounts[category]++;

        if (task.status === "completed") {
          statusCounts.completed++;
        } else if (task.status === "in-progress") {
          statusCounts.inProgress++;
        } else {
          statusCounts.notStarted++;
        }

        const createdAt = task?.createdAt;
        const week = Math.ceil(new Date(createdAt).getDate() / 7);
      
      });
      const totalTasks = tasks.length;
      const completionRate =
        totalTasks > 0 ? (statusCounts.completed / totalTasks) * 100 : 0;
       res.json({
          totalTasks,
          completedTasks: statusCounts.completed,
          completionRate: completionRate.toFixed(1),  
          tasksByCategory: categoryCounts,
          taskCompletionStatus: {
            completed: statusCounts.completed,
            inProgress: statusCounts.inProgress,
            notStarted: statusCounts.notStarted,
          },
      
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };

  public getCompleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user;
      const allTask = await Task.find({ userId, status: "completed" });
      res.status(200).json({ message: "", success: true, data: allTask });
    } catch (error) {
      res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };

  public searchItem= async(req:AuthenticatedRequest,res:Response)=>{
    const userId = req.user;
    const {word}=req.body
    try {
      const searchResult= await   Task.find({userId, status:{$ne:"completed"}, $or:[{title:{$regex:word,$options: "i"}},{description:{$regex:word,$options:'i'}}]})
      res.status(200).json({ message: "", success: true, data: searchResult });
    } catch (error) {
      res
      .status(500)
      .json({ message: "internal server error", success: false, error });
    }
  }
}

export default new TaskController();
