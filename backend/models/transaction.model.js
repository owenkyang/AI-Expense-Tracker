import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({ // schema defines the structure of the data
    userId: {
        type: mongoose.Schema.Types.ObjectId, // transaction will have a userId field that will be referencing to the User model
        ref: "User",
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["cash", "card"],
        required: true,
    },
    category:{
        type: String,
        enum: ["saving", "expense", "investment"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        default: "Unknown",
    },
    date: {
        type: Date,
        required: true,
    },
});
const Transaction = mongoose.model("Transaction", transactionSchema) // model is an individual data object
export default Transaction