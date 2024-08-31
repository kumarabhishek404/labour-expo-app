import React, { createContext, useContext, useReducer } from "react";

const StateContext: any = createContext({});

const initialState = {
  isAuth: false,
  userType: "guest",
  mobile: "12345",
  email: "",
  password: "123",
};

const stateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      // if (
      //   state.mobile === action?.payload?.mobile &&
      //   state.password === action?.payload?.password
      // ) {
        return {
          ...state,
          isAuth: true
        };
      // } else {
      //   return {
      //     ...state,
      //     isAuth: false
      //   };
      // }
    case "LOGOUT":
      if (state.isAuth) {
        return {
          ...state,
          isAuth: false,
          userType: "guest",
          mobile: "",
          email: "",
          password: "",
        };
      }

    case "REGISTER":
      return {
        ...state,
        userType: action.role,
        mobile: action.mobile,
        email: action.email,
        password: action.password,
      };

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
