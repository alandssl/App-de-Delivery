import { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, XCircle, Menu, X, LogOut, ChevronLeft, Package, User, Save } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchOrders, updateOrderStatus } from '../services/api';

export default function AdminOrders({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempStatus, setTempStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!tempStatus || !selectedOrder) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder.id, tempStatus);
      await loadOrders();
      setSelectedOrder(null);
      alert('Status atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'CRIADO': { label: 'Pendente', color: 'text-blue-500', bg: 'bg-blue-50' },
      'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-indigo-500', bg: 'bg-indigo-50' },
      'EM_PREPARO': { label: 'Cozinha', color: 'text-orange-500', bg: 'bg-orange-50' },
      'SAIU_PARA_ENTREGA': { label: 'Rota', color: 'text-purple-500', bg: 'bg-purple-50' },
      'ENTREGUE': { label: 'Finalizado', color: 'text-green-500', bg: 'bg-green-50' },
      'CANCELADO': { label: 'Cancelado', color: 'text-red-500', bg: 'bg-red-50' }
    };
    return statusMap[status] || statusMap['CRIADO'];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Gestão de Pedidos</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm font-black text-gray-400 uppercase tracking-widest">{orders.length} pedidos hoje</span>
              <button onClick={onLogout} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Banco de Dados...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-premium border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50/50">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedido</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => {
                      const status = getStatusInfo(order.statusPedido || order.status);
                      return (
                        <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6 font-black text-gray-900">#{order.id}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                {order.usuarioId?.name?.charAt(0) || 'U'}
                              </div>
                              <span className="font-bold text-gray-900">{order.usuarioId?.name || 'Cliente'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-2 rounded-2xl ${status.bg} ${status.color} font-black text-[10px] uppercase tracking-widest`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-gray-900">
                            R$ {(order.valorTotal || 0).toFixed(2)}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => { setSelectedOrder(order); setTempStatus(order.statusPedido || order.status); }}
                                className="px-6 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" /> Gerenciar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in-up">
          <div className="bg-white rounded-[40px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900">Pedido #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-900">
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="bg-gray-50 rounded-[32px] p-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cliente</p>
                 <p className="text-xl font-black text-gray-900">{selectedOrder.usuarioId?.name || 'Cliente'}</p>
                 <p className="text-sm font-bold text-gray-500 mt-1">{selectedOrder.usuarioId?.email || 'email@exemplo.com'}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Produtos do Pedido</p>
                <div className="space-y-3">
                   {(selectedOrder.items || selectedOrder.itens)?.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                        <span className="font-bold text-gray-900">{item.quantidade}x {item.nomeProduto || item.produto?.nome || 'Item'}</span>
                        <span className="font-black text-gray-900">R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Atualizar Status</p>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 px-6 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest outline-none focus:border-primary"
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                >
                  <option value="CRIADO">Aguardando Aprovação</option>
                  <option value="PEDIDO_ACEITO">Aceitar Pedido</option>
                  <option value="EM_PREPARO">Mandar para Cozinha</option>
                  <option value="SAIU_PARA_ENTREGA">Saiu para Entrega</option>
                  <option value="ENTREGUE">Marcar como Entregue</option>
                  <option value="CANCELADO">Cancelar Pedido</option>
                </select>
              </div>
            </div>

            <div className="p-10 bg-gray-50 flex items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Geral</span>
                <span className="text-4xl font-black text-primary">R$ {(selectedOrder.valorTotal || 0).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleUpdateStatus} 
                  disabled={updating}
                  className="bg-primary text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {updating ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}