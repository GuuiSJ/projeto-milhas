import { useState } from 'react';
import { Plus, Search, Filter, X, Upload, Eye } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FileUpload } from '@/components/ui/FileUpload';
import { formatCurrency, formatDate, formatPoints } from '@/utils/helpers';
import { toast } from '@/hooks/use-toast';

interface Purchase {
  id: string;
  description: string;
  value: number;
  date: string;
  cardId: string;
  cardName: string;
  points: number;
  expectedCreditDate: string;
  status: 'pendente' | 'creditado' | 'expirado';
  receipt?: string;
}

// Mock data
const mockCards = [
  { id: '1', name: 'Nubank Ultravioleta', pointsPerReal: 2 },
  { id: '2', name: 'Itaú Personnalité', pointsPerReal: 1.5 },
  { id: '3', name: 'BTG Pactual Black', pointsPerReal: 3 },
];

const initialPurchases: Purchase[] = [
  { id: '1', description: 'Mercado Livre', value: 450.00, date: '2026-01-25', cardId: '1', cardName: 'Nubank Ultravioleta', points: 900, expectedCreditDate: '2026-02-25', status: 'pendente' },
  { id: '2', description: 'Amazon', value: 1200.00, date: '2026-01-20', cardId: '3', cardName: 'BTG Pactual Black', points: 3600, expectedCreditDate: '2026-02-20', status: 'creditado' },
  { id: '3', description: 'iFood', value: 89.90, date: '2026-01-18', cardId: '2', cardName: 'Itaú Personnalité', points: 134, expectedCreditDate: '2026-02-18', status: 'creditado' },
  { id: '4', description: 'Booking.com', value: 3500.00, date: '2026-01-10', cardId: '1', cardName: 'Nubank Ultravioleta', points: 7000, expectedCreditDate: '2026-02-10', status: 'pendente' },
  { id: '5', description: 'Uber', value: 45.50, date: '2026-01-08', cardId: '2', cardName: 'Itaú Personnalité', points: 68, expectedCreditDate: '2026-02-08', status: 'expirado' },
];

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: '',
    cardId: '',
  });

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          purchase.cardName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      key: 'description', 
      header: 'Descrição',
      render: (item: Purchase) => (
        <div>
          <span className="font-medium text-foreground">{item.description}</span>
          {item.receipt && (
            <span className="ml-2 text-xs text-primary">📎</span>
          )}
        </div>
      )
    },
    { 
      key: 'value', 
      header: 'Valor',
      render: (item: Purchase) => formatCurrency(item.value)
    },
    { 
      key: 'date', 
      header: 'Data',
      render: (item: Purchase) => formatDate(item.date)
    },
    { 
      key: 'cardName', 
      header: 'Cartão',
      className: 'hidden md:table-cell'
    },
    { 
      key: 'points', 
      header: 'Pontos',
      render: (item: Purchase) => (
        <span className="font-medium text-primary">+{formatPoints(item.points)}</span>
      )
    },
    { 
      key: 'expectedCreditDate', 
      header: 'Previsão Crédito',
      className: 'hidden lg:table-cell',
      render: (item: Purchase) => formatDate(item.expectedCreditDate)
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: Purchase) => <StatusBadge status={item.status} />
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const card = mockCards.find(c => c.id === formData.cardId);
    if (!card) return;

    const value = parseFloat(formData.value);
    const points = Math.floor(value * card.pointsPerReal);
    const expectedDate = new Date(formData.date);
    expectedDate.setMonth(expectedDate.getMonth() + 1);

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      description: formData.description,
      value,
      date: formData.date,
      cardId: formData.cardId,
      cardName: card.name,
      points,
      expectedCreditDate: expectedDate.toISOString().split('T')[0],
      status: 'pendente',
      receipt: selectedFile ? selectedFile.name : undefined,
    };

    setPurchases([newPurchase, ...purchases]);
    toast({
      title: 'Compra registrada!',
      description: `${formatPoints(points)} pontos serão creditados em ${formatDate(expectedDate)}.`,
    });

    setIsModalOpen(false);
    setFormData({ description: '', value: '', date: '', cardId: '' });
    setSelectedFile(null);
  };

  const pendingPoints = purchases
    .filter(p => p.status === 'pendente')
    .reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compras</h1>
          <p className="text-muted-foreground">
            {purchases.length} compras · {formatPoints(pendingPoints)} pontos pendentes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nova Compra
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-3 shadow-card flex-1 max-w-md">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar compras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-3 shadow-card">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-foreground"
          >
            <option value="all">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="creditado">Creditado</option>
            <option value="expirado">Expirado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredPurchases}
        emptyMessage="Nenhuma compra encontrada"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
              <h2 className="text-xl font-semibold text-foreground">Nova Compra</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Mercado Livre"
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0,00"
                    required
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cartão Utilizado
                </label>
                <select
                  value={formData.cardId}
                  onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
                  required
                  className="input-field"
                >
                  <option value="">Selecione um cartão</option>
                  {mockCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} ({card.pointsPerReal}x pontos)
                    </option>
                  ))}
                </select>
              </div>

              {/* Points Preview */}
              {formData.value && formData.cardId && (
                <div className="bg-success/10 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">Pontos esperados:</p>
                  <p className="text-2xl font-bold text-success">
                    +{formatPoints(
                      Math.floor(
                        parseFloat(formData.value) * 
                        (mockCards.find(c => c.id === formData.cardId)?.pointsPerReal || 0)
                      )
                    )} pontos
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Comprovante (opcional)
                </label>
                <FileUpload
                  onFileSelect={setSelectedFile}
                  accept=".pdf,.png,.jpg,.jpeg"
                  maxSize={5}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
