import { users } from '../dummyData/data.js';
const userResolver = {
    Query:{
        users: (_,_,context) => {
            return users
        },
        user: (_, {userId}, context) => {
            return users.find((user) => user._id === userId);
        },
    },
    Mutation: {}
};

export default userResolver;