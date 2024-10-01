import { Request, Response } from "express";
import { User } from "../model/userSchema";
import { tokenCreation } from "../utils/utitlity/jwt";
import { TokenExpiredError } from "jsonwebtoken";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}
import bcrypt from "bcryptjs";

const saltRounds = 10;
const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, saltRounds);
};

class AuthController {
  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const existUser = await User.findOne({ email });
      if (existUser) {
        res.status(409).json({ message: "User Already Exist", success: false });
        return;
      }
      const hashedPassword = hashPassword(password);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      const userId = newUser._id;
      const accessToken = tokenCreation(userId);
      const userObject = {
        ...newUser,
        password: "",
      };
      res
        .status(201)
        .json({
          message: "User Created Successfully",
          success: true,
          accessToken,
          data: userObject,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
        const existUser= await User.findOne({email}).lean();
        if(!existUser){
            res.status(404).json({message:"User Not Found",success:false})
            return
        }

        const hashedPassword=await bcrypt.compare(password,existUser.password)
        if(!hashedPassword){
            res.status(404).json({message:"Invalid Credential",success:false})
            return
        }
     
        const accessToken = tokenCreation(existUser._id);
        const userObject = {
          ...existUser,
          password:""
          
        };
       
        res.status(200).json({success:true,message:"Login Successfull",data:userObject,accessToken})
      
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  };
}

export default new AuthController();
