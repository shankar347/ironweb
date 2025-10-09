import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SteamContext } from './hooks/steamcontext';
import LoadingScreen from './components/loader';

// User pages
import Home from "./pages/userpages/Home";
import Services from "./pages/userpages/Services";
import BookingSelection from "./pages/BookingSelection";
import CustomerRegister from "./pages/userpages/CustomerRegister";
import CustomerLogin from "./pages/userpages/CustomerLogin";
import Customeremail from "./pages/userpages/customeremailotp";
import BookSlot from './pages/userpages/BookSlot';
import Confirmaddress from './pages/userpages/Confirmaddress';
import Ordersummary from './pages/userpages/customercheckout';
import Trackorder from './pages/userpages/trackorder';
import Userprofile from './pages/userpages/userprofile';
import Customereditprofile from './pages/userpages/editprofile';
import About from "./pages/userpages/About";
import Contact from "./pages/userpages/Contact";

// Agent pages
import AgentRegister from "./pages/agentpages/AgentRegister";
import AgentLogin from "./pages/agentpages/AgentLogin";
import Agentemail from "./pages/agentpages/agentemailotp";
import Agenthome from './pages/agentpages/agenthome';

// Admin pages
import AdminOrderpage from './pages/adminpages/orderpage';
import Adminuserpage from './pages/adminpages/adminuserpage';
import Adminagentpage from './pages/adminpages/adminagentpage';
import Adminassignoerder from './pages/adminpages/adminassignoerder';
import Adminactivateagent from './pages/adminpages/adminactivateagent';
import Adminorderamount from './pages/adminpages/adminorderamount';

// Misc
import NotFound from "./pages/NotFound";
import Agentanalysis from './pages/agentpages/agentanalysis';
import Agentorders from './pages/agentpages/agentorders';
import Agentprofile from './pages/agentpages/agentprofile';
import Uploadcleintassets from './pages/adminpages/uploadcleintassets';

const ProtectedRoute = ({ user, allowed, children }: { user: any, allowed: "customer" | "agent" | "admin", children: React.ReactNode }) => {
    if (!user) {
        return <Navigate to="/customer/login" />;
    }

    // Agent restriction
    if (user.isagent && allowed !== "agent") {
        return <Navigate to="/agent/home" />;
    }

    // Admin restriction
    if (user.isadmin && allowed !== "admin") {
        return <Navigate to="/admin/orders" />;
    }

    // Customer restriction
    if (!user.isagent && !user.isadmin && allowed !== "customer") {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};


const Approuter = () => {
    const { User, isLoading } = useContext(SteamContext);

    if (isLoading) {
        return <LoadingScreen />;
    }

    console.log(User)
    const IsonlyUser = User?.isadmin || User?.isagent

    console.log(IsonlyUser)
    return (
        <main className="flex-1">
            <Routes>
                {/* Public routes */}
                <Route path="/" element={!IsonlyUser ? <Home /> :
                    <Navigate to={User?.isadmin ? '/admin/orders' : '/agent/home'} />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/select-role" element={<BookingSelection />} />

                {/* Customer Auth Routes */}
                <Route path="/customer/register" element={!User ? <CustomerRegister /> : <Navigate to="/" />} />
                <Route path="/customer/emailotp" element={!User ? <Customeremail /> : <Navigate to="/" />} />
                <Route path="/customer/login" element={!User ? <CustomerLogin /> : <Navigate to="/" />} />

                {/* Customer Protected Routes */}
                <Route path="/customer/book-slot" element={
                    <ProtectedRoute user={User} allowed="customer"><BookSlot /></ProtectedRoute>
                } />
                <Route path="/customer/confirmaddress" element={
                    <ProtectedRoute user={User} allowed="customer"><Confirmaddress /></ProtectedRoute>
                } />
                <Route path="/customer/order-checkout" element={
                    <ProtectedRoute user={User} allowed="customer"><Ordersummary /></ProtectedRoute>
                } />
                <Route path="/customer/ordertrack" element={
                    <ProtectedRoute user={User} allowed="customer"><Trackorder /></ProtectedRoute>
                } />
                <Route path="/customer/profile" element={
                    <ProtectedRoute user={User} allowed="customer"><Userprofile /></ProtectedRoute>
                } />
                <Route path="/customer/profile/edit-profile" element={
                    <ProtectedRoute user={User} allowed="customer"><Customereditprofile /></ProtectedRoute>
                } />

                {/* Agent Public Auth Routes */}
                <Route path="/agent/register" element={<AgentRegister />} />
                <Route path="/agent/login" element={<AgentLogin />} />
                <Route path="/agent/emailotp" element={<Agentemail />} />

                {/* Agent Protected Routes */}
                <Route path="/agent/home" element={
                    <ProtectedRoute user={User} allowed="agent"><Agenthome /></ProtectedRoute>
                } />
                <Route path="/agent/analysis" element={
                    <ProtectedRoute user={User} allowed="agent">
                        <Agentanalysis /></ProtectedRoute>
                } />
                <Route path="/agent/agent-orders" element={
                    <ProtectedRoute user={User} allowed="agent">
                        <Agentorders /></ProtectedRoute>
                } />


                <Route path="/agent/profile" element={
                    <ProtectedRoute user={User} allowed="agent">
                        <Agentprofile /></ProtectedRoute>
                } />
                {/* Admin Protected Routes */}
                <Route path="/admin/orders" element={
                    <ProtectedRoute user={User} allowed="admin"><AdminOrderpage /></ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute user={User} allowed="admin"><Adminuserpage /></ProtectedRoute>
                } />
                <Route path="/admin/agents" element={
                    <ProtectedRoute user={User} allowed="admin"><Adminagentpage /></ProtectedRoute>
                } />
                <Route path="/admin/assign-orders" element={
                    <ProtectedRoute user={User} allowed="admin"><Adminassignoerder /></ProtectedRoute>
                } />
                <Route path="/admin/activate-agents" element={
                    <ProtectedRoute user={User} allowed="admin"><Adminactivateagent /></ProtectedRoute>
                } />
                <Route path="/admin/order-amount" element={
                    <ProtectedRoute user={User} allowed="admin"><Adminorderamount /></ProtectedRoute>
                } />
                <Route path="/admin/upload/clientpageassets" element={
                    <ProtectedRoute user={User} allowed="admin"><Uploadcleintassets /></ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
    );
};

export default Approuter;
