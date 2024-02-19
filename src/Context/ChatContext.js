import {
    createContext,
    useContext,
    useReducer,
  } from "react";
import { AuthContext } from "./AuthContext";
export const ChatContext = createContext();
//instead of pass the curren logged user to each component (tree of componenent) we use context api
//we create context provider to provide all components with the loggedd user in one time so we don't have to pass to each one seperately in the props 
//we just put these component inside the context provider
export const ChatContextProvider = ({children}) => {
    const {currentUser} = useContext(AuthContext)   
    const INITIAL_STATE = {
        chatId:"null",
        user:{}
    }
    const chatReducer = (state, action) => {
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                        ? currentUser.uid + action.payload.uid
                        : action.payload.uid + currentUser.uid
                };
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
//so here we pass the value of logged user to all components wrapped in the context provider tag
//here we pass in the context Provider the dipatch function andthe state
    return(
        <ChatContext.Provider value={{data: state, dispatch}}> 
            {children}
        </ChatContext.Provider>
    )         

}//the currentuser will be passed to all components inside context.provider