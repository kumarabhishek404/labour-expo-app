// // import { toast } from 'react-toastify';
// // import ApiClient from './ApiClient';

import { makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

// import axios from "axios";
// import ApiClient from ".";

// export default class ServicesClient {
//   private apiClient: ApiClient;
//   state: { serviceDetails: any };
//   serviceDetails: any;

//   constructor() {
//     // this.apiClient = new ApiClient();
//     this.state = {
//       serviceDetails: '',
//     };
//   }

//   async addNewService(payload: any) {
//     try {
//       const data = await this.apiClient.makePostRequest('/employer/add-job', payload);
//     //   toast.success('User added successfully');
//       return data.data;
//     } catch (error: any) {
//       console.error(
//         `[userService] An error occurred while adding new service : `,
//         error?.response?.data?.message,
//       );
//     //   toast.error(
//     //     error?.response?.data?.message || 'An error occurred while adding service',
//     //   );
//       throw error;
//     }
//   }

//   async fetchAllServices() {
//     try {
//       const data = await this.apiClient.makeGetRequest('/job/all');
//       return data.data;
//     } catch (error: any) {
//         console.error(
//             `[userService] An error occurred while fetching services : `,
//             error?.response?.data?.message,
//           );
//     //   toast.error(
//     //     error?.response?.data?.message ||
//     //       'An error occurred while fetching services',
//     //   );
//       throw error;
//     }
//   }

export const getEmployerById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/employer/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching employer details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting employer by id"
    );
    throw error;
  }
};

//   async updateServiceById(payload: any, id: any) {
//     try {
//       const data = await this.apiClient.makePutRequest(
//         `/services/${id}/edit`,
//         payload,
//       );
//     //   toast.success('User updated successfully');
//       return data.data;
//     } catch (error: any) {
//       console.error(
//         `[userService] An error occurred while updating service : `,
//         error,
//       );
//     //   toast.error(
//     //     error?.response?.data?.message ||
//     //       'An error occurred while updating service',
//     //   );
//       throw error;
//     }
//   }

//   async deleteServiceById(id: any) {
//     try {
//       const data = await this.apiClient.makeDeleteRequest(
//         `/services/${id}/delete`,
//       );
//     //   toast.success('User deleted successfully');
//       return data.data;
//     } catch (error: any) {
//       console.error(
//         `[Users] [userService] An error occurred while deleting service : `,
//         error,
//       );
//     //   toast.error(
//     //     error?.response?.data?.message ||
//     //       'An error occurred while deleting service',
//     //   );
//       throw error;
//     }
//   }

//   async uploadFile(file: any, screen: string) {
//     console.log(
//       `[${screen}] [userService] Uploading file with API /upload/file and file payload  : `,
//       file,
//     );
//     try {
//       const data = await this.apiClient.makePostRequest('/upload/file', file);
//     //   toast.success('File uploaded successfully');
//       console.log(
//         `[${screen}] [userService] File uploaded successfully with file location : `,
//         data?.data?.Location,
//       );
//       return data.data;
//     } catch (error: any) {
//       console.error(
//         `[${screen}] [userService] An error occurred while uploading file : `,
//         error,
//       );
//     //   toast.error(
//     //     error?.response?.data?.message ||
//     //       'An error occurred while uploading file',
//     //   );
//       throw error;
//     }
//   }
// }

export const fetchAllEmployers = async () => {
  try {
    const data = await makeGetRequest("/employer/all");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching employers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};

export const fetchAllLikedEmployer = async () => {
  try {
    const data = await makeGetRequest("/employer/all-bookmarks-employer");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked employers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};

export const likeEmployer = async (payload: any) => {
  try {
    const data = await makePostRequest("/employer/bookmark-employer", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking employer : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};

export const unlikeEmployer = async (payload: any) => {
  try {
    const data = await makePostRequest("/employer/unbookmark-employer", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking employer : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};
