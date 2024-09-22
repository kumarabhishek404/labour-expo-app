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

export const getWorkerById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/worker/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching worker details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting service by id"
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

export const fetchAllWorkers = async () => {
  try {
    const data = await makeGetRequest("/worker/all");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const fetchAllLikedWorkers = async () => {
  try {
    const data = await makeGetRequest("/worker/my-bookmarks");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const likeWorker = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/add-bookmark", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const unlikeWorker = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/remove-bookmark", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};
