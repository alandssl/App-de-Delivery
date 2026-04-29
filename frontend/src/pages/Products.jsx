import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Search, User, Menu, X, LogOut, Star, Clock, Filter, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, rateProduct } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Products({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, product: null });
  const location = useLocation();
  const { cart, addToCart, updateQuantity, itemCount } = useCart();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(error => {
      console.error(error);
    });
  }, []);

  const categories = [
    { id: 'Todos', name: 'Todos', emoji: '🍽️' },
    { id: 'PIIZAS', name: 'Pizzas', emoji: '🍕' },
    { id: 'HAMBURGUERES', name: 'Hamburger', emoji: '🍔' },
    { id: 'JAPONESA', name: 'Japonesa', emoji: '🍣' },
    { id: 'BRASILEIRA', name: 'Brasileira', emoji: '🍲' },
    { id: 'SOBREMESAS', name: 'Sobremesas', emoji: '🍰' },
    { id: 'BEBIDAS', name: 'Bebidas', emoji: '🥤' },
    { id: 'SAUDÁVEL', name: 'Saudável', emoji: '🥗' },
    { id: 'LANCHES', name: 'Lanches', emoji: '🥪' }
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.categoriaLanches === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPreparationTime = (product) => {
    const name = product.nome.toLowerCase();
    if (name.includes('pizza')) return 25;
    if (name.includes('hambúrguer') || name.includes('burger')) return 18;
    if (name.includes('salada')) return 15;
    return 20;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-[60] border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Cardápio</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="p-3 bg-white border border-gray-200 rounded-2xl relative hover:border-primary transition-colors group">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </Link>
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

      {/* Search and Category Bar */}
      <section className="bg-white border-b border-gray-100 py-6 sticky top-20 z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-[24px] w-full lg:max-w-md focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all group overflow-hidden">
              <div className="pl-6 text-gray-400 group-focus-within:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Busque por pratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 rounded-[20px] font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
                    }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products List - DENSE LIST/GRID */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              {selectedCategory === 'Todos' ? 'Descubra Novos Sabores' : selectedCategory}
            </h2>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {filteredProducts.length} itens
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.idProduto === product.id);
                return (
                  <div key={product.id} className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all group animate-fade-in-up flex flex-col">
                    <div className="relative mb-3">
                      <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-gray-50">
                        {product.imagemUrl ? (
                          <img src={product.imagemUrl} alt={product.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">
                            {product.nome.toLowerCase().includes('pizza') ? '🍕' : '🍽️'}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setRatingModal({ isOpen: true, product })}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm"
                      >
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-black text-gray-900">
                          {product.avaliacao ? product.avaliacao.toFixed(1) : 'NEW'}
                        </span>
                      </button>
                    </div>

                    <div className="flex-1 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                          {product.categoriaLanches || 'Geral'}
                        </span>
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">|</span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          {product.restaurante || 'Delivery'}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.nome}
                      </h3>
                      <p className="text-gray-400 font-medium text-[10px] leading-tight line-clamp-2 h-6">
                        {product.descricao}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-base font-black text-gray-900">R$ {product.preco.toFixed(2)}</span>

                      {cartItem ? (
                        <div className="flex items-center gap-2 bg-gray-900 rounded-[14px] p-1 scale-90 origin-right">
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantidade - 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-black text-white text-xs min-w-[14px] text-center">
                            {cartItem.quantidade}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, cartItem.quantidade + 1)}
                            className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart({
                            idProduto: product.id,
                            nome: product.nome,
                            preco: product.preco,
                            valorUnitario: product.preco,
                            preparationTime: getPreparationTime(product)
                          })}
                          className="bg-primary text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Nada por aqui</h3>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
                className="text-primary font-bold hover:underline"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Rating Modal */}
      {ratingModal.isOpen && (
        <RatingModal
          product={ratingModal.product}
          onClose={() => setRatingModal({ isOpen: false, product: null })}
          onSuccess={() => {
            setRatingModal({ isOpen: false, product: null });
            fetchProducts().then(setProducts).catch(console.error);
          }}
        />
      )}
    </div>
  );
}

function RatingModal({ product, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await rateProduct(product.id, rating);
      onSuccess();
    } catch (error) {
      console.error('Erro ao avaliar:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in-up">
      <div className="bg-white rounded-[32px] max-w-sm w-full p-8 text-center shadow-2xl">
        <h3 className="text-xl font-black text-gray-900 mb-2">Avaliar</h3>
        <p className="text-gray-500 font-medium mb-6 text-sm">{product.nome}</p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl transition-all ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1 py-3 rounded-2xl text-sm" disabled={submitting}>
            Voltar
          </button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1 py-3 rounded-2xl text-sm" disabled={submitting}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}