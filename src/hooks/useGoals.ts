import { useState, useCallback, useEffect } from 'react';
import { goalsApi } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await goalsApi.getGoals();
      setGoals(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar metas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchGoals();
    }
  }, [isAuthenticated, authLoading, fetchGoals]);

  const createGoal = useCallback(async (data: { title: string; description?: string; endDate?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const newGoal = await goalsApi.createGoal(data);
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
      const updatedGoal = await goalsApi.updateGoal(id, data);
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
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
      await goalsApi.deleteGoal(id);
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

