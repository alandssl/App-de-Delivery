import { useState } from 'react';
import { Eye, Clock, CheckCircle, XCircle, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminOrders({ user, onLogout }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock orders data
  const orders = [
    {
      id: 1,
      customer: 'João Silva',
      customerId: 1,
      date: '2024-01-15T14:30:00',
      status: 'ENTREGUE',
      total: 45.50,
      items: ['Pizza Margherita', 'Refrigerante'],
      address: 'Rua das Flores, 123'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      customerId: 2,
      date: '2024-01-14T19:15:00',
      status: 'EM_PREPARO',
      total: 32.00,
      items: ['Hambúrguer', 'Batata Frita'],
      address: 'Av. Paulista, 456'
    },
    {
      id: 3,
      customer: 'Pedro Costa',
      customerId: 3,
      date: '2024-01-13T12:45:00',
      status: 'CRIADO',
      total: 28.90,
      items: ['Salada Caesar', 'Suco Natural'],
      address: 'Rua das Flores, 123'
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      'CRIADO': { label: 'Criado', color: 'text-blue-600', bg: 'bg-blue-100' },
      'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      'EM_PREPARO': { label: 'Em Preparo', color: 'text-orange-600', bg: 'bg-orange-100' },
      'SAIU_PARA_ENTREGA': { label: 'Em Entrega', color: 'text-purple-600', bg: 'bg-purple-100' },
      'ENTREGUE': { label: 'Entregue', color: 'text-green-600', bg: 'bg-green-100' },
      'CANCELADO': { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-100' }
    };
    return statusMap[status] || statusMap['CRIADO'];
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to status ${newStatus}`);
    // For demo purposes, we'll just log it
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Produtos', href: '/admin/products', icon: '📦' },
    { name: 'Pedidos', href: '/admin/orders', icon: '🛒' },
    { name: 'Usuários', href: '/admin/users', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-2xl font-bold text-primary">
                🍕 Delivery Admin
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>

              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-error transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-600"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Orders Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Pedidos</h1>
          <p className="text-secondary">{orders.length} pedidos no total</p>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="CRIADO">Criado</option>
                            <option value="PEDIDO_ACEITO">Aceito</option>
                            <option value="EM_PREPARO">Em Preparo</option>
                            <option value="SAIU_PARA_ENTREGA">Em Entrega</option>
                            <option value="ENTREGUE">Entregue</option>
                            <option value="CANCELADO">Cancelado</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function OrderDetailsModal({ order, onClose }) {
  const statusInfo = getStatusInfo(order.status);

  function getStatusInfo(status) {
    const statusMap = {
      'CRIADO': { label: 'Criado', color: 'text-blue-600', progress: 20 },
      'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-yellow-600', progress: 40 },
      'EM_PREPARO': { label: 'Em Preparo', color: 'text-orange-600', progress: 60 },
      'SAIU_PARA_ENTREGA': { label: 'Em Entrega', color: 'text-purple-600', progress: 80 },
      'ENTREGUE': { label: 'Entregue', color: 'text-green-600', progress: 100 },
      'CANCELADO': { label: 'Cancelado', color: 'text-red-600', progress: 0 }
    };
    return statusMap[status] || statusMap['CRIADO'];
  }

  const currentStatus = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Pedido #{order.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Progress */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Status do Pedido</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{currentStatus.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentStatus.progress}%` }}
                ></div>
              </div>
              <p className={`text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
              <p className="text-secondary text-sm">{order.customer}</p>
              <p className="text-secondary text-sm">ID: {order.customerId}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data do Pedido</h4>
              <p className="text-secondary text-sm">
                {new Date(order.date).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-secondary">{item}</span>
                  <span className="text-sm text-gray-500">1x</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-primary">R$ {order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h4>
            <p className="text-secondary text-sm">{order.address}</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}