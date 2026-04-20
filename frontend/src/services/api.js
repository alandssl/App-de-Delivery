import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProducts = async () => {
  const response = await api.get('/produtos');
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post('/produtos', product);
  return response.data;
};

export const updateProduct = async (product) => {
  const response = await api.put('/produtos', product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/produtos/${id}`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('/pedidos', order);
  return response.data;
};

export const savePayment = async (payment) => {
  const response = await api.post('/api/pagamento/salvar', payment);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/api/usuario');
  return response.data;
};

export default api;