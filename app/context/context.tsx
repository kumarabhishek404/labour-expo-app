import React, { createContext, useContext, useReducer } from "react";
import UsersClient from "../api/user";
import { clear, getItem, removeItem, setItem } from "@/utils/AsyncStorage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const StateContext: any = createContext({});

const initialState = {
  isAuth: SecureStore.getItem("user") && JSON.parse(SecureStore.getItem("user") || "")?.isAuth || false,
  userType: "guest",
  mobile: "12345",
  email: "",
  password: "123",
};

const stateReducer = (state: any, action: any) => {

  switch (action.type) {
    case "LOGIN":
      SecureStore.setItem(
        "user",
        JSON.stringify({
          isAuth: true,
        })
      );
      return {
        ...state,
        isAuth: true,
      };

    case "LOGOUT":
      SecureStore.setItem(
        "user",
        JSON.stringify({
          isAuth: false,
        })
      );
      return {
        ...state,
        isAuth: false,
      };

    // case "REGISTER":
    //   SecureStore.setItem(
    //     "user",
    //     JSON.stringify({
    //       isAuth: true,
    //     })
    //   );
    //   return {
    //     ...state,
    //     isAuth: true,
    //   };

    default:
      return state;
  }
};

export const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
