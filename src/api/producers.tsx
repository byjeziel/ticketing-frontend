import axios from "axios";
import type { Producer } from "../types/Producer";

const API_URL = "http://localhost:3000/producers";

export const getProducers = () => axios.get<Producer[]>(API_URL);
export const getProducerById = (id: string) => axios.get<Producer>(`${API_URL}/${id}`);
export const createProducer = (data: Producer) => axios.post<Producer>(API_URL, data);
export const updateProducer = (id: string, data: Producer) => axios.patch<Producer>(`${API_URL}/${id}`, data);
export const deleteProducer = (id: string) => axios.delete(`${API_URL}/${id}`);