import { useState } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Gift, 
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/StatCard';
import { CreditCardDisplay } from '@/components/ui/CreditCardDisplay';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { PointsChart } from '@/components/charts/PointsChart';
import { HistoryChart } from '@/components/charts/HistoryChart';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate, formatPoints } from '@/utils/helpers';

// Mock data
const mockCards = [
  { id: '1', name: 'Nubank Ultravioleta', brand: 'mastercard', lastDigits: '4589', program: 'Livelo', points: 45230 },
  { id: '2', name: 'Itaú Personnalité', brand: 'visa', lastDigits: '7821', program: 'Iupp', points: 23100 },
  { id: '3', name: 'BTG Pactual Black', brand: 'mastercard', lastDigits: '3345', program: 'Esfera', points: 67500 },
];

const mockPointsData = [
  { name: 'Livelo', value: 45230 },
  { name: 'Iupp', value: 23100 },
  { name: 'Esfera', value: 67500 },
];

const mockHistoryData = [
  { month: 'Jul', points: 12000 },
  { month: 'Ago', points: 18000 },
  { month: 'Set', points: 15000 },
  { month: 'Out', points: 22000 },
  { month: 'Nov', points: 28000 },
  { month: 'Dez', points: 35000 },
  { month: 'Jan', points: 42000 },
];

const mockPurchases = [
  { id: '1', description: 'Mercado Livre', value: 450.00, date: '2026-01-25', card: 'Nubank Ultravioleta', points: 900, status: 'pendente' as const },
  { id: '2', description: 'Amazon', value: 1200.00, date: '2026-01-20', card: 'BTG Pactual Black', points: 2400, status: 'creditado' as const },
  { id: '3', description: 'iFood', value: 89.90, date: '2026-01-18', card: 'Itaú Personnalité', points: 179, status: 'creditado' as const },
  { id: '4', description: 'Booking.com', value: 3500.00, date: '2026-01-10', card: 'Nubank Ultravioleta', points: 10500, status: 'pendente' as const },
];

const purchaseColumns = [
  { 
    key: 'description', 
    header: 'Descrição',
    render: (item: typeof mockPurchases[0]) => (
      <span className="font-medium">{item.description}</span>
    )
  },
  { 
    key: 'value', 
    header: 'Valor',
    render: (item: typeof mockPurchases[0]) => formatCurrency(item.value)
  },
  { 
    key: 'date', 
    header: 'Data',
    render: (item: typeof mockPurchases[0]) => formatDate(item.date)
  },
  { 
    key: 'card', 
    header: 'Cartão',
    className: 'hidden md:table-cell'
  },
  { 
    key: 'points', 
    header: 'Pontos',
    render: (item: typeof mockPurchases[0]) => (
      <span className="font-medium text-primary">+{formatPoints(item.points)}</span>
    )
  },
  { 
    key: 'status', 
    header: 'Status',
    render: (item: typeof mockPurchases[0]) => <StatusBadge status={item.status} />
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(true);

  const totalPoints = mockCards.reduce((sum, card) => sum + card.points, 0);
  const avgCreditDays = 15;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {user?.nome?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus pontos e milhas em tempo real
          </p>
        </div>
        <Link
          to="/compras"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nova Compra
        </Link>
      </div>

      {/* Alert */}
      {showAlert && (
        <AlertBanner
          type="warning"
          title="Pontos prestes a vencer"
          message="Você tem 5.000 pontos no programa Livelo que vencem em 7 dias."
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Pontos"
          value={formatPoints(totalPoints)}
          subtitle="Em todos os programas"
          icon={Gift}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Cartões Ativos"
          value={mockCards.length}
          subtitle="Programas vinculados"
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="Pontos este Mês"
          value={formatPoints(14500)}
          subtitle="+23% vs mês anterior"
          icon={TrendingUp}
          trend={{ value: 23, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Prazo Médio"
          value={`${avgCreditDays} dias`}
          subtitle="Para crédito de pontos"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Cards and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cards Carousel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Meus Cartões</h2>
            <Link 
              to="/cartoes"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {mockCards.slice(0, 2).map((card) => (
              <CreditCardDisplay
                key={card.id}
                name={card.name}
                brand={card.brand}
                lastDigits={card.lastDigits}
                program={card.program}
                points={card.points}
              />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points Distribution */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Pontos por Programa
            </h3>
            <PointsChart data={mockPointsData} />
          </div>

          {/* History Chart */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Histórico de Acúmulo
            </h3>
            <HistoryChart data={mockHistoryData} />
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Compras Recentes</h2>
          <Link 
            to="/compras"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <DataTable
          columns={purchaseColumns}
          data={mockPurchases}
        />
      </div>
    </div>
  );
}
