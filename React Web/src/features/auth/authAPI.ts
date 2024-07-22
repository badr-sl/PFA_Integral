import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface LoginData {
  email: string;
  password: string;
}

const getErrorMessage = (error: any) => {
  if (error.response) {
  
    return `Error: ${error.response.status} - ${error.response.statusText}\n${JSON.stringify(error.response.data, null, 2)}`;
  } else if (error.request) {
    
    return `Error: No response received\n${error.request}`;
  } else {

    return `Error: ${error.message}`;
  }
};

export const register = async (userData: RegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error));
  }
};

export const login = async (credentials: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error));
  }
};
