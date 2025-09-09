import axios from 'axios';

const API = axios.create({
  baseURL: window.location.hostname === 'localhost' 
           ? 'http://localhost:3000'
           : 'https://salesforceapi.rigel.co.tz',
  withCredentials: true,
});

export const getUsers = () => API.get('/user/user');
export const getUser = (id) => API.get(`/user/user/${id}`);
export const createUser = (data) => API.post('/user/user', data);
export const updateUser = (id, data) => API.put(`/user/user/${id}`, data);
export const deleteUser = (id) => API.delete(`/user/user/${id}`);

export const getDepartments = () => API.get('/department/department');
export const getDepartment = (id) => API.get(`/department/department/${id}`);
export const createDepartment = (data) => API.post('/department/department', data);
export const updateDepartment = (id, data) => API.put(`/department/department/${id}`, data);
export const deleteDepartment = (id) => API.delete(`/department/department/${id}`);

export const getRoles = () => API.get('/user/role');
export const getRole = (id) => API.get(`/user/role/${id}`);
export const createRole = (data) => API.post('/user/role', data);
export const updateRole = (id, data) => API.put(`/user/role/${id}`, data);
export const deleteRole = (id) => API.delete(`/user/role/${id}`);

export const createPermission = (data) => API.post('/user/permission', data);
export const getPermissionsByRole = (id) => API.get(`/user/permission/${id}`);
export const assignPermission = (id, permissionIds) => API.post(`/user/role/${id}/permission`, { permission_ids: permissionIds });
export const getAllPermissions = () => API.get('/user/permission');

export const login = (data) => API.post('/user/login', data);

export const checkIn = (agentId) => API.post('/tracking/checkin', { agentId });
export const checkOut = (agentId) => API.post('/tracking/checkout', { agentId });
export const addLocation = (agentId, lat, lng) =>
  API.post('/tracking/location', { agentId, lat, lng });
export const getAgentRoute = (agentId) => API.get(`/tracking/location/${agentId}`);
export const getLastLocation = (agentId) => API.get(`/tracking/location/${agentId}/last`);
export const isCheckedIn = (agentId) => API.get(`/tracking/checkin-status/${agentId}`);
export const getAgentsByStatus = () => API.get(`/tracking/agents/status`);

export default API;
