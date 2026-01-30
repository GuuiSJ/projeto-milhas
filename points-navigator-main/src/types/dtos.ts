// User DTOs
export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateProfileRequest {
  nome?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

// Bandeira DTOs
export interface Bandeira {
  id: string;
  nome: string;
  logoUrl?: string;
  ativo: boolean;
}

export interface BandeiraRequest {
  nome: string;
  logoUrl?: string;
}

// Programa de Pontos DTOs
export interface ProgramaPontos {
  id: string;
  nome: string;
  descricao?: string;
  logoUrl?: string;
  fatorPadrao: number;
  ativo: boolean;
}

export interface ProgramaPontosRequest {
  nome: string;
  descricao?: string;
  logoUrl?: string;
  fatorPadrao: number;
}

// Card DTOs
export interface Card {
  id: string;
  nomePersonalizado: string;
  ultimosDigitos: string;
  fatorConversao: number;
  bandeira: Bandeira;
  programaPontos: ProgramaPontos;
  saldoPontos: number;
  ativo: boolean;
  createdAt: string;
}

export interface CardRequest {
  nomePersonalizado: string;
  ultimosDigitos: string;
  fatorConversao: number;
  bandeiraId: string;
  progPontosId: string;
}

// Buy/Purchase DTOs
export interface Buy {
  id: string;
  valor: number;
  dataCompra: string;
  dataPrevCredito: string;
  diasParaCredito: number;
  pontosCalculados: number;
  status: 'PENDENTE' | 'CREDITADO' | 'CANCELADO';
  descricao?: string;
  comprovanteUrl?: string;
  card: Card;
  createdAt: string;
}

export interface BuyRequest {
  valor: number;
  dataCompra: string;
  descricao?: string;
  cardId: string;
}

// Dashboard DTOs
export interface DashboardData {
  totalPontos: number;
  totalPontosChange: number;
  cartoesAtivos: number;
  pontosPendentes: number;
  pontosVencer: number;
  prazoMedioRecebimento: number;
  pontosPorCartao: PontosPorCartao[];
  historicoMensal: HistoricoMensal[];
  ultimasCompras: Buy[];
}

export interface PontosPorCartao {
  cardId: string;
  cardNome: string;
  programaNome: string;
  pontos: number;
  percentual: number;
}

export interface HistoricoMensal {
  mes: string;
  pontos: number;
  compras: number;
}

// Notification DTOs
export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'AVISO' | 'ALERTA' | 'PROMOCAO';
  lida: boolean;
  createdAt: string;
}

// Promotion DTOs
export interface Promotion {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl?: string;
  programaPontos?: ProgramaPontos;
  fatorBonus: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

// Report DTOs
export interface ReportFilters {
  dataInicio?: string;
  dataFim?: string;
  cardId?: string;
  status?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// API Error
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
