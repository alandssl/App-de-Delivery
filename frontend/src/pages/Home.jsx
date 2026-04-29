import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Star, Clock, MapPin, ChevronRight, Apple as AppStore, Play as PlayStore } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, fetchAddresses } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Home({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, addToCart, itemCount, subtotal, estimatedPreparationTime } = useCart();
  const [principalAddress, setPrincipalAddress] = useState(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(error => {
      console.error(error);
    });

    if (user?.id) {
      fetchAddresses(user.id).then(addrs => {
        const principal = addrs.find(a => a.isPrincipal);
        setPrincipalAddress(principal || addrs[0] || null);
      }).catch(console.error);
    }
  }, [user]);

  const restaurants = Array.from(new Set(products.map(p => p.restaurante))).filter(Boolean).slice(0, 6).map(name => {
    const restaurantProducts = products.filter(p => p.restaurante === name);
    const avgRating = restaurantProducts.reduce((acc, p) => acc + (p.avaliacao || 0), 0) / restaurantProducts.length;
    return {
      name: name,
      image: restaurantProducts[0]?.imagemUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      rating: avgRating > 0 ? avgRating.toFixed(1) : '4.5',
      deliveryTime: `${restaurantProducts[0]?.tempo_preparo || 25} min`,
      category: 'Geral'
    };
  });

  const getPreparationTime = (product) => {
    const name = product.nome.toLowerCase();
    if (name.includes('pizza')) return 25;
    if (name.includes('hambúrguer') || name.includes('burger')) return 18;
    if (name.includes('salada')) return 15;
    if (name.includes('refrigerante') || name.includes('bebida')) return 5;
    if (name.includes('sorvete') || name.includes('doce')) return 10;
    return 20;
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigation = user?.isAdmin ? [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Produtos', href: '/admin/products' },
    { name: 'Pedidos', href: '/admin/orders' },
    { name: 'Usuários', href: '/admin/users' }
  ] : [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/products' },
    { name: 'Carrinho', href: '/cart' },
    { name: 'Pedidos', href: '/orders' }
  ];

  const categories = [
    { name: 'Pizzas', icon: '🍕' },
    { name: 'Hambúrgueres', icon: '🍔' },
    { name: 'Japonesa', icon: '🍣' },
    { name: 'Brasileira', icon: '🍲' },
    { name: 'Sobremesas', icon: '🍦' },
    { name: 'Bebidas', icon: '🥤' },
    { name: 'Saudável', icon: '🥗' },
    { name: 'Lanches', icon: '🥪' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-[60] border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                DELIVERY
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-semibold transition-all hover:text-primary ${location.pathname === item.href ? 'text-primary' : 'text-gray-600'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 border border-gray-200">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {principalAddress 
                    ? `${principalAddress.rua}, ${principalAddress.numero}` 
                    : user?.address || 'Defina um endereço'}
                </span>
              </div>

              {!user?.isAdmin && (
                <Link to="/cart" className="p-3 bg-white border border-gray-200 rounded-2xl relative hover:border-primary transition-colors group">
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold ring-2 ring-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              <Link to="/profile" className="hidden md:flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-2xl hover:border-primary transition-all group">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                  <User className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-900">{user?.name?.split(' ')[0]}</span>
              </Link>

              <button onClick={onLogout} className="p-3 text-gray-400 hover:text-error transition-colors">
                <LogOut className="w-5 h-5" />
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-3 text-gray-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-6 px-4 animate-fade-in-up">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg font-bold text-gray-800 px-4 py-3 bg-gray-50 rounded-2xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* iFood Inspired Hero Section */}
      <section className="relative pt-12 pb-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left relative z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-xs font-black text-primary mb-8 shadow-sm border border-primary/10 tracking-widest uppercase">
              ✨ Experiência Gourmet na sua porta
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tighter">
              Peça seu prato <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">favorito</span> agora.
            </h1>

            <p className="text-gray-500 font-medium text-lg mb-10 max-w-xl mx-auto lg:mx-0">
              Centenas de restaurantes com entrega rápida e os melhores sabores da cidade. <br className="hidden md:block" />
              Sua fome não pode esperar.
            </p>

            <div className="w-full max-w-2xl relative group mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-2xl group-focus-within:bg-primary/30 transition-all rounded-full"></div>
              <div className="relative flex items-center bg-gray-50 rounded-[32px] p-2 border border-gray-100 shadow-xl group-focus-within:bg-white group-focus-within:border-primary transition-all">
                <div className="pl-6 text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="O que você quer comer hoje?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent border-none text-gray-900 placeholder-gray-400 text-lg px-4 focus:ring-0 font-medium"
                />
                <button className="bg-primary text-white px-10 py-5 rounded-[24px] font-black hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-95 uppercase tracking-widest text-xs">
                  Buscar
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-black text-gray-900">+10k Clientes Satisfeitos</p>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in-up delay-200">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10"></div>
            <div className="relative z-10 p-4 bg-white rounded-[60px] shadow-2xl border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://institucional.ifood.com.br/wp-content/uploads/2023/10/iFN_pratos-veggie-copiar-1-1024x692-1.webp"
                alt="iFood Inspiration"
                className="rounded-[50px] w-full h-full object-cover shadow-inner"
              />
              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-[32px] shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entrega em</p>
                    <p className="text-xl font-black text-gray-900">20 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-gray-900 text-white p-6 rounded-[32px] shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Avaliação</p>
                    <p className="text-xl font-black">4.9/5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 w-full max-w-4xl">
            {categories.map((cat, i) => (
              <button key={i} className="flex flex-col items-center gap-3 p-4 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-xl transition-all group">
                <span className="text-3xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 group-hover:text-primary">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Cart Bar (Fixed Position) */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] w-full max-w-3xl px-4 animate-fade-in-up">
          <div className="bg-gray-900 text-white rounded-[32px] p-5 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-6 pl-2">
              <div className="bg-primary rounded-2xl p-4 relative shadow-lg shadow-primary/40">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-white text-gray-900 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-gray-900">
                  {itemCount}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black">R$ {subtotal.toFixed(2)}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {estimatedPreparationTime} min para chegar
                </div>
              </div>
            </div>
            <Link to="/cart" className="bg-white text-gray-900 px-10 py-5 rounded-[24px] font-black hover:bg-gray-100 transition-all flex items-center gap-3 shadow-xl active:scale-95">
              FECHAR PEDIDO
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Featured Restaurants */}
        <section className="container mx-auto px-4 mb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Restaurantes Populares</h2>
              <p className="text-gray-500 font-medium italic">Os mais pedidos da sua região</p>
            </div>
            <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:underline">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((rest, i) => (
              <div key={i} className="card group cursor-pointer hover:border-primary/50">
                <div className="relative h-56 overflow-hidden">
                  <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {rest.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-xl">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-black text-gray-900">{rest.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-4">{rest.name}</h3>
                  <div className="flex items-center gap-6 text-sm text-gray-500 font-bold">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {rest.deliveryTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-black">$$</span>
                      Pedido min. R$ 20
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-900 py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Pratos em Destaque</h2>
                <p className="text-gray-400 font-medium">As melhores escolhas dos chefs hoje</p>
              </div>
              <Link to="/products" className="px-6 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all">
                Ver Cardápio Completo
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/10 transition-all group">
                  <div className="relative mb-6">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-800">
                      {product.imagemUrl ? (
                        <img src={product.imagemUrl} alt={product.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
                          {product.nome.includes('Pizza') ? '🍕' : product.nome.includes('Burger') ? '🍔' : '🍽️'}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart({
                        idProduto: product.id,
                        nome: product.nome,
                        preco: product.preco,
                        valorUnitario: product.preco,
                        preparationTime: getPreparationTime(product)
                      })}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                    >
                      <span className="text-3xl font-light">+</span>
                    </button>
                  </div>

                  <div className="text-center mt-8">
                    <div className="flex justify-center gap-1 mb-2">
                      <Star className={`w-3 h-3 ${product.avaliacao > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {product.avaliacao > 0 ? product.avaliacao.toFixed(1) : 'Novo'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 line-clamp-1">{product.nome}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.descricao}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-black text-primary">R$ {product.preco.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-2xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6 inline-block">
                DELIVERY
              </Link>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                Transformando a forma como você mata a sua fome. <br />
                Sabor, rapidez e segurança em cada pedido.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                  <AppStore className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                  <PlayStore className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Navegação</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Cardápio</Link></li>
                <li><Link to="/orders" className="hover:text-primary transition-colors">Meus Pedidos</Link></li>
                <li><Link to="/profile" className="hover:text-primary transition-colors">Configurações</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Suporte</h4>
              <ul className="space-y-4 text-gray-500 font-bold">
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Newsletter</h4>
              <p className="text-gray-500 font-medium mb-6">Receba ofertas exclusivas toda semana.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu e-mail" className="input" />
                <button className="btn btn-primary px-4">OK</button>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 text-center text-gray-400 text-xs font-black tracking-widest uppercase">
            © 2024 DELIVERY APP · TODOS OS DIREITOS RESERVADOS
          </div>
        </div>
      </footer>
    </div>
  );
}