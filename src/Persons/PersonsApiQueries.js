import axios from "axios";

import apiPath from "../Api/ApiPath";


export const getPersonsFn = async () => {
    return axios.get(`${apiPath}/persons/`);
};
