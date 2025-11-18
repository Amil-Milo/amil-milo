import { useState, useCallback } from 'react';
import { goalsApi } from '@/lib/api';
import { toast } from 'sonner';

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  endDate: string | null;
  progress?: number;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // MODO DEMO - DADOS MOCKADOS
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockGoals: Goal[] = [
        {
          id: 1,
          title: "Beber 2L de água por dia",
          description: "Meta de hidratação diária",
          status: "COMPLETED",
          endDate: null,
          progress: 100,
        },
        {
          id: 2,
          title: "Caminhada de 30 minutos",
          description: "Exercício físico regular",
          status: "ACTIVE",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 70,
        },
        {
          id: 3,
          title: "Evitar sal em excesso",
          description: "Redução de sódio na alimentação",
          status: "ACTIVE",
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 45,
        },
      ];

      setGoals(mockGoals);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar metas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (data: { title: string; description?: string; endDate?: string }) => {
    setLoading(true);
    setError(null);
    try {
      // MODO DEMO - SIMULA CRIAÇÃO
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newGoal: Goal = {
        id: Date.now(),
        title: data.title,
        description: data.description || null,
        status: 'ACTIVE',
        endDate: data.endDate || null,
        progress: 0,
      };

      setGoals(prev => [newGoal, ...prev]);
      toast.success('Meta criada com sucesso!');
      return newGoal;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar meta';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateGoal = useCallback(async (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      // MODO DEMO - SIMULA ATUALIZAÇÃO
      await new Promise((resolve) => setTimeout(resolve, 300));

      let updatedGoal: Goal | undefined;
      setGoals(prev => prev.map(goal => {
        if (goal.id === id) {
          updatedGoal = {
            ...goal,
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.endDate !== undefined && { endDate: data.endDate }),
            ...(data.status && { status: data.status as 'ACTIVE' | 'COMPLETED' | 'CANCELLED' }),
          };
          return updatedGoal;
        }
        return goal;
      }));

      toast.success('Meta atualizada com sucesso!');
      return updatedGoal;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar meta';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteGoal = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // MODO DEMO - SIMULA EXCLUSÃO
      await new Promise((resolve) => setTimeout(resolve, 300));

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Meta excluída com sucesso!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao excluir meta';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleGoalStatus = useCallback(async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
    await updateGoal(id, { status: newStatus });
  }, [updateGoal]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStatus,
  };
}

