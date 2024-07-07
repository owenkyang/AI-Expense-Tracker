import { users } from '../dummyData/data.js';
import User from '../models/user.model.js';
import bcrypt from 'bycryptjs';
const userResolver = {
    Mutation:{
        signUp: async(_, {input}, context)=>{
            try{
                const {username, name, password} = input;
                if (!username || !name || !password){
                    throw new Error("All Fields are required");
                }
                const existingUser = await User.findOne({username});
                if (existingUser){
                    throw new Error("User already exists");
                }
                const salt = await bcrypt.genSalt(10) // how long the hash of the password is
                const hashedPassword = await bcrypt.hash(password, salt); // converted to something not readable
                const ProfilePic = `https://avater.iran.liara.run/public/username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    profilePicture: ProfilePic
                })

                await newUser.save();
                await context.login(newUser)
                return newUser;
            } catch(err){
                console.error("Error in signUp: ", err)
                throw new Error(err.message || "Internal Server error");
            }
        },
        login: async(_, {input}, context) => {
            try{
                const {username,password} = input;
                const {user} = await context.authenticate("graphql-local", {username, password})
                await context.login(user);
                return user
            }
            catch(err){
                console.error("Error in login:", err);
                throw new Error(error.message || "Internal server error");
            }
        },
        logout: async(_,__,context) =>{
            try{
                await context.logout();
                req.session.destroy((err) => {
                    if (err) throw err;
                });
                res.clearCookie("connect.sid");
                return {message: "Logged out successfully"};
            }
            catch(err){
                console.error("Error in logout:", err);
                throw new Error(error.message || "Internal server error");
            }
        }
    },
    Query:{
        authUser: async(_,__, context) => {
            try{
                const user = await context.getUser();
                return user;
            }
            catch(err){
                console.error("Error in authUser: ", err);
                throw new Error("Internal server error");
            }
        },
        user: async (_, {userid}) => {
            try{
                const user = await User.findById(userId);
                return user
            } catch(err){
                console.error("Error in user query: ", err);
                throw new Error(err.message || "Error getting user");
            }
        }
    },
    
};

export default userResolver;