import axios from "axios";

const API_URL = "http://localhost:3000/events";

const authHeader = (token?: string) => token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

export const getEvents = () => axios.get<Event[]>(API_URL);
export const getEventById = (id: string) => axios.get<Event>(`${API_URL}/${id}`);
export const createEvent = (data: Event) => axios.post<Event>(API_URL, data);
export const updateEvent = (id: string, data: Event, token?: string) => axios.put<Event>(`${API_URL}/${id}`, data, authHeader(token));
export const deleteEvent = (id: string, token?: string) => axios.delete(`${API_URL}/${id}`, authHeader(token));
