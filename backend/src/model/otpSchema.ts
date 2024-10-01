import mongoose, { Schema, model, Document } from "mongoose";

export interface IOtp{
 _id?:mongoose.Types.ObjectId
 email:string,
 otp:string
}

const OtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, requied: true },
    createdAt: { type: Date, expires: "3m", default: Date.now, required: true },
  },

);

OtpSchema.pre("save", function (next) {
  this.createdAt = new Date();
  next();
});

OtpSchema.pre("updateOne", function (next) {
  this.set({ createdAt :Date.now()});
  next()
});

OtpSchema.pre('findOneAndUpdate',function(next){

    this.set({createdAt:Date.now()})
    next()
})

const Otp= model<IOtp & Document>('Otp',OtpSchema)

export {Otp}