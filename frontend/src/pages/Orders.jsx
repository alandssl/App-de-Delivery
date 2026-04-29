import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, User, Menu, X, LogOut, ChevronLeft, Package, MapPin, FileText, Star, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchOrders, rateProduct, markOrderAsRated } from '../services/api';

export default function Orders({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [itemRatings, setItemRatings] = useState({}); // { productId: stars }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      const userOrders = data.filter(order =>
        String(order.clienteId) === String(user.id) ||
        String(order.usuarioId?.id) === String(user.id)
      );
      setOrders(userOrders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishRating = async () => {
    if (!ratingOrder) return;

    const itemsToRate = (ratingOrder.items || ratingOrder.itens || []);
    if (Object.keys(itemRatings).length < itemsToRate.length) {
      alert('Por favor, avalie todos os itens antes de finalizar.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send all product ratings
      const ratingPromises = Object.entries(itemRatings).map(([productId, stars]) =>
        rateProduct(productId, stars)
      );
      await Promise.all(ratingPromises);

      // Mark order as rated
      await markOrderAsRated(ratingOrder.id);

      // Update local state immediately for better UX
      setOrders(prev => prev.map(o => o.id === ratingOrder.id ? { ...o, avaliado: true } : o));

      alert('Avaliação enviada com sucesso!');
      setRatingOrder(null);
      setItemRatings({});
      loadOrders(); // Still refresh to sync with server
    } catch (error) {
      console.error('Erro ao finalizar avaliação:', error);
      alert('Erro ao processar as avaliações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'CRIADO': { label: 'Aguardando', color: 'text-blue-500', bg: 'bg-blue-50', icon: Clock },
      'PEDIDO_ACEITO': { label: 'Aceito', color: 'text-indigo-500', bg: 'bg-indigo-50', icon: Clock },
      'EM_PREPARO': { label: 'Na Cozinha', color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock },
      'SAIU_PARA_ENTREGA': { label: 'Em Rota', color: 'text-purple-500', bg: 'bg-purple-50', icon: Package },
      'ENTREGUE': { label: 'Concluído', color: 'text-green-500', bg: 'bg-green-50', icon: CheckCircle },
      'CANCELADO': { label: 'Cancelado', color: 'text-red-500', bg: 'bg-red-50', icon: XCircle }
    };
    return statusMap[status] || statusMap['CRIADO'];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="glass sticky top-0 z-[60] border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Histórico</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/profile" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:border-primary transition-all group">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                  <User className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-900">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={onLogout} className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">Meus Pedidos</h2>
              <p className="text-gray-500 font-medium">Acompanhe suas refeições favoritas</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando Histórico...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {orders.map((order) => {
                const statusStr = order.statusPedido || order.status;
                const status = getStatusInfo(statusStr);
                const Icon = status.icon;
                const isAlreadyRated = order.avaliado === true || order.avaliado === 1 || String(order.avaliado) === 'true';
                const canRate = (statusStr === 'ENTREGUE' || statusStr === 'CONCLUÍDO') && !isAlreadyRated;

                return (
                  <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-premium border border-gray-100 hover:shadow-2xl transition-all group animate-fade-in-up">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-300" />
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border ${status.bg} ${status.color} flex items-center gap-2 font-black text-[10px] uppercase tracking-widest`}>
                        <Icon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pedido #{order.id}</p>
                      <h3 className="text-xl font-black text-gray-900 mb-4">
                        {new Date(order.dataHora || order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                      </h3>

                      <div className="space-y-3">
                        {(order.items || order.itens)?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {item.nomeProduto || item.produto?.nome || 'Item'}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pago</span>
                          <span className="text-2xl font-black text-gray-900">R$ {(order.valorTotal || order.total || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          {canRate && (
                            <button
                              onClick={() => setRatingOrder(order)}
                              className="px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                            >
                              <Star className="w-4 h-4 fill-white" /> Avaliar
                            </button>
                          )}
                          {isAlreadyRated && (
                            <div className="px-6 py-4 bg-green-50 text-green-500 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                              <CheckCircle className="w-4 h-4" /> Avaliado
                            </div>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                          >
                            <Eye className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center py-32 bg-white rounded-[40px] shadow-premium border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Sem pedidos ainda</h2>
              <p className="text-gray-500 font-medium mb-10">Que tal fazer o seu primeiro pedido agora?</p>
              <Link to="/products" className="btn btn-primary px-10 py-5 rounded-[24px]">
                Pedir Agora
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in-up">
          <div className="bg-white rounded-[40px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900">Pedido #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-900">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="flex justify-between items-center bg-gray-50 rounded-[32px] p-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status Atual</p>
                  <p className={`text-2xl font-black ${getStatusInfo(selectedOrder.statusPedido || selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.statusPedido || selectedOrder.status).label}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Itens Selecionados</p>
                <div className="space-y-4">
                  {(selectedOrder.items || selectedOrder.itens)?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center font-black text-xs">{item.quantidade}x</span>
                        <span className="font-bold text-gray-900">{item.produto?.nome || item.nomeProduto || 'Item'}</span>
                      </div>
                      <span className="font-black text-gray-900">R$ {((item.valorUnitario || 0) * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Endereço de Entrega</p>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-600 leading-relaxed">
                    {selectedOrder.endereco?.rua}, {selectedOrder.endereco?.numero} - {selectedOrder.endereco?.bairro}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Total</span>
                <span className="text-4xl font-black text-primary">R$ {(selectedOrder.valorTotal || selectedOrder.total || 0).toFixed(2)}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary px-10 py-5 rounded-[24px]">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-fade-in-up">
          <div className="bg-white rounded-[40px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900">Avaliar Experiência</h2>
              <button onClick={() => { setRatingOrder(null); setItemRatings({}); }} className="p-2 text-gray-400 hover:text-gray-900">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <p className="text-gray-500 font-medium">Como estava o seu pedido #{ratingOrder.id}? Avalie todos os itens abaixo:</p>

              <div className="space-y-6">
                {(ratingOrder.items || ratingOrder.itens)?.map((item, idx) => {
                  const productId = item.produtoId;
                  const currentRating = itemRatings[productId] || 0;
                  return (
                    <div key={idx} className="bg-gray-50 rounded-[32px] p-6 space-y-4 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                          {item.nomeProduto?.charAt(0) || '🍽️'}
                        </div>
                        <p className="font-black text-gray-900">{item.nomeProduto || 'Produto'}</p>
                      </div>

                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setItemRatings(prev => ({ ...prev, [productId]: star }))}
                            className={`p-2 transition-all hover:scale-125 ${currentRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                          >
                            <Star className={`w-10 h-10 ${currentRating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-10 bg-gray-50 text-center">
              <button
                onClick={handleFinishRating}
                disabled={isSubmitting}
                className="btn btn-primary w-full py-6 rounded-[24px] uppercase tracking-widest text-xs font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Finalizar Avaliações'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}