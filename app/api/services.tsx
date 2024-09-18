// // import { toast } from 'react-toastify';
// // import ApiClient from './ApiClient';

import { makeGetRequest, makePostRequest, makePostRequestFormData } from ".";
import { showToast } from "../hooks/toast";

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

export const addNewService = async (payload: any) => {
  console.log("Payload inside api - ", payload);

  try {
    const data = await makePostRequestFormData("/service/add", payload);
    //   toast.success('User added successfully');
    return data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding new service : `,
      error?.response?.data
    );
    //   toast.error(
    //     error?.response?.data?.message || 'An error occurred while adding service',
    //   );
    throw error;
  }
};

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

export const getServiceById = async (id: any) => {
  showToast("success", "Service Details screen")
  try {
    const { data } = await makeGetRequest(`/service/service-info/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching service details : `,
      error
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while getting service by id',
    //   );
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

export const fetchAllServices = async () => {
  try {
    const data = await makeGetRequest("/service/all");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};

export const fetchAllLikedServices = async () => {
  try {
    const data = await makeGetRequest("/service/liked-services");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};

export const likeService = async (payload: any) => {
  try {
    const data = await makePostRequest("/service/like-service", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking service : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};

export const unLikeService = async (payload: any) => {
  try {
    const data = await makePostRequest("/service/unlike-service", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking service : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};

export const applyService = async (payload: any) => {
  try {
    const data = await makePostRequest("/service/apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while applying in service : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};

export const fetchMyServices = async () => {
  try {
    const data = await makeGetRequest("/service/my-services");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my services : `,
      error?.response?.data?.message
    );
    //   toast.error(
    //     error?.response?.data?.message ||
    //       'An error occurred while fetching services',
    //   );
    throw error;
  }
};
