import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => axios.get(baseUrl);

const create = (data) => axios.post(baseUrl, data);

const update = (id, data) => axios.put(`${baseUrl}/${id}`, data);

const deleteRecord = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, update, deleteRecord };
