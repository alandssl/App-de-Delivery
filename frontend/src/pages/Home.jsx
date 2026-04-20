import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Home({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, addToCart, itemCount, subtotal, estimatedPreparationTime } = useCart();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const restaurants = [
    {
      name: 'Pizzaria Bella Vista',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      category: 'Pizza Italiana',
      preparationTime: 25,
      price: 42.50
    },
    {
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
      rating: 4.9,
      deliveryTime: '20-30 min',
      category: 'Japonês',
      preparationTime: 22,
      price: 55.90
    },
    {
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      rating: 4.7,
      deliveryTime: '15-25 min',
      category: 'Hambúrgueres',
      preparationTime: 18,
      price: 38.00
    },
    {
      name: 'Taco Loco',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.6,
      deliveryTime: '20-30 min',
      category: 'Mexicano',
      preparationTime: 20,
      price: 34.90
    },
    {
      name: 'Pasta Fresca',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      rating: 4.8,
      deliveryTime: '25-35 min',
      category: 'Italiano',
      preparationTime: 24,
      price: 48.90
    },
    {
      name: 'Green Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      rating: 4.5,
      deliveryTime: '15-25 min',
      category: 'Saudável',
      preparationTime: 17,
      price: 32.30
    }
  ];

  const getPreparationTime = (product) => {
    const name = product.nome.toLowerCase();
    if (name.includes('pizza')) return 25;
    if (name.includes('hambúrguer') || name.includes('burger')) return 18;
    if (name.includes('salada')) return 15;
    if (name.includes('refrigerante') || name.includes('bebida')) return 5;
    if (name.includes('sorvete') || name.includes('doce')) return 10;
    return 20;
  };

  const addRestaurantToCart = (restaurant, index) => {
    addToCart({
      idProduto: `restaurant-${index}`,
      nome: `${restaurant.name} - Pedido Rápido`,
      preco: restaurant.price,
      valorUnitario: restaurant.price,
      preparationTime: restaurant.preparationTime
    });
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
    { name: 'Pedidos', href: '/orders' },
    { name: 'Perfil', href: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-purple-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-colors">
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
                      ? 'text-white font-semibold'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {!user?.isAdmin && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-white hover:text-gray-100" />
                  <span className="absolute -top-2 -right-2 bg-white text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                </Link>
              )}

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">{user?.name}</span>
              </div>

              <button
                onClick={onLogout}
                className="text-white hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4">
              <nav className="flex flex-col gap-4 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary font-semibold'
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            🍕 Peça sua comida favorita
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
            Entrega rápida e segura na sua porta
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/70" />
            <input
              type="text"
              placeholder="Buscar restaurantes ou pratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 text-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all shadow-2xl"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mt-12 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm">Restaurantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">15min</div>
              <div className="text-sm">Entrega média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm">Avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {cart.length > 0 && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl bg-gradient-to-r from-primary to-purple-600 text-white p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/80">Carrinho rápido</p>
                  <h2 className="text-3xl font-bold mt-2">{itemCount} item{itemCount !== 1 ? 's' : ''} no carrinho</h2>
                  <p className="mt-2 text-white/80">Total: R$ {subtotal.toFixed(2)} · Tempo de preparo estimado: {estimatedPreparationTime} min</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {cart.slice(0, 3).map((item) => (
                    <div key={item.idProduto} className="rounded-2xl bg-white/15 p-4">
                      <div className="text-sm text-white/80">{item.nome}</div>
                      <div className="mt-2 text-lg font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
                      <div className="text-sm text-white/80">Qtd: {item.quantidade}</div>
                      <div className="text-sm text-white/80">Tempo: {item.preparationTime} min</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Restaurants */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🍽️ Restaurantes em Destaque
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Descubra os melhores restaurantes da sua região
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Pizzaria Bella Vista",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
                rating: 4.8,
                deliveryTime: "25-35 min",
                category: "Pizza Italiana"
              },
              {
                name: "Sushi Master",
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
                rating: 4.9,
                deliveryTime: "20-30 min",
                category: "Japonês"
              },
              {
                name: "Burger House",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
                rating: 4.7,
                deliveryTime: "15-25 min",
                category: "Hambúrgueres"
              },
              {
                name: "Taco Loco",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                rating: 4.6,
                deliveryTime: "20-30 min",
                category: "Mexicano"
              },
            ].map((restaurant, index) => (
              <div
                key={index}
                onClick={() => addRestaurantToCart(restaurant, index)}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{restaurant.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">⏱️ {restaurant.deliveryTime}</span>
                    <button
                      onClick={() => addRestaurantToCart(restaurant, index)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🥘 Categorias Populares
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Explore diferentes tipos de culinária
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Pizza", icon: "🍕", color: "from-red-400 to-red-600" },
              { name: "Japonês", icon: "🍱", color: "from-blue-400 to-blue-600" },
              { name: "Brasileiro", icon: "🥘", color: "from-green-400 to-green-600" },
              { name: "Italiano", icon: "🍝", color: "from-yellow-400 to-yellow-600" },
              { name: "Mexicano", icon: "🌮", color: "from-orange-400 to-orange-600" },
              { name: "Hambúrguer", icon: "🍔", color: "from-pink-400 to-pink-600" },
              { name: "Saudável", icon: "🥗", color: "from-teal-400 to-teal-600" },
              { name: "Sobremesas", icon: "🍰", color: "from-purple-400 to-purple-600" }
            ].map((category, index) => (
              <div key={index} className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🔥 Pratos em Destaque
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Os favoritos dos nossos clientes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const cartItem = cart.find(item => item.idProduto === product.id);
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl drop-shadow-lg">{product.nome.includes('Pizza') ? '🍕' : product.nome.includes('Hambúrguer') ? '🍔' : product.nome.includes('Salada') ? '🥗' : '🍽️'}</span>
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Novo
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{product.nome}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descricao}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        R$ {product.preco.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart({
                          idProduto: product.id,
                          nome: product.nome,
                          preco: product.preco,
                          valorUnitario: product.preco,
                          preparationTime: getPreparationTime(product)
                        })}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <span>+</span>
                        Adicionar
                      </button>
                    </div>
                    {cartItem && (
                      <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                        Quantidade: {cartItem.quantidade} · Tempo: {cartItem.preparationTime} min · Valor: R$ {(cartItem.preco * cartItem.quantidade).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-full hover:from-purple-600 hover:to-pink-500 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Ver Todos os Produtos →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para pedir?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Baixe nosso app e tenha uma experiência ainda melhor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              📱 Baixar App iOS
            </button>
            <button className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg">
              🤖 Baixar App Android
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}