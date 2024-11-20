import axios from "axios";


const apiPath = 'http://api.producten.kaas/v2'

const ax = axios.create({
    baseURL: apiPath
});

export const kaasproducten = ax;
