
import React, { useContext } from 'react'

import Approuter from './Approuter'
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/sidebar';
import ScrollToTop from './hooks/scrolltotop';
import { SteamContext } from './hooks/steamcontext'

const Appsrcpages = () => {
    const { User } = useContext(SteamContext);
    const isAdmin = User?.isadmin ?? false;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex w-full flex-1">
                {isAdmin && <Sidebar />}
                <div className="flex-1">
                    <ScrollToTop />
                    <Approuter />
                </div>
            </div>
            {!isAdmin && <Footer />}
        </div>
    )
}

export default Appsrcpages
