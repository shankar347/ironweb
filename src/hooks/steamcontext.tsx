import React, { createContext, useState, ReactNode, useEffect } from "react";
import { toast } from "../components/ui/use-toast";
import { API_URL } from "./tools";


export const SteamContext = createContext<any>(null)


interface Props {
    children: ReactNode
}

const ContexProvider = ({ children }: Props) => {


    let [formData, setFormData] = useState({
        name: '',
        phoneno: '',
        // password: '',
        // email: '',
        streetname: '',
        houseno: '',
        city: '',
        pincode: ''
    });
    const [isLoading, setIsLoading] = useState(true)
    const [orderdetails, setorderdetails] = useState(() => {
        const stored = localStorage.getItem('orderdetails');
        return stored ? JSON.parse(stored) : { userdetails: {}, otherdetails: {} };
    });

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_URL}/user/profile`, {
                    credentials: 'include',
                })
                const data = await res.json()
                if (!data?.error) setUser(data?.data)
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchUser()


    }, [])

    type Orderdetails = typeof orderdetails
    useEffect(() => {

        const storedOrderDetails = localStorage.getItem('orderdetails');
        const parsedOrderDetails: Orderdetails = storedOrderDetails
            && JSON.parse(storedOrderDetails)

        setorderdetails(parsedOrderDetails)
    }, [])

    useEffect(() => {
        localStorage.setItem('orderdetails', JSON.stringify(orderdetails));
    }, [orderdetails]);

    const [User, setUser] = useState(null)


    // console.log(User, 'hi')
    return <SteamContext.Provider value={{
        formData,
        orderdetails, setorderdetails,
        isLoading, setFormData, User, setUser
    }}>
        {children}
    </SteamContext.Provider>

}

export default ContexProvider