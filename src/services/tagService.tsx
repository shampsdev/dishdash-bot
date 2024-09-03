import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface Tag {
    id?: number;
    name: string;
    url: string;
}

export const getTags = async (): Promise<Tag[]> => {
    const response = await axios.get(`${API_BASE_URL}/tags`);
    return response.data;
};

export const getTagById = async (id: number): Promise<Tag> => {
    const response = await axios.get(`${API_BASE_URL}/tags/${id}`);
    return response.data;
};

export const createTag = async (tag: Tag): Promise<Tag> => {
    const response = await axios.post(`${API_BASE_URL}/tags`, tag);
    return response.data;
};

export const updateTag = async (id: number, tag: Tag): Promise<Tag> => {
    const response = await axios.put(`${API_BASE_URL}/tags/${id}`, tag);
    return response.data;
};

export const deleteTag = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/tags/${id}`);
};
