import { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, MapPin, User, Menu, X, LogOut, Plus, Minus, Trash2, ChevronLeft, ShieldCheck, Clock, Wallet, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder, fetchAddresses, fetchCards } from '../services/api';

export default function Cart({ user, onLogout }) {
  const { cart, updateQuantity, removeItem, subtotal, deliveryFee, total, estimatedPreparationTime, itemCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cards, setCards] = useState([]);
  const [address, setAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Fetch Addresses
      fetchAddresses(user.id).then(addrs => {
        setAddresses(addrs);
        const principal = addrs.find(a => a.isPrincipal) || addrs[0];
        setAddress(principal);
      }).catch(console.error);

      // Fetch Cards
      fetchCards(user.id).then(savedCards => {
        setCards(savedCards);
        const principal = savedCards.find(c => c.isPrimary) || savedCards[0];
        if (principal) setSelectedCardId(principal.id);
      }).catch(console.error);
    }
  }, [user]);

  const handleConfirmOrder = async () => {
    try {
      const orderPayload = {
        usuarioId: { id: user.id },
        endereco: address,
        statusPedido: 'PENDENTE',
        valorTotal: total,
        itens: cart.map(item => ({
          produtoId: { id: item.idProduto },
          quantidade: item.quantidade,
          valorUnitario: item.preco
        }))
      };

      if (paymentMethod === 'credit_card' && selectedCardId) {
        orderPayload.cartaoId = { id: selectedCardId };
      }

      await createOrder(orderPayload);
      setShowOrderModal(false);
      clearCart();

      const msg = document.createElement('div');
      msg.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl z-[200] animate-bounce-slow';
      msg.innerHTML = '🚀 Pedido Realizado com Sucesso!';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 4000);

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Ocorreu um erro ao realizar o pedido.');
    }
  };

  const getSelectedCard = () => cards.find(c => c.id === selectedCardId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="glass sticky top-0 z-[60] border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/products" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Carrinho</h1>
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
          {itemCount === 0 ? (
            <div className="max-w-xl mx-auto text-center py-24 bg-white rounded-[40px] shadow-premium border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Seu carrinho está vazio</h2>
              <p className="text-gray-500 font-medium mb-10">Parece que você ainda não escolheu seu prato favorito.</p>
              <Link to="/products" className="btn btn-primary px-10 py-5 rounded-[24px]">
                Explorar Cardápio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-gray-900">Meus Itens</h2>
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{itemCount} Itens</span>
                </div>

                {cart.map((item) => (
                  <div key={item.idProduto} className="bg-white rounded-[32px] p-6 shadow-premium border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group animate-fade-in-up">
                    <div className="w-32 h-32 bg-gray-50 rounded-3xl flex items-center justify-center text-5xl overflow-hidden shrink-0">
                      {item.nome.toLowerCase().includes('pizza') ? '🍕' : '🍽️'}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{item.nome}</h3>
                      <p className="text-gray-400 font-bold text-sm mb-4">R$ {item.preco.toFixed(2)} / un</p>

                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-[20px] p-1.5 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.idProduto, item.quantidade - 1)}
                            className="w-10 h-10 rounded-2xl bg-white text-gray-400 hover:text-gray-900 shadow-sm flex items-center justify-center transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-gray-900 min-w-[20px] text-center">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.idProduto, item.quantidade + 1)}
                            className="w-10 h-10 rounded-2xl bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.idProduto)}
                          className="p-4 text-gray-300 hover:text-error hover:bg-error/5 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-gray-900">R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 space-y-8 sticky top-32">
                <div className="bg-white rounded-[40px] p-8 shadow-premium border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-primary" />
                    Pagamento
                  </h3>

                  <div className="space-y-3">
                    {[
                      { id: 'credit_card', label: 'Cartão de Crédito', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'pix', label: 'PIX (5% OFF)', icon: <div className="font-black text-xs">PIX</div> },
                      { id: 'cash', label: 'Dinheiro na entrega', icon: <div className="font-black text-xs">R$</div> }
                    ].map((opt) => (
                      <div key={opt.id} className="space-y-3">
                        <button
                          onClick={() => setPaymentMethod(opt.id)}
                          className={`w-full flex items-center justify-between p-5 rounded-[24px] border-2 transition-all ${paymentMethod === opt.id ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === opt.id ? 'bg-primary text-white' : 'bg-white text-gray-400'}`}>
                              {opt.icon}
                            </div>
                            <span className="font-black text-gray-900">{opt.label}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? 'border-primary' : 'border-gray-300'}`}>
                            {paymentMethod === opt.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                          </div>
                        </button>

                        {paymentMethod === 'credit_card' && opt.id === 'credit_card' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 animate-fade-in-up">
                            {cards.length > 0 ? cards.map(card => (
                              <button
                                key={card.id}
                                onClick={() => setSelectedCardId(card.id)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedCardId === card.id ? 'border-primary bg-white shadow-md' : 'border-gray-100 bg-gray-50'
                                  }`}
                              >
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.bandeira}</p>
                                <p className="text-sm font-black text-gray-900">•••• {card.numeroCartao?.slice(-4) || '****'}</p>
                                {card.isPrimary && <span className="text-[8px] text-primary font-black uppercase">Padrão</span>}
                              </button>
                            )) : (
                              <div className="col-span-full p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase">Nenhum cartão salvo</p>
                                <Link to="/profile" className="text-[10px] font-black text-primary uppercase hover:underline">Adicionar no Perfil</Link>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 shadow-premium border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    Entrega
                  </h3>
                  <div className="space-y-4">
                    {addresses.length > 0 ? addresses.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => setAddress(loc)}
                        className={`w-full flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all ${address?.id === loc.id ? 'border-primary bg-primary/5' : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${address?.id === loc.id ? 'bg-primary text-white' : 'bg-white text-gray-400'}`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-gray-900">{loc.rua}, {loc.numero}</p>
                          <p className="text-xs font-bold text-gray-400">{loc.bairro} - {loc.cidade}</p>
                        </div>
                      </button>
                    )) : (
                      <div className="p-6 bg-gray-50 rounded-3xl text-center">
                        <p className="text-xs font-bold text-gray-400 mb-4">Nenhum endereço cadastrado</p>
                        <Link to="/profile" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Adicionar no Perfil</Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>

                  <div className="space-y-6 mb-10 relative z-10">
                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-[2px] text-[10px]">
                      <span>Subtotal</span>
                      <span className="text-white">R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-[2px] text-[10px]">
                      <span>Taxa de Entrega</span>
                      <span className="text-success">
                        {deliveryFee === 0 ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                            Grátis
                          </div>
                        ) : (
                          `R$ ${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-[2px] text-[10px]">
                      <span>Tempo Estimado</span>
                      <span className="text-white flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {estimatedPreparationTime} min
                      </span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest">Total</span>
                      <span className="text-5xl font-black text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="w-full bg-primary text-white py-6 rounded-[24px] font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
                  >
                    FINALIZAR PEDIDO
                    <ShieldCheck className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showOrderModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in-up">
          <div className="bg-white rounded-[40px] max-w-md w-full p-10 shadow-2xl">
            <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Tudo Pronto?</h2>

            <div className="space-y-6 mb-10">
              <div className="p-6 bg-gray-50 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entregar em</p>
                <p className="font-black text-gray-900">
                  {address ? `${address.rua}, ${address.numero}` : 'Nenhum endereço selecionado'}
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pagar com</p>
                <p className="font-black text-gray-900">
                  {paymentMethod === 'credit_card' ? 
                    (getSelectedCard() ? `${getSelectedCard().bandeira} •••• ${getSelectedCard().numeroCartao?.slice(-4)}` : 'Cartão não selecionado') :
                    paymentMethod === 'pix' ? 'PIX' : 'Dinheiro'}
                </p>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowOrderModal(false)} className="btn btn-secondary flex-1 py-5 rounded-[24px]">
                Voltar
              </button>
              <button 
                onClick={handleConfirmOrder} 
                className="btn btn-primary flex-1 py-5 rounded-[24px]"
                disabled={!address || (paymentMethod === 'credit_card' && !selectedCardId)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}