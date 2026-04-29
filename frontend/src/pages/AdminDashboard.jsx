import { useState, useEffect } from 'react';
import { BarChart3, Users, ShoppingCart, Package, Menu, X, LogOut, TrendingUp, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, fetchOrders, fetchUsers } from '../services/api';

export default function AdminDashboard({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchUsers()
      ]);

      const totalRevenue = orders.reduce((acc, order) => acc + (order.valorTotal || 0), 0);
      
      setStats({
        orders: orders.length,
        products: products.length,
        users: users.length,
        revenue: totalRevenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Usuários', href: '/admin/users', icon: Users }
  ];

  const statCards = [
    { label: 'Total de Pedidos', value: stats.orders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Produtos Ativos', value: stats.products, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Usuários Cadastrados', value: stats.users, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Receita Total', value: `R$ ${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-2xl font-black text-primary tracking-tighter uppercase italic">
                Admin Panel
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 text-sm font-bold transition-all ${
                      isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-black text-gray-900 leading-none">{user?.name}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Administrador</span>
              </div>
              <button onClick={onLogout} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-500 font-medium tracking-tight">Aqui está o que está acontecendo na sua loja hoje.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Carregando métricas...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-[40px] p-8 shadow-premium border border-gray-100 hover:shadow-2xl transition-all group">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-premium border border-gray-100">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pedidos Recentes</h2>
                    <Link to="/admin/orders" className="text-sm font-black text-primary uppercase tracking-widest hover:underline">Ver tudo</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-50">
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="py-5 font-bold text-gray-900">#{order.id}</td>
                            <td className="py-5">
                              <span className="text-sm font-bold text-gray-600">{order.clienteNome || 'Cliente'}</span>
                            </td>
                            <td className="py-5">
                              <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                {order.statusPedido || order.status}
                              </span>
                            </td>
                            <td className="py-5 text-right font-black text-gray-900">
                              R$ {(order.valorTotal || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-4">Gerenciar Produtos</h3>
                      <p className="text-gray-400 font-medium mb-8 text-sm">Adicione novos itens ao cardápio ou edite preços e fotos.</p>
                      <Link to="/admin/products" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all">
                        Ir para Produtos
                      </Link>
                    </div>
                    <Package className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden group shadow-xl shadow-primary/30">
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black mb-4">Usuários</h3>
                      <p className="text-white/70 font-medium mb-8 text-sm">Controle as contas e permissões dos clientes cadastrados.</p>
                      <Link to="/admin/users" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                        Gerenciar Usuários
                      </Link>
                    </div>
                    <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}