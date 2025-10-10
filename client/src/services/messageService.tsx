import axiosWithAuth from "../utils/axiosWithAuth";
import type { message } from "../utils/types";

export const getMessage = async (id: string) => {
    const { data } = await axiosWithAuth.get(`/messages/${id}`);
    return data;
}

export const getMessagesByChannel = async (channelId:string) => {
    const { data } = await axiosWithAuth.get(`/messages/channel/${channelId}`);
    return data;
}

export const createMessage = async (message: message) => {
    const { data } = await axiosWithAuth.post('/messages', message);
    return data;
}

export const updateMessage = async (id: string, message: any) => {
    const { data } = await axiosWithAuth.put(`/messages/${id}`, message);
    return data;
}

export const deleteMessage = async (id: string) => {
    const { data } = await axiosWithAuth.delete(`/messages/${id}`);
    return data;
}