import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const BoardService = {
    getAll: () => api.get('/boards'),
    create: (data) => api.post('/boards', data),
    get: (id) => api.get(`/boards/${id}`),
    update: (id, data) => api.patch(`/boards/${id}`, data),
    delete: (id) => api.delete(`/boards/${id}`),
};

export const ListService = {
    getAll: () => api.get('/lists'),
    create: (data) => api.post('/lists', data),
    get: (id) => api.get(`/lists/${id}`),
    update: (id, data) => api.patch(`/lists/${id}`, data),
    delete: (id) => api.delete(`/lists/${id}`),
};

export const CardService = {
    getAll: () => api.get('/cards'),
    create: (data) => api.post('/cards', data),
    get: (id) => api.get(`/cards/${id}`),
    update: (id, data) => api.patch(`/cards/${id}`, data),
    delete: (id) => api.delete(`/cards/${id}`),
    move: (id, data) => api.patch(`/cards/${id}/move`, data),
    attachTag: (id, data) => api.post(`/cards/${id}/tags`, data),
    detachTag: (id, data) => api.delete(`/cards/${id}/tags`, data),
    assignMember: (id, data) => api.post(`/cards/${id}/members`, data),
    unassignMember: (id, data) => api.delete(`/cards/${id}/members`, data),
};

export const TagService = {
    getAll: () => api.get('/tags'),
    create: (data) => api.post('/tags', data),
    get: (id) => api.get(`/tags/${id}`),
    update: (id, data) => api.patch(`/tags/${id}`, data),
    delete: (id) => api.delete(`/tags/${id}`),
};

export const MemberService = {
    getAll: () => api.get('/members'),
    create: (data) => api.post('/members', data),
    get: (id) => api.get(`/members/${id}`),
    update: (id, data) => api.patch(`/members/${id}`, data),
    delete: (id) => api.delete(`/members/${id}`),
};
