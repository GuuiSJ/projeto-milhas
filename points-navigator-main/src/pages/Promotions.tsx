import { useState, useEffect } from 'react';
import { Gift, Calendar, Percent, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { promotionService } from '@/services/promotion.service';
import type { Promotion } from '@/types/dtos';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('active');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await promotionService.getAll();
      setPromotions(data);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      // Mock data for demo
      setPromotions([
        {
          id: '1',
          titulo: 'Bônus Triplo Livelo',
          descricao: 'Ganhe pontos em triplo em compras no varejo parceiro. Válido para todas as compras acima de R$ 100.',
          fatorBonus: 3,
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          ativo: true,
          programaPontos: { id: '1', nome: 'Livelo', fatorPadrao: 1, ativo: true },
        },
        {
          id: '2',
          titulo: 'Milhas Smiles em Dobro',
          descricao: 'Acumule o dobro de milhas em passagens aéreas GOL durante o período promocional.',
          fatorBonus: 2,
          dataInicio: '2024-02-01',
          dataFim: '2024-03-31',
          ativo: true,
          programaPontos: { id: '2', nome: 'Smiles', fatorPadrao: 1, ativo: true },
        },
        {
          id: '3',
          titulo: 'Esfera Premium',
          descricao: 'Promoção exclusiva para clientes Santander com cartões Black e Infinite.',
          fatorBonus: 2.5,
          dataInicio: '2024-01-15',
          dataFim: '2024-06-30',
          ativo: true,
          programaPontos: { id: '3', nome: 'Esfera', fatorPadrao: 1, ativo: true },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromotionStatus = (promo: Promotion) => {
    const now = new Date();
    const start = parseISO(promo.dataInicio);
    const end = parseISO(promo.dataFim);

    if (isBefore(now, start)) return 'upcoming';
    if (isAfter(now, end)) return 'expired';
    return 'active';
  };

  const filteredPromotions = promotions.filter(promo => {
    const status = getPromotionStatus(promo);
    if (filter === 'all') return true;
    if (filter === 'active') return status === 'active' || status === 'upcoming';
    return status === 'expired';
  });

  const statusStyles = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    upcoming: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    expired: 'bg-muted text-muted-foreground border-muted',
  };

  const statusLabels = {
    active: 'Ativa',
    upcoming: 'Em breve',
    expired: 'Expirada',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Promoções</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe as melhores ofertas para acumular pontos
          </p>
        </div>
        <Button variant="outline" onClick={fetchPromotions} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Ativas
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'expired' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('expired')}
        >
          Expiradas
        </Button>
      </div>

      {/* Promotions Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPromotions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Gift className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">Nenhuma promoção encontrada</h3>
            <p className="text-muted-foreground">
              {filter === 'expired' 
                ? 'Não há promoções expiradas' 
                : 'Volte em breve para novas ofertas'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPromotions.map((promo) => {
            const status = getPromotionStatus(promo);
            return (
              <Card 
                key={promo.id} 
                className={cn(
                  "transition-all duration-200 hover:shadow-lg overflow-hidden",
                  status === 'expired' && "opacity-60"
                )}
              >
                {promo.imagemUrl && (
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <img 
                      src={promo.imagemUrl} 
                      alt={promo.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!promo.imagemUrl && (
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Gift className="w-16 h-16 text-primary/30" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{promo.titulo}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={cn("flex-shrink-0", statusStyles[status])}
                    >
                      {statusLabels[status]}
                    </Badge>
                  </div>
                  {promo.programaPontos && (
                    <Badge variant="secondary" className="w-fit">
                      {promo.programaPontos.nome}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {promo.descricao}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Percent className="w-4 h-4" />
                      <span>{promo.fatorBonus}x pontos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(parseISO(promo.dataInicio), "dd/MM/yyyy", { locale: ptBR })} 
                      {' - '}
                      {format(parseISO(promo.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>

                  {status === 'active' && (
                    <Button className="w-full" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Aproveitar
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
