import axios from "axios";


const apiPath = import.meta.env.VITE_KAAS_API_URL;

const ax = axios.create({
    baseURL: apiPath
});

export const kaasproducten = ax;
