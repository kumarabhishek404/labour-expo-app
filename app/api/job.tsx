import axios from "axios";

const baseURL = "http://localhost:4000/api/v1";
const baseUrl = "https://reqres.in";

export const GetAllJob = async () => {
  try {
    const response = await axios.get("https://reqres.in/api/users/1", {
      headers: {
        // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ2YjY4MDkwMWI5ZDgzODQwMDYwOGUiLCJpYXQiOjE3MjUzNzcxMjIsImV4cCI6MTcyNTM4MDcyMn0.9IbBjWeBlEh9d28Rt5gKganJfgDhj9rdIZUmQRFVZc8`,
        'Content-Type': 'application/json'
      },
    });
    return response;
  } catch (err) {
    console.log("Error while login", err);
  }
};
