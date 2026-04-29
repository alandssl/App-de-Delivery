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

export const rateProduct = async (id, avaliacao) => {
  const response = await api.put(`/produtos/avaliacao/${id}`, { avaliacao });
  return response.data;
};

export const uploadProductImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append('imagem', imageFile);
  const response = await api.post(`/produtos/imagem/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('/pedidos', order);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('/pedidos');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/pedidos/${id}/status`, `"${status}"`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const markOrderAsRated = async (id) => {
  const response = await api.patch(`/pedidos/${id}/avaliar`);
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

export const createUser = async (user) => {
  const response = await api.post('/api/usuario', user);
  return response.data;
};

export const updateUserInfo = async (id, user) => {
  const response = await api.put(`/api/usuario/${id}`, user);
  return response.data;
};

export const fetchAddresses = async (clienteId) => {
  const response = await api.get(`/enderecos/cliente/${clienteId}`);
  return response.data;
};

export const createAddress = async (address) => {
  const response = await api.post('/enderecos', address);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/enderecos/${id}`);
  return response.data;
};

export const updateAddress = async (id, address) => {
  const response = await api.put(`/enderecos/${id}`, address);
  return response.data;
};

export const setPrincipalAddress = async (id, usuarioId) => {
  const response = await api.put(`/enderecos/${id}/principal/${usuarioId}`);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/usuario/login', credentials);
  return response.data;
};

export const fetchCards = async (usuarioId) => {
  const response = await api.get(`/api/cartoes/usuario/${usuarioId}`);
  return response.data;
};

export const createCard = async (usuarioId, card) => {
  const response = await api.post(`/api/cartoes/usuario/${usuarioId}`, card);
  return response.data;
};

export const deleteCard = async (usuarioId, cartaoId) => {
  const response = await api.delete(`/api/cartoes/${cartaoId}/usuario/${usuarioId}`);
  return response.data;
};

export const setPrimaryCard = async (usuarioId, cartaoId) => {
  const response = await api.put(`/api/cartoes/${cartaoId}/usuario/${usuarioId}/tornar-padrao`);
  return response.data;
};

export const updateCard = async (usuarioId, cartaoId, card) => {
  const response = await api.put(`/api/cartoes/${cartaoId}/usuario/${usuarioId}`, card);
  return response.data;
};

export default api;