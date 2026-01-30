import { useState } from 'react';
import { User, Mail, Lock, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/helpers';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Profile form
  const [name, setName] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      // In production, call API: authAPI.updateProfile({ nome, email })
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ nome: name, email });
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      toast({
        title: 'Senha inválida',
        description: validation.message,
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Senhas não conferem',
        description: 'A confirmação deve ser igual à nova senha.',
        variant: 'destructive',
      });
      return;
    }

    setSavingPassword(true);

    try {
      // In production, call API: authAPI.changePassword(currentPassword, newPassword)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Senha alterada!',
        description: 'Sua nova senha está ativa.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Erro ao alterar senha',
        description: 'Verifique a senha atual e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e segurança
        </p>
      </div>

      {/* Avatar Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.nome}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Conta Premium
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'profile' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Dados Pessoais
          </span>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-3 font-medium transition-colors relative ${
            activeTab === 'password' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Segurança
          </span>
          {activeTab === 'password' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-card rounded-xl p-6 shadow-card space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {savingProfile ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      )}

      {/* Password Form */}
      {activeTab === 'password' && (
        <form onSubmit={handleChangePassword} className="bg-card rounded-xl p-6 shadow-card space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nova Senha
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirmar Nova Senha
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {savingPassword ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Alterar Senha
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
