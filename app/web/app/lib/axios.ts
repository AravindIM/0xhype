import axios from 'axios';

export const apiClient = axios.create({ timeout: 3000, withCredentials: true });
