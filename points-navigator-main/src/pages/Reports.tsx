import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, TrendingUp } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HistoryChart } from '@/components/charts/HistoryChart';
import { PointsChart } from '@/components/charts/PointsChart';
import { formatCurrency, formatDate, formatPoints, downloadFile } from '@/utils/helpers';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockHistory = [
  { id: '1', date: '2026-01-25', description: 'Mercado Livre', card: 'Nubank Ultravioleta', value: 450.00, points: 900, status: 'pendente' as const },
  { id: '2', date: '2026-01-20', description: 'Amazon', card: 'BTG Pactual Black', value: 1200.00, points: 3600, status: 'creditado' as const },
  { id: '3', date: '2026-01-18', description: 'iFood', card: 'Itaú Personnalité', value: 89.90, points: 134, status: 'creditado' as const },
  { id: '4', date: '2026-01-10', description: 'Booking.com', card: 'Nubank Ultravioleta', value: 3500.00, points: 7000, status: 'pendente' as const },
  { id: '5', date: '2026-01-08', description: 'Uber', card: 'Itaú Personnalité', value: 45.50, points: 68, status: 'creditado' as const },
  { id: '6', date: '2026-01-05', description: 'Rappi', card: 'BTG Pactual Black', value: 120.00, points: 360, status: 'creditado' as const },
  { id: '7', date: '2025-12-28', description: 'Magazine Luiza', card: 'Nubank Ultravioleta', value: 890.00, points: 1780, status: 'creditado' as const },
  { id: '8', date: '2025-12-22', description: 'Americanas', card: 'Itaú Personnalité', value: 230.00, points: 345, status: 'creditado' as const },
];

const mockChartData = [
  { month: 'Ago', points: 18000 },
  { month: 'Set', points: 15000 },
  { month: 'Out', points: 22000 },
  { month: 'Nov', points: 28000 },
  { month: 'Dez', points: 35000 },
  { month: 'Jan', points: 42000 },
];

const mockPieData = [
  { name: 'Nubank Ultravioleta', value: 9680 },
  { name: 'BTG Pactual Black', value: 3960 },
  { name: 'Itaú Personnalité', value: 547 },
];

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCard, setSelectedCard] = useState('all');

  const filteredHistory = mockHistory.filter(item => {
    const itemDate = new Date(item.date);
    const matchesDateRange = 
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate));
    const matchesCard = selectedCard === 'all' || item.card === selectedCard;
    return matchesDateRange && matchesCard;
  });

  const columns = [
    { 
      key: 'date', 
      header: 'Data',
      render: (item: typeof mockHistory[0]) => formatDate(item.date)
    },
    { 
      key: 'description', 
      header: 'Descrição',
      render: (item: typeof mockHistory[0]) => (
        <span className="font-medium">{item.description}</span>
      )
    },
    { 
      key: 'card', 
      header: 'Cartão',
      className: 'hidden md:table-cell'
    },
    { 
      key: 'value', 
      header: 'Valor',
      render: (item: typeof mockHistory[0]) => formatCurrency(item.value)
    },
    { 
      key: 'points', 
      header: 'Pontos',
      render: (item: typeof mockHistory[0]) => (
        <span className="font-medium text-primary">+{formatPoints(item.points)}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: typeof mockHistory[0]) => <StatusBadge status={item.status} />
    },
  ];

  const totalPoints = filteredHistory.reduce((sum, item) => sum + item.points, 0);
  const totalValue = filteredHistory.reduce((sum, item) => sum + item.value, 0);

  const handleExportPDF = () => {
    toast({
      title: 'Exportando PDF',
      description: 'O arquivo será baixado em instantes.',
    });
    // In production, call the API: reportsAPI.exportPDF({ startDate, endDate })
  };

  const handleExportCSV = () => {
    // Generate CSV content
    const headers = ['Data', 'Descrição', 'Cartão', 'Valor', 'Pontos', 'Status'];
    const rows = filteredHistory.map(item => [
      formatDate(item.date),
      item.description,
      item.card,
      item.value.toString(),
      item.points.toString(),
      item.status,
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `relatorio-milhas-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: 'CSV exportado!',
      description: 'O arquivo foi baixado com sucesso.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada do seu histórico de pontos
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Pontos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatPoints(totalPoints)}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Total em Compras</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Média por Compra</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatPoints(Math.round(totalPoints / filteredHistory.length || 0))} pts
          </p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {(totalPoints / totalValue || 0).toFixed(2)} pts/R$
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Evolução Mensal
          </h3>
          <HistoryChart data={mockChartData} />
        </div>
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Distribuição por Cartão
          </h3>
          <PointsChart data={mockPieData} />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cartão</label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos os cartões</option>
              <option value="Nubank Ultravioleta">Nubank Ultravioleta</option>
              <option value="BTG Pactual Black">BTG Pactual Black</option>
              <option value="Itaú Personnalité">Itaú Personnalité</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Histórico Completo</h3>
        <DataTable
          columns={columns}
          data={filteredHistory}
          emptyMessage="Nenhum registro encontrado para os filtros selecionados"
        />
      </div>
    </div>
  );
}
