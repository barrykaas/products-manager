import axios from "axios";

import apiPath from "./ApiPath";


const ax = axios.create({
    baseURL: apiPath
});

export default ax;
