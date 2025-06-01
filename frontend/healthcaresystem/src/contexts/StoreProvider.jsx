import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { getInfo } from "../services/AuthService";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
     const [userInfo, setUserInfo] = useState(null);
     const email = Cookies.get('email');
     const userId = Cookies.get('userid');

     useEffect(() => {
          if (userId) {
               getInfo(userId)
                    .then((res) => {
                         setUserInfo(res.data.data)
                         console.log(res);
                    })
                    .catch((err) => {
                         console.log(err);
                    });
          }
     }, [userId]);

     const value = {
          userInfo,
          setUserInfo,
          email
     };

     return (
          <StoreContext.Provider value={value}>
               {children}
          </StoreContext.Provider>
     );
};