import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

interface Error {
  response?: {
    data?: {
      message: string;
    };
  };
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      name,
      password,
    });
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const sendOtp = async (email: string) => {
  try {
    console.log("email", email);
    const response = await axios.post(`${API_URL}/sendOtp`, { email });
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/verifyOtp`, { email, otp });
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/sendOtp`, { email });
    return response.data;
  } catch (error) {
    return (error as Error).response?.data;
  }
};


export const loginUser = async(email:string,password:string)=>{
    try {
        const response = await axios.post(`${API_URL}/login`, { email ,password});
        return response.data;
        
    } catch (error) {
        return (error as Error).response?.data;
    }
}
