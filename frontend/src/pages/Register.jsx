import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../services/api';
import { User, Lock, Eye, EyeOff, Mail, Phone, CreditCard, ChevronLeft } from 'lucide-react';

export default function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Logic for admin flag based on email suffix (just like login might expect)
      const isAdmin = formData.email.includes('@admin');
      const payload = { ...formData, isAdmin };
      
      const user = await createUser(payload);
      setSuccess('Conta criada com sucesso!');
      
      // Auto login after 1.5 seconds
      setTimeout(() => {
        onRegister({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        });
        navigate(user.isAdmin ? '/admin' : '/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar conta. Verifique se o e-mail já está em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-white/20">
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all mb-6">
              <ChevronLeft className="w-5 h-5" />
              Voltar ao Login
            </Link>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Criar Conta</h1>
            <p className="text-gray-500 mt-2 font-medium">Junte-se ao Delivery Premium hoje.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome</label>
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all group overflow-hidden">
                  <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 text-sm font-bold"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">CPF</label>
                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all group overflow-hidden">
                  <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 text-sm font-bold"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all group overflow-hidden">
                <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 text-sm font-bold"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefone</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all group overflow-hidden">
                <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 text-sm font-bold"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-primary transition-all group overflow-hidden">
                <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 text-sm font-bold"
                  placeholder="Crie uma senha forte"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-2xl text-sm font-bold">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'CRIANDO CONTA...' : 'CADASTRAR AGORA'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-bold">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Faça Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
