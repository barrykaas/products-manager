import axios from 'axios';
import apiPath from '../Api/ApiPath';

export const getEventFn = async (id) => {
    const response = await axios.get(`${apiPath}/events/${id}/`);
    return response.data;
};