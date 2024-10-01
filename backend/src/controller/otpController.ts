import { Request, Response } from "express";
import { User } from "../model/userSchema";
import { Otp } from "../model/otpSchema";
import { sendOtp } from "../utils/utitlity/nodemailer";
import { generateOtp } from "../utils/utitlity/generateOtp";

class OtpController {
  public sendOtpToUser = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        res.status(409).json({ message: "User Already Exist", success: false });
        return;
      }
      const otp = generateOtp();
      await sendOtp(email, otp);
      await Otp.updateOne({ email }, { $set: { otp: otp } }, { upsert: true });

      res.status(200).json({ message: "Otp send successfully", success: true });
    } catch (error) {
      console.log("erroor ", error);
      res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };

  public verifyOtp = async (req: Request, res: Response) => {
    const { otp, email } = req.body;

    try {
      const validOtp = await Otp.findOne({ email });

      if (!validOtp) {
        res
          .status(404)
          .json({ message: "You are not authenticated", success: false });
        return;
      }
      if (validOtp.otp !== otp) {
        res.status(403).json({ message: "Invalid Otp", success: false });
        return;
      }
      await Otp.deleteOne({ email });
      res
        .status(200)
        .json({ message: "Otp verified successfully", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };
}

export default new OtpController();
