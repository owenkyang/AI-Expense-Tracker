import { users } from '../dummyData/data.js';
import Transaction from '../models/transaction.model.js';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
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
                const ProfilePic = `https://avatar.iran.liara.run/username?username=${username}`;

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
                if (!username || !password) throw new Error("All fields are required");
                const {user} = await context.authenticate("graphql-local", {username, password});
                await context.login(user);
                return user;
            }
            catch(err){
                console.error("Error in login:", err);
                throw new Error(err.message || "Internal server error");
            }
        },
        logout: async(_,__,context) =>{
            try{
                await context.logout();
                context.req.session.destroy((err) => {
                    if (err) throw err;
                });
                context.res.clearCookie("connect.sid");
                return {message: "Logged out successfully"};
            }
            catch(err){
                console.error("Error in logout:", err);
                throw new Error(err.message || "Internal server error");
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
        user: async (_, {userId}) => {
            try{
                const user = await User.findById(userId);
                return user
            } catch(err){
                console.error("Error in user query: ", err);
                throw new Error(err.message || "Error getting user");
            }
        }
    },
    User: {
        transactions:async(parent) => {
            try{
                const transactions = await Transaction.find({userId:parent._id})
                return transactions;
            }
            catch(error){
                console.log("Error in user.transactions resolve ", err);
                throw new Error(err.message || "Internal server error");
            }
        }
    }
    
};

export default userResolver;