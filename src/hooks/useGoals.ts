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
      const response = await goalsApi.getGoals();
      setGoals(response.data || response || []);
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao carregar metas");
      setGoals([]);
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
      const response = await goalsApi.createGoal(data);
      const newGoal = response.data || response;
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Meta criada com sucesso!');
      setLoading(false);
      return newGoal;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao criar meta";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  const updateGoal = useCallback(async (id: number, data: { title?: string; description?: string; endDate?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await goalsApi.updateGoal(id, data);
      const updatedGoal = response.data || response;
      setGoals(prev => prev.map(goal => goal.id === id ? updatedGoal : goal));
      toast.success('Meta atualizada com sucesso!');
      setLoading(false);
      return updatedGoal;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar meta";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteGoal = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await goalsApi.deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Meta excluída com sucesso!');
      setLoading(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao excluir meta";
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw error;
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

