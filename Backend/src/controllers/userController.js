import { User } from "../models/userModels.js";
import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt"
import crypto from "crypto";

const login = async(req,res ) =>{

const {username, password} = req.body;
if(!username || !password){
    return res.status(400).json({message: "Please Provide"});
}
    try{
const user = await User.findOne({username});
if(!user){
    return res.status(httpStatus.NOT_FOUND).json({message: "User not found"});
}
 const isPasswordValid = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" }); 
        }

        let token = crypto.randomBytes(20).toString("hex");
user.token = token;
await user.save();
return res.status(httpStatus.OK).json({token: token});


    }
    catch(e){
return res.status(500).json({message: `Something went wrong ${e}`})
    }
}

const register = async (req, res)=>{
    const {username , password , email } = req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username : username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(httpStatus.CREATED).json({message:"User Registered"});
    }
    catch(e){
res.json({message: `Something went wrong ${e}`});
    }
}

const getUserHistory = async(req, res)=>{
    const {token} = req.query;
    try{
        const user= await User.findOne({token: token})
    }catch(e){
        res.json({message: `Something went wrong ${e}`})
    }
}

const addToHistory = async (req, res)=>{
    const {token, meeting_code}= req.body;
    
    try{
        const user = await User.findOne({token: token});

        const newMeeting = new Meeting({
            user_id : user.username,
            meeting_code: meeting_code,
        })
        await newMeeting.save();
       res.status(httpStatus.CREATED).json({message: "Added cose to history"})
         
    }catch(e){
        res.json({message:`Something went wrong ${e}`})
    }
}


export {login, register, getUserHistory, addToHistory}