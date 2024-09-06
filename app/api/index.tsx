import { getItem } from '@/utils/AsyncStorage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.getBaseUrl(),
      headers: this.getTokenHeader(),
    });

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          if (
            (error?.response?.data?.statusCode === 401 &&
              error?.response?.data?.message === 'TokenExpiredError') ||
            error?.response?.data?.errorCode === 'TokenExpiredError'
          ) {
            // const myValue = localStorage.getItem('user') ?? '';
            // let parseValue = JSON.parse(myValue);
            // parseValue.token = null;
            // localStorage.setItem('user', JSON.stringify(parseValue));
            window.location.href = '/auth/login';
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request error:', error.message);
        }
        throw error;
      },
    );
  }

  getBaseUrl(): string {
    return 'https://labour-app-backend.onrender.com/api/v1';
  }

  getTokenHeader(): any {
    const myValue: any = '';
    if (myValue) {
      const parseValue = JSON.parse(myValue);
      if (parseValue?.token)
        return { Authorization: `Bearer ${parseValue?.token}` };
    }
    return {Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmQ2YjY4MDkwMWI5ZDgzODQwMDYwOGUiLCJpYXQiOjE3MjU1NDc3OTIsImV4cCI6MTcyNTU1MTM5Mn0.ePuD9lNrKWMeqDsCvaVFk1DLVQBWdy0EZzIHYjEnSSc`}
  }

  async makeGetRequest(
    url: string,
    headers?: { [key: string]: string },
    responseType?:
      | 'arraybuffer'
      | 'blob'
      | 'document'
      | 'json'
      | 'text'
      | 'stream',
  ) {
    const response = await this.api.get(url, {
      headers: headers,
      responseType: responseType || 'json',
    });
    return response;
  }

  async makePostRequest(
    url: string,
    body: object,
    headers?: { [key: string]: string }
  ) {
    console.log("Inside make post request - ", url, body, headers);
    
    const response = await this.api.post(url, body, {
      headers: headers ?? {},
    });
    return response;
  }

  async makePutRequest(
    url: string,
    body: object,
    headers?: { [key: string]: string },
  ) {
    const response = await this.api.put(url, body, {
      headers: headers ?? {},
    });
    return response;
  }

  async makeDeleteRequest(url: string, headers?: { [key: string]: string }) {
    const response = await this.api.delete(url, {
      headers: headers,
    });
    return response;
  }
}
