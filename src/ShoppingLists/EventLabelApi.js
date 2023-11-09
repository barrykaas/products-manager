import axios from 'axios';

export const getEventFn = async (id) => {
    const response = await axios.get(`https://django.producten.kaas/api/events/${id}/`);
    return response.data;
};