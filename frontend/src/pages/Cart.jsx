import { useState } from 'react';
import { ShoppingCart, CreditCard, MapPin, User, Menu, X, LogOut, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Cart({ user, onLogout }) {
  const { cart, updateQuantity, removeItem, subtotal, deliveryFee, total, estimatedPreparationTime, itemCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [address, setAddress] = useState('home');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/products' },
    { name: 'Carrinho', href: '/cart' },
    { name: 'Pedidos', href: '/orders' },
    { name: 'Perfil', href: '/profile' }
  ];

  const handleConfirmOrder = () => {
    setShowOrderModal(false);
    clearCart();
    alert(`Pedido realizado com sucesso!\nPagamento: ${paymentMethod.replace('_', ' ')}\nEndereço: ${address === 'home' ? 'Casa' : 'Trabalho'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-primary">
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
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              </div>

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
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary'
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

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-2 gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Seu Carrinho</h2>

            {itemCount === 0 ? (
              <div className="card p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho vazio</h3>
                <p className="text-secondary mb-4">Adicione alguns produtos ao seu carrinho</p>
                <Link to="/products" className="btn btn-primary">
                  Ver Produtos
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.idProduto} className="card p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{item.nome}</h3>
                      <p className="text-secondary">R$ {item.preco.toFixed(2)} cada</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.idProduto, item.quantidade - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(item.idProduto, item.quantidade + 1)}
                          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-lg text-primary w-20 text-right">
                        R$ {(item.quantidade * item.preco).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.idProduto)}
                        className="text-error hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Taxa de entrega</span>
                  <span className="font-semibold">R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Tempo de preparo</span>
                  <span className="font-semibold">{estimatedPreparationTime} min</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowOrderModal(true)}
                className="btn btn-primary w-full"
                disabled={itemCount === 0}
              >
                Finalizar Pedido
              </button>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Método de Pagamento</h3>
              <div className="space-y-3">
                {[
                  { value: 'credit_card', label: 'Cartão de Crédito' },
                  { value: 'debit_card', label: 'Cartão de Débito' },
                  { value: 'pix', label: 'PIX' },
                  { value: 'cash', label: 'Dinheiro' }
                ].map((option) => (
                  <label key={option.value} className={`flex items-center gap-3 p-3 rounded-xl border ${paymentMethod === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'} cursor-pointer transition-colors`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="text-gray-900 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Endereço de Entrega</h3>
              <div className="space-y-3">
                {[
                  { value: 'home', label: 'Casa', details: 'Rua das Flores, 123 · Centro' },
                  { value: 'work', label: 'Trabalho', details: 'Av. Paulista, 456 · Bela Vista' }
                ].map((option) => (
                  <label key={option.value} className={`flex items-center gap-3 p-3 rounded-xl border ${address === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'} cursor-pointer transition-colors`}>
                    <input
                      type="radio"
                      name="address"
                      value={option.value}
                      checked={address === option.value}
                      onChange={() => setAddress(option.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <div>
                      <div className="text-gray-900 font-medium">{option.label}</div>
                      <div className="text-secondary text-sm">{option.details}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          cart={cart}
          total={total}
          paymentMethod={paymentMethod}
          address={address}
          onClose={() => setShowOrderModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}

function OrderModal({ cart, total, paymentMethod, address, onClose, onConfirm }) {
  const paymentLabels = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    cash: 'Dinheiro'
  };

  const addressLabels = {
    home: 'Casa - Rua das Flores, 123',
    work: 'Trabalho - Av. Paulista, 456'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.idProduto} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.nome}</span>
                    <span className="text-secondary text-sm ml-2">x{item.quantidade}</span>
                  </div>
                  <span className="font-semibold">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between text-secondary">
              <span>Pagamento</span>
              <span className="font-medium text-gray-900">{paymentLabels[paymentMethod]}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Endereço</span>
              <span className="font-medium text-gray-900">{addressLabels[address]}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Total</span>
              <span className="font-semibold text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="btn btn-primary w-full"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}