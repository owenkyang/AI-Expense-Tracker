import Transaction from "../models/transaction.model.js";

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
}
export default transactionResolver;