// import { toast } from 'react-toastify';
// import ApiClient from './ApiClient';

import axios from "axios";
import ApiClient from ".";

export default class UsersClient {
  private apiClient: ApiClient;
  state: { userDetails: any };
  userDetails: any;

  constructor() {
    this.apiClient = new ApiClient();
    this.state = {
      userDetails: '',
    };
  }

  async fetchUsers(payload: any) {
    try {
      const data = await this.apiClient.makePostRequest('/users/all', payload);
      return data.data;
    } catch (error: any) {
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching users',
    //   );
      throw error;
    }
  }

  async createUser(payload: any) {
    try {
      console.log(
        `[SignUp] [userService] Creating the new user with API /users/add and payload : `,
        payload,
      );
      const data = await this.apiClient.makePostRequest('/users/add', payload);
      console.log(
        `[SignUp] [userService] User created successfully with response : `,
        data?.data,
      );
      return data.data;
    } catch (error: any) {
      console.log(
        `[SignUp] [userService] An error occurred while adding new user : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message || 'An error occurred while adding user',
    //   );
      throw error;
    }
  }

  async resetPassword(payload: any) {
    try {
      const data = await this.apiClient.makePostRequest(
        `/users/new-password`,
        payload,
      );
    //   toast.success('Password Reset successfully');
      return data.data;
    } catch (error: any) {
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while creating password',
    //   );
      throw error;
    }
  }

  async forgotPassword(payload: any) {
    try {
      const data = await this.apiClient.makePostRequest(
        `/users/reset-password`,
        payload,
      );
      //toast.success('Password Reset successfully');
      return data.data;
    } catch (error: any) {
      console.log(
        `[Forget Password] [userService] An error occured while resetting the password : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while creating password',
    //   );
      throw error;
    }
  }

  async signIn(payload: any) {
    console.log("Payloadddd---", payload);
    try {
      console.log(
        `[Sign In] [userService] Signing in the user with API /auth/login and payload `,
        payload,
      );
      const data = await this.apiClient.makePostRequest('/auth/login', payload);
      console.log(
        `[Sign In] [userService] User signed in with the response `,
        data.data,
      );
      return data.data;
    } catch (error: any) {
      console.log(
        `[Sign In] [userService] An error occurred while signing the user `,
        error?.response?.data?.message,
      );
    //   toast.error(
    //     error?.response?.data?.message || 'An error occurred while login user',
    //   );
      throw error;
    }
  }

  async getUserById(id: any) {
    try {
      const { data } = await this.apiClient.makeGetRequest(
        `/users/${id}/details`,
      );
      return data;
    } catch (error: any) {
      console.error(
        `[Users] [userService] An error occurred while fetching user details : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while getting user by id',
    //   );
      throw error;
    }
  }

  async updateUserById(payload: any, id: any) {
    try {
      const data = await this.apiClient.makePutRequest(
        `/users/${id}/edit`,
        payload,
      );
    //   toast.success('User updated successfully');
      return data.data;
    } catch (error: any) {
      console.error(
        `[userService] An error occurred while updating user : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while updating user',
    //   );
      throw error;
    }
  }

  async addNewUser(payload: any) {
    try {
      const data = await this.apiClient.makePostRequest('/auth/register', payload);
    //   toast.success('User added successfully');
      return data.data;
    } catch (error: any) {
      console.error(
        `[userService] An error occurred while adding new user : `,
        error?.response?.data?.message,
      );
    //   toast.error(
    //     error?.response?.data?.message || 'An error occurred while adding user',
    //   );
      throw error;
    }
  }

  async deleteUserById(id: any) {
    try {
      const data = await this.apiClient.makeDeleteRequest(
        `/users/${id}/delete`,
      );
    //   toast.success('User deleted successfully');
      return data.data;
    } catch (error: any) {
      console.error(
        `[Users] [userService] An error occurred while deleting user : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while deleting user',
    //   );
      throw error;
    }
  }

  async uploadFile(file: any, screen: string) {
    console.log(
      `[${screen}] [userService] Uploading file with API /upload/file and file payload  : `,
      file,
    );
    try {
      const data = await this.apiClient.makePostRequest('/upload/file', file);
    //   toast.success('File uploaded successfully');
      console.log(
        `[${screen}] [userService] File uploaded successfully with file location : `,
        data?.data?.Location,
      );
      return data.data;
    } catch (error: any) {
      console.error(
        `[${screen}] [userService] An error occurred while uploading file : `,
        error,
      );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while uploading file',
    //   );
      throw error;
    }
  }
}
