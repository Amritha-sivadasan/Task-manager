
import mongoose,{Schema,model,Document} from "mongoose";


 export interface IUser{
    _id?:string
    name:string,
    email:string,
    password:string

 }

const userSchema= new Schema({
   name:{type:String,required:true},
   email:{type:String, requried:true},
   password:{type:String,required:true}

},{timestamps:true})


const User= model<IUser & Document>("User",userSchema)

export  {User}