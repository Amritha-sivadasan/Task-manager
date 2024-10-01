import nodemailer from "nodemailer";

export async function sendOtp(email: string,otp:string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const mailsendOption = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: "Otp Created For your Task Manger",
    text: `Your otp is ${otp}`
  };

  await transporter.sendMail(mailsendOption)
}
