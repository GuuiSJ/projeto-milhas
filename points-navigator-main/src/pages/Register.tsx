import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Plane, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/helpers';

export default function Register() {
  const { register, isAuthenticated, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordValidation = validatePassword(password);

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
    
    if (!passwordValidation.valid) {
      toast({
        title: 'Senha inválida',
        description: passwordValidation.message,
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Senhas não conferem',
        description: 'A confirmação de senha deve ser igual à senha.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await register({ nome: name, email, senha: password });
      toast({
        title: 'Conta criada!',
        description: 'Bem-vindo ao MilesApp.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar conta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: 'Mínimo 8 caracteres' },
    { met: /[A-Z]/.test(password), text: 'Uma letra maiúscula' },
    { met: /[a-z]/.test(password), text: 'Uma letra minúscula' },
    { met: /[0-9]/.test(password), text: 'Um número' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent to-success items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-lg animate-slide-up">
          <div className="w-24 h-24 rounded-3xl bg-primary-foreground/20 mx-auto mb-8 flex items-center justify-center backdrop-blur-xl">
            <Plane className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Comece a acumular pontos hoje
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Cadastre-se gratuitamente e tenha controle total sobre suas milhas e pontos de cartões de crédito.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              'Cadastre múltiplos cartões',
              'Acompanhe pontos em tempo real',
              'Receba alertas de vencimento',
              'Exporte relatórios detalhados',
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-xl rounded-xl p-4"
              >
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
              Criar conta
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para começar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João Silva"
                required
                className="input-field"
              />
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
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
              
              {/* Password requirements */}
              {password && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {passwordRequirements.map((req, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                      {req.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field"
              />
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
                  Criar conta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground mt-8">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
