import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Orders({ user, onLogout }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Mock orders data
  const orders = [
    {
      id: 1,
      date: '2024-01-15T14:30:00',
      status: 'ENTREGUE',
      total: 45.50,
      items: ['Pizza Margherita', 'Refrigerante'],
      address: 'Rua das Flores, 123',
      deliveryType: 'Entrega rápida',
      paymentMethod: 'Cartão de crédito'
    },
    {
      id: 2,
      date: '2024-01-14T19:15:00',
      status: 'EM_PREPARO',
      total: 32.00,
      items: ['Hambúrguer', 'Batata Frita'],
      address: 'Av. Paulista, 456',
      deliveryType: 'Retirada',
      paymentMethod: 'Dinheiro'
    },
    {
      id: 3,
      date: '2024-01-13T12:45:00',
      status: 'CRIADO',
      total: 28.90,
      items: ['Salada Caesar', 'Suco Natural'],
      address: 'Rua das Flores, 123',
      deliveryType: 'Entrega',
      paymentMethod: 'Pix'
    }
  ];

  const getStatusInfo = (status) => {
    const statusMap = {
      'CRIADO': { label: 'Criado', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock },
      'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
      'EM_PREPARO': { label: 'Em Preparo', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: Clock },
      'SAIU_PARA_ENTREGA': { label: 'Em Entrega', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Clock },
      'ENTREGUE': { label: 'Entregue', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
      'CANCELADO': { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle }
    };
    return statusMap[status] || statusMap['CRIADO'];
  };

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/products' },
    { name: 'Carrinho', href: '/cart' },
    { name: 'Pedidos', href: '/orders' },
    { name: 'Perfil', href: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-purple-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-colors">
                🍕 Delivery
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-white font-semibold'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">{user?.name}</span>
              </div>

              <button
                onClick={onLogout}
                className="text-white hover:text-red-300 transition-colors"
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
            <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4">
              <nav className="flex flex-col gap-4 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary font-semibold'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Meus Pedidos
          </h1>
          <p className="text-gray-600 text-lg">Acompanhe o status dos seus pedidos</p>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/20 transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-secondary text-sm">
                      {new Date(order.date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Itens</h4>
                    <ul className="text-sm text-secondary space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Entrega</h4>
                    <p className="text-sm text-secondary">{order.address}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-primary">
                    Total: R$ {order.total.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="w-full md:w-auto bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalhes do pedido
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
            <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium inline-block">
              Fazer Primeiro Pedido
            </Link>
          </div>
        )}
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
  const statusInfo = {
    'CRIADO': { label: 'Criado', color: 'text-blue-600', progress: 20 },
    'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-yellow-600', progress: 40 },
    'EM_PREPARO': { label: 'Em Preparo', color: 'text-orange-600', progress: 60 },
    'SAIU_PARA_ENTREGA': { label: 'Em Entrega', color: 'text-purple-600', progress: 80 },
    'ENTREGUE': { label: 'Entregue', color: 'text-green-600', progress: 100 },
    'CANCELADO': { label: 'Cancelado', color: 'text-red-600', progress: 0 }
  };

  const currentStatus = statusInfo[order.status] || statusInfo['CRIADO'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalhes completos do Pedido #{order.id}</h2>
              <p className="text-sm text-gray-500 mt-1">Veja todas as informações do seu pedido</p>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data do Pedido</h4>
              <p className="text-secondary text-sm">
                {new Date(order.date).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Total</h4>
              <p className="text-primary font-semibold">
                R$ {order.total.toFixed(2)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pagamento</h4>
              <p className="text-secondary text-sm">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tipo de Entrega</h4>
              <p className="text-secondary text-sm mb-4">{order.deliveryType}</p>
              <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h4>
              <p className="text-secondary text-sm">{order.address}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-primary text-white w-full py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}