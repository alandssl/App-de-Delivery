import { useState } from 'react';
import { BarChart3, Users, ShoppingCart, Package, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminDashboard({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Usuários', href: '/admin/users', icon: Users }
  ];

  const stats = [
    { label: 'Total de Pedidos', value: '1,234', change: '+12%', icon: ShoppingCart },
    { label: 'Produtos Ativos', value: '89', change: '+3', icon: Package },
    { label: 'Usuários Ativos', value: '567', change: '+8%', icon: Users },
    { label: 'Receita Hoje', value: 'R$ 2.450', change: '+15%', icon: BarChart3 }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'João Silva', status: 'Em Preparo', total: 'R$ 45,90' },
    { id: '#1235', customer: 'Maria Santos', status: 'Entregue', total: 'R$ 32,50' },
    { id: '#1236', customer: 'Pedro Costa', status: 'Criado', total: 'R$ 28,90' }
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
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
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
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
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
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-secondary">Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-success text-sm">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-secondary text-sm">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Entregue' ? 'bg-success/10 text-success' :
                      order.status === 'Em Preparo' ? 'bg-warning/10 text-warning' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" className="btn btn-secondary w-full mt-4">
              Ver Todos os Pedidos
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link to="/admin/products" className="btn btn-primary w-full justify-start">
                <Package className="w-5 h-5 mr-2" />
                Gerenciar Produtos
              </Link>
              <Link to="/admin/orders" className="btn btn-secondary w-full justify-start">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ver Pedidos
              </Link>
              <Link to="/admin/users" className="btn btn-secondary w-full justify-start">
                <Users className="w-5 h-5 mr-2" />
                Gerenciar Usuários
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}