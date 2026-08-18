import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getJobs = async (params = {}) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const runIngestionPipeline = async () => {
  const response = await api.post('/ingestion/run');
  return response.data;
};

export const getIngestionStatus = async () => {
  const response = await api.get('/ingestion/status');
  return response.data;
};

export const getSystemHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
