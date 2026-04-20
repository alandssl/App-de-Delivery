import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Search, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Products({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, addToCart, updateQuantity, itemCount } = useCart();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const categories = [
    { name: 'Todos', emoji: '🍽️' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Hambúrguer', emoji: '🍔' },
    { name: 'Salada', emoji: '🥗' },
    { name: 'Bebida', emoji: '🥤' },
    { name: 'Sobremesa', emoji: '🍰' }
  ];

  const categoryKeywords = {
    Todos: [],
    Pizza: ['pizza'],
    'Hambúrguer': ['hambúrguer', 'burger'],
    Salada: ['salada'],
    Bebida: ['refrigerante', 'bebida', 'coca'],
    Sobremesa: ['sorvete', 'doce', 'sobremesa']
  };

  const filteredProducts = products.filter((product) => {
    const lowerName = product.nome.toLowerCase();
    const lowerDescription = product.descricao.toLowerCase();
    const matchesSearch = lowerName.includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'Todos' ||
      categoryKeywords[selectedCategory].some((keyword) =>
        lowerName.includes(keyword) || lowerDescription.includes(keyword)
      );

    return matchesSearch && matchesCategory;
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

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/products' },
    { name: 'Carrinho', href: '/cart' },
    { name: 'Pedidos', href: '/orders' },
    { name: 'Perfil', href: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-white hover:text-gray-100" />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              </Link>

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

      {/* Search and Filters */}
      <section className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pratos deliciosos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-lg focus:border-primary focus:outline-none transition-colors shadow-sm"
              />
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    if (category.name === 'Todos') {
                      setSearchTerm('');
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === category.name
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🍽️ Nossos Produtos
            </h1>
            <p className="text-gray-600">
              Descubra pratos deliciosos preparados com amor
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.idProduto === product.id);
                const productEmoji = product.nome.toLowerCase().includes('pizza') ? '🍕' :
                                   product.nome.toLowerCase().includes('hambúrguer') || product.nome.toLowerCase().includes('burger') ? '🍔' :
                                   product.nome.toLowerCase().includes('salada') ? '🥗' :
                                   product.nome.toLowerCase().includes('refrigerante') || product.nome.toLowerCase().includes('coca') ? '🥤' :
                                   product.nome.toLowerCase().includes('sorvete') || product.nome.toLowerCase().includes('doce') ? '🍦' : '🍽️';

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {productEmoji}
                      </span>
                      {cartItem && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.nome}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.descricao}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-primary">
                          R$ {product.preco.toFixed(2)}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {(4.5 + Math.random() * 0.5).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Section */}
                      {cartItem ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-2">
                            <button
                              onClick={() => updateQuantity(product.id, cartItem.quantidade - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold min-w-[2rem] text-center">
                              {cartItem.quantidade}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, cartItem.quantidade + 1)}
                              className="w-8 h-8 rounded-full bg-primary text-white hover:bg-purple-700 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <Link
                            to="/cart"
                            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Ver Carrinho
                          </Link>
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
                          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente buscar por outros termos ou navegue pelas categorias.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ver Todos os Produtos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔥 Mais Pedidos
            </h2>
            <p className="text-gray-600">
              Os favoritos dos nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Pizza Margherita",
                price: 45.90,
                emoji: "🍕",
                description: "Molho, mussarela e manjericão"
              },
              {
                name: "Hambúrguer Gourmet",
                price: 32.50,
                emoji: "🍔",
                description: "Blend especial com queijo e bacon"
              },
              {
                name: "Salada Caesar",
                price: 28.90,
                emoji: "🥗",
                description: "Alface, croutons e molho caesar"
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="text-5xl mb-3">{product.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="text-xl font-bold text-primary mb-3">
                  R$ {product.price.toFixed(2)}
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full">
                  Pedir Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}