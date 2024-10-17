// import React, { createContext, useContext, useEffect, useReducer } from "react";
// import UsersClient from "../api/user";
// // import { clear, getItem, removeItem, setItem } from "@/utils/AsyncStorage";
// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";

// const StateContext: any = createContext({});

// const initialState = {
//   isAuth:
//     (SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.isAuth) ||
//     false,
//   // userDetails: {...(SecureStore.getItem("user") &&
//   //   JSON.parse(SecureStore.getItem("user") || "")?.userDetails)},
//   userDetails: {
//     _id:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?._id,
//     firstName:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.firstName,
//     lastName:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.lastName,
//     role:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.role,
//     mobileNumber:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.mobileNumber,
//     email:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.email,
//     likedJobs:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.likedJobs,
//     likedEmployees:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails
//         ?.likedEmployees,
//     profile:
//       SecureStore.getItem("user") &&
//       JSON.parse(SecureStore.getItem("user") || "")?.userDetails?.profile,
//   },
//   workDetails: {
//     total: 0,
//     completed: 0,
//     upcoming: 0,
//     cancelled: 0,
//   },
//   serviceDetails: {
//     total: 0,
//     completed: 0,
//     upcoming: 0,
//     cancelled: 0,
//   },
//   earnings: {
//     work: 0,
//     rewards: 0,
//   },
//   spent: {
//     work: 0,
//     tip: 0,
//   },
// };

// const stateReducer = (state: any, action: any) => {
//   switch (action.type) {
//     case "LOGIN":
//       SecureStore.setItem(
//         "user",
//         JSON.stringify({
//           isAuth: true,
//           userDetails: { ...action?.payload },
//         })
//       );
//       return {
//         ...state,
//         isAuth: true,
//         userDetails: { ...action?.payload },
//       };

//     case "LOGOUT":
//       SecureStore.setItem(
//         "user",
//         JSON.stringify({
//           isAuth: false,
//         })
//       );
//       return {
//         ...state,
//         isAuth: false,
//       };

//     // case "REGISTER":
//     //   SecureStore.setItem(
//     //     "user",
//     //     JSON.stringify({
//     //       isAuth: true,
//     //     })
//     //   );
//     //   return {
//     //     ...state,
//     //     isAuth: true,
//     //   };

//     default:
//       return {
//         ...state,
//         userDetails:
//           SecureStore.getItem("user") &&
//           JSON.parse(SecureStore.getItem("user") || "")?.userDetails,
//       };
//   }
// };

// export const StateProvider = ({ children }: any) => {
//   const [state, dispatch] = useReducer(stateReducer, initialState);

//   return (
//     <StateContext.Provider value={{ state, dispatch }}>
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);
