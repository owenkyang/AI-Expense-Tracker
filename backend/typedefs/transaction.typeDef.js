const transactionTypeDef = `#graphql
    type Transaction{
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
        user: User!
    }
    
    type Query{
        transactions: [Transaction!]
        transaction(transactionId:ID!): Transaction # sends only 1 transaction back
        categoryStatistics: [CategoryStatistics!]

    }
    type Mutation{
        createTransaction(input: CreateTransactionInput!): Transaction!
        updateTransaction(input: UpdateTransactionInput!): Transaction!
        deleteTransaction(transactionId:ID!): Transaction!
    }
    type CategoryStatistics{
        category: String!
        totalAmount: Float!
    }
    type NameStatistics{
        description: String!
        totalAmount: Float!
    }
    input CreateTransactionInput{
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        date: String!
        location: String
    }

    input UpdateTransactionInput{
        transactionId: ID! # only required so we know which transaction to update
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String # none of these fields are required, since we might only want to update one parameter
    }
`;
export default transactionTypeDef;