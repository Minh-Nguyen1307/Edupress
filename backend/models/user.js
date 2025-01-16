import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        "email" : {
            type:String,
            required:true
        },
        "password": {
            type:String,
            required:true
        },
        "role" : {
            type:String,
            enum: ['ADMIN','CUSTOMER',"PROVIDER"]
        }
    }
);
const EdupressUserModel = new mongoose.model('EdupressUser', UserSchema);
export default EdupressUserModel;