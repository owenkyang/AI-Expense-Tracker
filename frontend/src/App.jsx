import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import Chatbot from "./pages/ChatBotPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import GridBackground from "./components/ui/GridBackground";
// TODO: add AI financial adviser, way to add credit cards
// TODO: add a spreadsheet reader, automatically adds transactions/expenses
// TODO: add clearer return button, for example when we go to update transaction, hard to figure out how to return to home page
// 3:21:00 explains how requests get cached, for example, once we open up the home page and go to another page and return back to home page, we do not make a request again
// makes it super fast
// Document how GraphQL works, especially the apollo graphql part (from GPT)
function App() {
  const {loading, data, error} = useQuery(GET_AUTHENTICATED_USER);
  console.log("Loading:", loading)
  console.log("Authenticated user:", data)
  console.log("Error:", error)
  
  if (loading) return null;

  return (
    <>
      {data?.authUser && <Header/>}
      <Routes>
        <Route path="/" element ={data.authUser ? <GridBackground><HomePage /></GridBackground> : <Navigate to="/login"/>} />
        <Route path="/login" element ={!data.authUser ? <GridBackground><LoginPage /></GridBackground>:<Navigate to = "/"/> }/>
        <Route path="/signup" element ={!data.authUser ? <GridBackground><SignUpPage /></GridBackground>:<Navigate to = "/"/>}/>
        <Route path="/transaction/:id" element ={data.authUser ?<GridBackground><TransactionPage /></GridBackground> : <Navigate to="/login"/>}/>
        <Route path = "/chatbot" element = {data.authUser ? <Chatbot /> : <Navigate to = "/login"/>}/>
        <Route path="*" element ={<NotFoundPage />}/>
      </Routes>
      <Toaster/>
  
    </>
  );
}

export default App
