import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { getInfo } from "../services/api";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
     const [userInfo, setUserInfo] = useState(null);
     const email = Cookies.get('email');
     const userId = Cookies.get('userId');

     useEffect(() => {
          if (userId) {
               getInfo(userId)
                    .then((res) => {
                         setUserInfo(res.data)
                         console.log(res.data)
                    })
                    .catch((err) => {
                         console.log(err);
                    });
          }
     }, [userId]);

     const value = {
          userInfo,
          setUserInfo,
          email,
     };

     return (
          <StoreContext.Provider value={value}>
               {children}
          </StoreContext.Provider>
     );
};