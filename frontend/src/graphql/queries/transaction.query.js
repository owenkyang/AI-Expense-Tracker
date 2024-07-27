import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
    query GetTransactions{
        transactions{
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`
export const GET_TRANSACTION = gql`
    query GetTransaction($id: ID!){
        transaction(transactionId: $id){
            _id
            description
            paymentType
            category
            amount
            location
            date
            user {
                name
                username
                profilePicture
            }
        }
    }
`
export const GET_TRANSACTION_STATISTICS = gql`
    query GetTransactionStatistics{
        categoryStatistics{
            category
            totalAmount
        }
    }
`
// to do get specific transaction statistics for AI
// has name of transaction rather than category
// feed into a POST request to an API
// API feeds into 