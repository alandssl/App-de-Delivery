import { useState, useEffect } from 'react';
import { User, MapPin, CreditCard, Settings, Menu, X, LogOut, ChevronLeft, Plus, Trash2, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { updateUserInfo, fetchAddresses, createAddress, deleteAddress, updateAddress, setPrincipalAddress, fetchCards, createCard, deleteCard, updateCard, setPrimaryCard } from '../services/api';

export default function Profile({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();


  const tabs = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'addresses', label: 'Meus Endereços', icon: MapPin },
    { id: 'payments', label: 'Cartões Salvos', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-[60] border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Meu Perfil</h1>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={onLogout} className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:w-80 flex flex-col gap-4">
                <div className="bg-white rounded-[40px] p-8 shadow-premium border border-gray-100">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mb-4 relative group">
                      <User className="w-10 h-10 text-primary" />
                      <div className="absolute inset-0 bg-primary/20 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Edit3 className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">{user?.name}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{user?.email}</p>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-2'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Conta Premium</p>
                  <p className="text-sm font-bold leading-snug">Você tem acesso a frete grátis em restaurantes selecionados!</p>
                  <div className="mt-4 w-12 h-1 bg-primary rounded-full"></div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1">
                <div className="bg-white rounded-[40px] p-10 shadow-premium border border-gray-100 min-h-[600px]">
                  {activeTab === 'personal' && <PersonalInfo user={user} onUpdateUser={onUpdateUser} />}
                  {activeTab === 'addresses' && <Addresses user={user} />}
                  {activeTab === 'payments' && <Payments user={user} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PersonalInfo({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cpf: user?.cpf || '',
    senha: user?.senha || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateUserInfo(user.id, formData);
      onUpdateUser(updatedUser);
      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dados Pessoais</h2>
        {message && (
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-gray-900"
              required
            />
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" disabled={loading} className="btn btn-primary px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all">
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Addresses({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ rua: '', numero: '', bairro: '', cidade: '', cep: '' });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses(user.id);
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, { ...newAddress, usuario: { id: user.id } });
      } else {
        await createAddress({ ...newAddress, usuario: { id: user.id } });
      }
      setIsAdding(false);
      setEditingAddress(null);
      setNewAddress({ rua: '', numero: '', bairro: '', cidade: '', cep: '' });
      loadAddresses();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar endereço.');
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setNewAddress({
      rua: addr.rua,
      numero: addr.numero,
      bairro: addr.bairro,
      cidade: addr.cidade,
      cep: addr.cep
    });
    setIsAdding(true);
  };

  const handleSetPrincipal = async (id) => {
    try {
      await setPrincipalAddress(id, user.id);
      loadAddresses();
    } catch (err) {
      console.error(err);
      alert('Erro ao definir endereço principal.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este endereço?')) {
      try {
        await deleteAddress(id);
        loadAddresses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Meus Endereços</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
        >
          <Plus className="w-4 h-4" /> Adicionar Novo
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-gray-50 rounded-[32px] p-8 mb-8 border border-gray-200 animate-fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 md:col-span-3">
              <input placeholder="Rua" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" value={newAddress.rua} onChange={e => setNewAddress({ ...newAddress, rua: e.target.value })} required />
            </div>
            <div>
              <input placeholder="Nº" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" value={newAddress.numero} onChange={e => setNewAddress({ ...newAddress, numero: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input placeholder="Bairro" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" value={newAddress.bairro} onChange={e => setNewAddress({ ...newAddress, bairro: e.target.value })} required />
            <input placeholder="Cidade" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" value={newAddress.cidade} onChange={e => setNewAddress({ ...newAddress, cidade: e.target.value })} required />
            <input placeholder="CEP" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary font-bold text-sm" value={newAddress.cep} onChange={e => setNewAddress({ ...newAddress, cep: e.target.value })} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
              {editingAddress ? 'Salvar Alterações' : 'Salvar Endereço'}
            </button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingAddress(null); }} className="bg-white border border-gray-200 text-gray-500 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Buscando endereços...</p>
      ) : (
        <div className="grid gap-6">
          {addresses.length > 0 ? addresses.map((addr) => (
            <div key={addr.id} className={`group bg-white border rounded-[32px] p-8 flex items-center justify-between hover:border-primary hover:shadow-xl transition-all ${addr.isPrincipal ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${addr.isPrincipal ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{addr.rua}, {addr.numero}</h3>
                    {addr.isPrincipal && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">Principal</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-gray-400 mt-1">{addr.bairro}, {addr.cidade} - CEP: {addr.cep}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!addr.isPrincipal && (
                  <button
                    onClick={() => handleSetPrincipal(addr.id)}
                    className="p-4 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                    title="Definir como principal"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(addr)}
                  className="p-4 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(addr.id)} className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-12 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nenhum endereço cadastrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Payments({ user }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({
    numeroCartao: '',
    nomePortador: '',
    mesAnoValidade: '',
    cvv: '',
    bandeira: 'Visa'
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchCards(user.id);
      setCards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCard) {
        await updateCard(user.id, editingCard.id, newCard);
      } else {
        await createCard(user.id, newCard);
      }
      setIsAdding(false);
      setEditingCard(null);
      setNewCard({ numeroCartao: '', nomePortador: '', mesAnoValidade: '', cvv: '', bandeira: 'Visa' });
      loadCards();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar cartão.');
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setNewCard({
      numeroCartao: card.numeroCartao || '',
      nomePortador: card.nomePortador,
      mesAnoValidade: card.mesAnoValidade,
      cvv: '', // CVV usually not returned for security
      bandeira: card.bandeira || 'Visa'
    });
    setIsAdding(true);
  };

  const handleDelete = async (cartaoId) => {
    if (window.confirm('Excluir este cartão?')) {
      try {
        await deleteCard(user.id, cartaoId);
        loadCards();
      } catch (err) {
        console.error(err);
        alert('Erro ao remover cartão.');
      }
    }
  };

  const handleSetPrimary = async (cartaoId) => {
    try {
      await setPrimaryCard(user.id, cartaoId);
      loadCards();
    } catch (err) {
      console.error(err);
      alert('Erro ao definir como padrão.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cartões Salvos</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Cartão
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-900 text-white rounded-[32px] p-10 mb-8 animate-fade-in-up relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6">{editingCard ? 'Editar Cartão' : 'Adicionar Novo Cartão'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase">Número do Cartão</label>
                <input
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-bold"
                  value={newCard.numeroCartao}
                  onChange={e => setNewCard({ ...newCard, numeroCartao: e.target.value })}
                  required
                  maxLength="16"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase">Nome no Cartão</label>
                <input
                  placeholder="COMO NO CARTÃO"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-bold uppercase"
                  value={newCard.nomePortador}
                  onChange={e => setNewCard({ ...newCard, nomePortador: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase">Validade</label>
                <input
                  placeholder="MM/YY"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-bold"
                  value={newCard.mesAnoValidade}
                  onChange={e => setNewCard({ ...newCard, mesAnoValidade: e.target.value })}
                  required
                  maxLength="5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase">CVV</label>
                <input
                  placeholder="123"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-bold"
                  value={newCard.cvv}
                  onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                  required={!editingCard}
                  maxLength="3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase">Bandeira</label>
                <select
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary font-bold"
                  value={newCard.bandeira}
                  onChange={e => setNewCard({ ...newCard, bandeira: e.target.value })}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Elo">Elo</option>
                  <option value="American Express">Amex</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                {editingCard ? 'Salvar Alterações' : 'Adicionar Agora'}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingCard(null); }}
                className="bg-white/10 text-white/60 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
          <CreditCard className="absolute -bottom-4 -right-4 w-40 h-40 text-white/5" />
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.length > 0 ? cards.map((card) => (
            <div key={card.id} className={`bg-white border rounded-[32px] p-8 flex flex-col justify-between hover:border-primary hover:shadow-xl transition-all relative overflow-hidden group ${card.isPrimary ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between relative z-10 mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-10 ${card.bandeira === 'Visa' ? 'bg-blue-600' :
                    card.bandeira === 'Mastercard' ? 'bg-orange-500' :
                      card.bandeira === 'Elo' ? 'bg-yellow-500' : 'bg-gray-800'
                    } rounded-lg flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-black italic text-[10px] uppercase">{card.bandeira?.split(' ')[0]}</span>
                  </div>
                  {card.isPrimary && (
                    <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full">Padrão</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!card.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(card.id)}
                      className="p-4 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                      title="Definir como padrão"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-4 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(card.id)} className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xl font-black text-gray-900 tracking-widest mb-1">
                  •••• •••• •••• {card.numeroCartao?.slice(-4) || '****'}
                </p>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Titular</span>
                    <span className="text-xs font-bold text-gray-600 uppercase">{card.nomePortador}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Expira</span>
                    <span className="text-xs font-bold text-gray-600">{card.mesAnoValidade}</span>
                  </div>
                </div>
              </div>
              <CreditCard className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-50 group-hover:text-primary/5 transition-colors" />
            </div>
          )) : (
            <div className="md:col-span-2 py-12 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Nenhum cartão cadastrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}