import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Menu, X, LogOut, ChevronLeft, Search, Image as ImageIcon, CheckCircle2, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/api';

export default function AdminProducts({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (productData, imageFile) => {
    try {
      let savedProduct;
      if (editingProduct) {
        savedProduct = await updateProduct(productData);
      } else {
        savedProduct = await createProduct(productData);
      }
      
      const productId = savedProduct?.id || productData.id;
      if (imageFile && productId) {
        await uploadProductImage(productId, imageFile);
      }
      
      await loadProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este produto permanentemente?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Estoque de Produtos</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                 <Search className="w-4 h-4 text-gray-400" />
                 <input 
                   placeholder="Buscar no estoque..." 
                   className="bg-transparent border-none outline-none text-xs font-bold text-gray-900 w-40"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              
              <button 
                onClick={() => setShowForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Novo Item
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acessando Banco de Dados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-[32px] p-4 shadow-premium border border-gray-100 hover:border-primary transition-all flex flex-col h-full">
                  <div className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 mb-4">
                    {product.imagemUrl ? (
                      <img src={product.imagemUrl} alt={product.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📦</div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-primary rounded-xl shadow-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-xl shadow-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex gap-1 mb-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ID: #{product.id}</p>
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">• {product.categoriaLanches || 'GERAL'}</span>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 line-clamp-1 mb-1">{product.nome}</h3>
                    <p className="text-[10px] font-medium text-gray-400 line-clamp-2 mb-4 h-8">{product.descricao}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                       <span className="text-sm font-black text-primary">R$ {product.preco.toFixed(2)}</span>
                       <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-black text-gray-900">{product.avaliacao ? product.avaliacao.toFixed(1) : '0.0'}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setShowForm(true)}
                className="group border-2 border-dashed border-gray-200 rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all min-h-[280px]"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Novo Produto</p>
              </button>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <ProductFormModal 
          product={editingProduct} 
          onSave={handleSave} 
          onClose={() => { setShowForm(false); setEditingProduct(null); }} 
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onSave, onClose }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imagemUrl || null);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const data = {
      ...product,
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      preco: parseFloat(formData.get('preco')),
      restaurante: formData.get('restaurante'),
      tempo_preparo: formData.get('tempo_preparo'),
      categoriaLanches: formData.get('categoriaLanches')
    };
    try {
      await onSave(data, imageFile);
      onClose();
    } catch (err) {
      alert('Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in-up">
      <div className="bg-white rounded-[40px] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Produto</label>
            <input name="nome" defaultValue={product?.nome} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descrição Detalhada</label>
            <textarea name="descricao" defaultValue={product?.descricao} required rows={3} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preço Unitário</label>
              <input name="preco" type="number" step="0.01" defaultValue={product?.preco} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Restaurante</label>
              <input name="restaurante" defaultValue={product?.restaurante} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
              <select name="categoriaLanches" defaultValue={product?.categoriaLanches} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm appearance-none">
                 <option value="PIIZAS">Pizzas</option>
                 <option value="HAMBURGUERES">Hambúrgueres</option>
                 <option value="JAPONESA">Japonesa</option>
                 <option value="BRASILEIRA">Brasileira</option>
                 <option value="SOBREMESAS">Sobremesas</option>
                 <option value="BEBIDAS">Bebidas</option>
                 <option value="SAUDÁVEL">Saudável</option>
                 <option value="LANCHES">Lanches</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempo de Preparo</label>
              <input name="tempo_preparo" defaultValue={product?.tempo_preparo} placeholder="ex: 20-30 min" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-primary font-bold text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagem do Produto</label>
            <div className="relative group">
              <input name="image" type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-all overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-primary" />
                    <p className="text-xs font-bold text-gray-500">Clique ou arraste para subir</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 disabled:opacity-50">
              {saving ? 'Salvando...' : (product ? 'Salvar Alterações' : 'Cadastrar Produto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}