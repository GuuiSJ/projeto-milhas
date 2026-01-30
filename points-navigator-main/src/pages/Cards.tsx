import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { CreditCardDisplay } from '@/components/ui/CreditCardDisplay';
import { formatPoints } from '@/utils/helpers';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Card {
  id: string;
  name: string;
  brand: string;
  lastDigits: string;
  program: string;
  points: number;
  expiryDate: string;
}

// Mock data
const initialCards: Card[] = [
  { id: '1', name: 'Nubank Ultravioleta', brand: 'mastercard', lastDigits: '4589', program: 'Livelo', points: 45230, expiryDate: '12/28' },
  { id: '2', name: 'Itaú Personnalité', brand: 'visa', lastDigits: '7821', program: 'Iupp', points: 23100, expiryDate: '08/27' },
  { id: '3', name: 'BTG Pactual Black', brand: 'mastercard', lastDigits: '3345', program: 'Esfera', points: 67500, expiryDate: '03/29' },
  { id: '4', name: 'Santander Unlimited', brand: 'visa', lastDigits: '9012', program: 'Esfera', points: 12800, expiryDate: '11/26' },
  { id: '5', name: 'Bradesco Elo', brand: 'elo', lastDigits: '5678', program: 'Livelo', points: 8900, expiryDate: '06/27' },
];

const programs = ['Livelo', 'Iupp', 'Esfera', 'Smiles', 'TudoAzul'];
const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

export default function Cards() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    lastDigits: '',
    program: '',
    expiryDate: '',
  });

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPoints = cards.reduce((sum, card) => sum + card.points, 0);

  const openModal = (card?: Card) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        name: card.name,
        brand: card.brand,
        lastDigits: card.lastDigits,
        program: card.program,
        expiryDate: card.expiryDate,
      });
    } else {
      setEditingCard(null);
      setFormData({
        name: '',
        brand: '',
        lastDigits: '',
        program: '',
        expiryDate: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCard) {
      setCards(cards.map(card => 
        card.id === editingCard.id 
          ? { ...card, ...formData }
          : card
      ));
      toast({
        title: 'Cartão atualizado!',
        description: 'As informações foram salvas com sucesso.',
      });
    } else {
      const newCard: Card = {
        id: Date.now().toString(),
        ...formData,
        points: 0,
      };
      setCards([...cards, newCard]);
      toast({
        title: 'Cartão cadastrado!',
        description: 'O cartão foi adicionado com sucesso.',
      });
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    toast({
      title: 'Cartão removido',
      description: 'O cartão foi excluído com sucesso.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Cartões</h1>
          <p className="text-muted-foreground">
            {cards.length} cartões · {formatPoints(totalPoints)} pontos no total
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Novo Cartão
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-3 shadow-card max-w-md">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar cartões..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div key={card.id} className="relative group">
            <CreditCardDisplay
              name={card.name}
              brand={card.brand}
              lastDigits={card.lastDigits}
              program={card.program}
              points={card.points}
              expiryDate={card.expiryDate}
            />
            
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openModal(card)}
                className="p-2 bg-primary-foreground/20 backdrop-blur-xl rounded-lg hover:bg-primary-foreground/30 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-primary-foreground" />
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="p-2 bg-destructive/20 backdrop-blur-xl rounded-lg hover:bg-destructive/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cartão encontrado</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome do Cartão
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Nubank Ultravioleta"
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Bandeira
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand.toLowerCase()}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Últimos 4 dígitos
                  </label>
                  <input
                    type="text"
                    value={formData.lastDigits}
                    onChange={(e) => setFormData({ ...formData, lastDigits: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="0000"
                    maxLength={4}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Programa de Pontos
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    {programs.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Validade
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setFormData({ ...formData, expiryDate: value });
                    }}
                    placeholder="MM/AA"
                    maxLength={5}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingCard ? 'Salvar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
