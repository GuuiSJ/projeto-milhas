import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Award, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminService } from '@/services/admin.service';
import type { Bandeira, BandeiraRequest, ProgramaPontos, ProgramaPontosRequest } from '@/types/dtos';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('bandeiras');

  // Bandeiras state
  const [bandeiras, setBandeiras] = useState<Bandeira[]>([]);
  const [isLoadingBandeiras, setIsLoadingBandeiras] = useState(true);
  const [bandeiraDialog, setBandeiraDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: Bandeira }>({
    open: false,
    mode: 'create',
  });
  const [bandeiraForm, setBandeiraForm] = useState<BandeiraRequest>({ nome: '', logoUrl: '' });
  const [deleteBandeiraId, setDeleteBandeiraId] = useState<string | null>(null);

  // Programas state
  const [programas, setProgramas] = useState<ProgramaPontos[]>([]);
  const [isLoadingProgramas, setIsLoadingProgramas] = useState(true);
  const [programaDialog, setProgramaDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; data?: ProgramaPontos }>({
    open: false,
    mode: 'create',
  });
  const [programaForm, setProgramaForm] = useState<ProgramaPontosRequest>({ nome: '', descricao: '', logoUrl: '', fatorPadrao: 1 });
  const [deleteProgramaId, setDeleteProgramaId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBandeiras();
    fetchProgramas();
  }, []);

  // Bandeiras functions
  const fetchBandeiras = async () => {
    setIsLoadingBandeiras(true);
    try {
      const data = await adminService.bandeiras.getAll();
      setBandeiras(data);
    } catch (error) {
      // Mock data
      setBandeiras([
        { id: '1', nome: 'Visa', ativo: true },
        { id: '2', nome: 'Mastercard', ativo: true },
        { id: '3', nome: 'American Express', ativo: true },
        { id: '4', nome: 'Elo', ativo: true },
      ]);
    } finally {
      setIsLoadingBandeiras(false);
    }
  };

  const openBandeiraDialog = (mode: 'create' | 'edit', data?: Bandeira) => {
    setBandeiraDialog({ open: true, mode, data });
    setBandeiraForm(data ? { nome: data.nome, logoUrl: data.logoUrl } : { nome: '', logoUrl: '' });
  };

  const saveBandeira = async () => {
    if (!bandeiraForm.nome.trim()) {
      toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      if (bandeiraDialog.mode === 'create') {
        await adminService.bandeiras.create(bandeiraForm);
        toast({ title: 'Sucesso', description: 'Bandeira criada com sucesso' });
      } else if (bandeiraDialog.data) {
        await adminService.bandeiras.update(bandeiraDialog.data.id, bandeiraForm);
        toast({ title: 'Sucesso', description: 'Bandeira atualizada com sucesso' });
      }
      fetchBandeiras();
      setBandeiraDialog({ open: false, mode: 'create' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar bandeira', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBandeira = async () => {
    if (!deleteBandeiraId) return;
    try {
      await adminService.bandeiras.delete(deleteBandeiraId);
      toast({ title: 'Sucesso', description: 'Bandeira excluída com sucesso' });
      fetchBandeiras();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir bandeira', variant: 'destructive' });
    } finally {
      setDeleteBandeiraId(null);
    }
  };

  // Programas functions
  const fetchProgramas = async () => {
    setIsLoadingProgramas(true);
    try {
      const data = await adminService.programas.getAll();
      setProgramas(data);
    } catch (error) {
      // Mock data
      setProgramas([
        { id: '1', nome: 'Livelo', descricao: 'Programa de pontos Livelo', fatorPadrao: 1, ativo: true },
        { id: '2', nome: 'Smiles', descricao: 'Milhas aéreas GOL', fatorPadrao: 1, ativo: true },
        { id: '3', nome: 'Esfera', descricao: 'Programa Santander', fatorPadrao: 1, ativo: true },
        { id: '4', nome: 'TudoAzul', descricao: 'Milhas aéreas Azul', fatorPadrao: 1, ativo: true },
      ]);
    } finally {
      setIsLoadingProgramas(false);
    }
  };

  const openProgramaDialog = (mode: 'create' | 'edit', data?: ProgramaPontos) => {
    setProgramaDialog({ open: true, mode, data });
    setProgramaForm(data 
      ? { nome: data.nome, descricao: data.descricao, logoUrl: data.logoUrl, fatorPadrao: data.fatorPadrao } 
      : { nome: '', descricao: '', logoUrl: '', fatorPadrao: 1 }
    );
  };

  const savePrograma = async () => {
    if (!programaForm.nome.trim()) {
      toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      if (programaDialog.mode === 'create') {
        await adminService.programas.create(programaForm);
        toast({ title: 'Sucesso', description: 'Programa criado com sucesso' });
      } else if (programaDialog.data) {
        await adminService.programas.update(programaDialog.data.id, programaForm);
        toast({ title: 'Sucesso', description: 'Programa atualizado com sucesso' });
      }
      fetchProgramas();
      setProgramaDialog({ open: false, mode: 'create' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar programa', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const deletePrograma = async () => {
    if (!deleteProgramaId) return;
    try {
      await adminService.programas.delete(deleteProgramaId);
      toast({ title: 'Sucesso', description: 'Programa excluído com sucesso' });
      fetchProgramas();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir programa', variant: 'destructive' });
    } finally {
      setDeleteProgramaId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Administração</h1>
          <p className="text-muted-foreground">Gerencie bandeiras e programas de pontos</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="bandeiras" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Bandeiras
          </TabsTrigger>
          <TabsTrigger value="programas" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Programas
          </TabsTrigger>
        </TabsList>

        {/* Bandeiras Tab */}
        <TabsContent value="bandeiras" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Bandeiras de Cartão</h2>
            <Button onClick={() => openBandeiraDialog('create')}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Bandeira
            </Button>
          </div>

          {isLoadingBandeiras ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bandeiras.map((bandeira) => (
                <Card key={bandeira.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{bandeira.nome}</h3>
                          <Badge variant={bandeira.ativo ? 'default' : 'secondary'}>
                            {bandeira.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openBandeiraDialog('edit', bandeira)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteBandeiraId(bandeira.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Programas Tab */}
        <TabsContent value="programas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Programas de Pontos</h2>
            <Button onClick={() => openProgramaDialog('create')}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Programa
            </Button>
          </div>

          {isLoadingProgramas ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {programas.map((programa) => (
                <Card key={programa.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Award className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{programa.nome}</h3>
                          {programa.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {programa.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{programa.fatorPadrao}x</Badge>
                            <Badge variant={programa.ativo ? 'default' : 'secondary'}>
                              {programa.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openProgramaDialog('edit', programa)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setDeleteProgramaId(programa.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Bandeira Dialog */}
      <Dialog open={bandeiraDialog.open} onOpenChange={(open) => setBandeiraDialog({ ...bandeiraDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bandeiraDialog.mode === 'create' ? 'Nova Bandeira' : 'Editar Bandeira'}
            </DialogTitle>
            <DialogDescription>
              {bandeiraDialog.mode === 'create' 
                ? 'Adicione uma nova bandeira de cartão' 
                : 'Atualize os dados da bandeira'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bandeira-nome">Nome *</Label>
              <Input
                id="bandeira-nome"
                value={bandeiraForm.nome}
                onChange={(e) => setBandeiraForm({ ...bandeiraForm, nome: e.target.value })}
                placeholder="Ex: Visa, Mastercard..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bandeira-logo">URL do Logo</Label>
              <Input
                id="bandeira-logo"
                value={bandeiraForm.logoUrl || ''}
                onChange={(e) => setBandeiraForm({ ...bandeiraForm, logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBandeiraDialog({ open: false, mode: 'create' })}>
              Cancelar
            </Button>
            <Button onClick={saveBandeira} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Programa Dialog */}
      <Dialog open={programaDialog.open} onOpenChange={(open) => setProgramaDialog({ ...programaDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {programaDialog.mode === 'create' ? 'Novo Programa' : 'Editar Programa'}
            </DialogTitle>
            <DialogDescription>
              {programaDialog.mode === 'create' 
                ? 'Adicione um novo programa de pontos' 
                : 'Atualize os dados do programa'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programa-nome">Nome *</Label>
              <Input
                id="programa-nome"
                value={programaForm.nome}
                onChange={(e) => setProgramaForm({ ...programaForm, nome: e.target.value })}
                placeholder="Ex: Livelo, Smiles..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programa-descricao">Descrição</Label>
              <Input
                id="programa-descricao"
                value={programaForm.descricao || ''}
                onChange={(e) => setProgramaForm({ ...programaForm, descricao: e.target.value })}
                placeholder="Descrição do programa..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programa-fator">Fator Padrão</Label>
              <Input
                id="programa-fator"
                type="number"
                step="0.1"
                min="0.1"
                value={programaForm.fatorPadrao}
                onChange={(e) => setProgramaForm({ ...programaForm, fatorPadrao: parseFloat(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programa-logo">URL do Logo</Label>
              <Input
                id="programa-logo"
                value={programaForm.logoUrl || ''}
                onChange={(e) => setProgramaForm({ ...programaForm, logoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramaDialog({ open: false, mode: 'create' })}>
              Cancelar
            </Button>
            <Button onClick={savePrograma} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Bandeira Confirmation */}
      <AlertDialog open={!!deleteBandeiraId} onOpenChange={() => setDeleteBandeiraId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Bandeira</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta bandeira? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBandeira} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Programa Confirmation */}
      <AlertDialog open={!!deleteProgramaId} onOpenChange={() => setDeleteProgramaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Programa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este programa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deletePrograma} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
