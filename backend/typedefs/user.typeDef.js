const userTypeDef = `#graphql
  type User {
    _id: ID! # cannot be null
    username: String! # cannot be null
    name: String!
    password: String!
    profilePicture: String # can be null value, not required, ! means required
  }
  type Query {
    authUser: User
    user(userId:ID!): User # fetch a single user with their ID, as response, we sent the user
  }
  type Mutation{
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
  }
  input SignUpInput{
    username: String!
    name: String!
    password: String!
  }
  input LoginInput {
    username: String!
    password: String!  
  }
  type LogoutResponse{
    message: String!
  }

`;

export default userTypeDef;