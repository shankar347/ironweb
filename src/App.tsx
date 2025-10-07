

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/userpages/Home";
import Services from "./pages/userpages/Services";
import BookingSelection from "./pages/BookingSelection";
import CustomerRegister from "./pages/userpages/CustomerRegister";
import CustomerLogin from "./pages/userpages/CustomerLogin";
import AgentRegister from "./pages/agentpages/AgentRegister";
import AgentLogin from "./pages/agentpages/AgentLogin";
import About from "./pages/userpages/About";
import Contact from "./pages/userpages/Contact";
import NotFound from "./pages/NotFound";
import Customeremail from "./pages/userpages/customeremailotp";
import ContexProvider, { SteamContext } from "./hooks/steamcontext";
import { useContext } from "react";
import Approuter from "./Approuter";
import Sidebar from './components/sidebar';
import Appsrcpages from "./appsrcpages";


const queryClient = new QueryClient();



const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ToastContainer
            // where the toast will appear
            autoClose={3000}       // close after 3 sec
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <ContexProvider>
            <Appsrcpages />
          </ContexProvider>
        </BrowserRouter>
    </QueryClientProvider>
  );

}
export default App;
