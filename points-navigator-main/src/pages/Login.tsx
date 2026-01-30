import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Plane, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, senha: password });
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao entrar',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">MilesApp</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Entre na sua conta para gerenciar suas milhas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <Link 
                  to="/esqueci-senha" 
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground mt-8">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-accent items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-lg animate-slide-up">
          <div className="w-24 h-24 rounded-3xl bg-primary-foreground/20 mx-auto mb-8 flex items-center justify-center backdrop-blur-xl">
            <Plane className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Gerencie suas milhas com inteligência
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Acompanhe pontos de todos os seus cartões, registre compras e maximize seus benefícios em um só lugar.
          </p>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-primary-foreground/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-primary-foreground/70">Pontos acumulados</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-primary-foreground/70">Cartões</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-xl rounded-xl p-4">
              <p className="text-3xl font-bold">R$5K</p>
              <p className="text-sm text-primary-foreground/70">Em benefícios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
