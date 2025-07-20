import axios from "axios";

const token=localStorage.getItem('token');
export const axiosWithToken=axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers:{Authorization:`Bearer ${token}`}
});