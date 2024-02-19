import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
export const AuthContext = createContext();
//instead of pass the curren logged user to each component (tree of componenent) we use context api
//we create context provider to provide all components with the loggedd user in one time so we don't have to pass to each one seperately in the props 
//we just put these component inside the context provider
export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            setCurrentUser(user);
        });
        return () =>{
            unsub();//when using a real time function we ust use this approach (cleanup function) to preventmemory leaks
        }
    }, []);
//so here we pass the value of logged user to all components wrapped in the context provider tag
    return(
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )         

}//the currentuser will be passed to all components inside context.provider