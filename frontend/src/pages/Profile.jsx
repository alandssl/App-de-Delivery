import { useState } from 'react';
import { User, MapPin, CreditCard, Settings, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Profile({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/products' },
    { name: 'Carrinho', href: '/cart' },
    { name: 'Pedidos', href: '/orders' },
    { name: 'Perfil', href: '/profile' }
  ];

  const tabs = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

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

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-secondary">Gerencie suas informações pessoais</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="card p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <div className="card p-6">
                {activeTab === 'personal' && <PersonalInfo user={user} />}
                {activeTab === 'addresses' && <Addresses />}
                {activeTab === 'payments' && <Payments />}
                {activeTab === 'settings' && <Settings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfo({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle save
    alert('Informações salvas com sucesso!');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

function Addresses() {
  const addresses = [
    {
      id: 1,
      type: 'Casa',
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    {
      id: 2,
      type: 'Trabalho',
      street: 'Av. Paulista, 456',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Endereços</h2>
        <button className="btn btn-primary">
          Adicionar Endereço
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{address.type}</h3>
                <p className="text-secondary text-sm mt-1">
                  {address.street}<br />
                  {address.neighborhood}, {address.city} - {address.state}<br />
                  CEP: {address.zipCode}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary text-sm">Editar</button>
                <button className="btn btn-ghost text-error text-sm">Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Payments() {
  const paymentMethods = [
    { id: 1, type: 'Cartão de Crédito', last4: '**** 1234', brand: 'Visa' },
    { id: 2, type: 'Cartão de Débito', last4: '**** 5678', brand: 'Mastercard' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Métodos de Pagamento</h2>
        <button className="btn btn-primary">
          Adicionar Cartão
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((payment) => (
          <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{payment.brand} {payment.last4}</h3>
                  <p className="text-secondary text-sm">{payment.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary text-sm">Editar</button>
                <button className="btn btn-ghost text-error text-sm">Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({
    notifications: true,
    marketing: false,
    language: 'pt-BR'
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Notificações</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <span className="text-secondary">Receber notificações de pedidos</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="marketing"
                checked={settings.marketing}
                onChange={handleChange}
                className="w-4 h-4 text-primary"
              />
              <span className="text-secondary">Receber emails de marketing</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Idioma</h3>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full max-w-xs"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>

        <button className="btn btn-primary">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}