import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_, __, context) => {
            try{
                if(!context.getUser()){
                    throw new Error ("Unauthorized");
                }
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({userId});
                return transactions;
            }
        catch(error){
            console.error("Error getting transactions: ", err);
            throw new Error("Error getting transactions");

        }
        },
        transaction: async(_,{transactionId}, __) =>{
            try{
                const transaction = await Transaction.findById(transactionId);
                return transaction
            }
            catch(error){
                console.error("Error getting transaction: ", err)
                throw new Error("Error getting transaction");
            }
        },
        // code below is a bit confusing let me show an example:
        categoryStatistics: async (_, __, context) =>{
            if (!context.getUser()) throw new Error("Unauthorized");

            const userId = context.getUser()._id;
            const transactions = await Transaction.find({userId});
            const categoryMap = {};
            // const transactions = [
            //     {catgory: "expense", amount: 50},
            //     {category: "expense", amount: 75},
            //     {category: "investement", amount: 100}.
            //     {category: "saving", amount: 30}
            // ]
            transactions.forEach((transaction) => {
                if (!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            });
            // categoryMap = {expense: 125, investment: 100, saving: 30}
            return Object.entries(categoryMap).map(([category, totalAmount]) => ({category, totalAmount}));
            // return [{category: "expense", totalAmount: 125}, ... etc]
        },

    
    },
    Mutation: {
        createTransaction: async(parent, {input}, context) =>{
            try{
                const newTransaction = new Transaction({
                    ...input,
                    userId:context.getUser()._id
                })
                await newTransaction.save() // saves to database
                return newTransaction
            }
            catch(err){
                console.error("Error creating transaction: ", err)
                throw new Error("Error creating transaction");
            }
        },
        updateTransaction: async(_, {input}) =>{
            try{
                // new returns the updated document to the database
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new:true})
                return updatedTransaction
            }
            catch(err){
                console.error("Error updating transaction: ", err)
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}) =>{
            try{
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deleteTransaction;
            }catch(err){
                console.error("Error deleting transaction: ", err)
                throw new Error("Error deleting transaction");
            }
        }
    },
    Transaction: {
        user: async(parent) => {
            const userId = parent.userId // parent is the transaction
            try{
                const user = await User.findById(userId);
                return user;
            }catch(error){
                console.error("Error getting user:", err);
                throw new Error("Error getting user")
            }
        }
    }
}
export default transactionResolver;