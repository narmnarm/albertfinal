import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlbertScoreManager } from '../lib/albertScore';
import { Asset, Debt, Transaction, FinancialGoal, FinancialState } from '@/types/finance';

const albertScoreManager = new AlbertScoreManager();

type AlbertScoreContextType = {
  score: number;
  financialState: FinancialState;
  addAsset: (asset: Asset) => void;
  addDebt: (debt: Debt) => void;
  addTransaction: (transaction: Transaction) => void;
  updateGoal: (goal: FinancialGoal) => void;
  updateFinancialState: (state: Partial<FinancialState>) => void;
  refreshScore: () => void;
};

const AlbertScoreContext = createContext<AlbertScoreContextType | undefined>(undefined);

export const AlbertScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<number>(albertScoreManager.getScore());
  const [financialState, setFinancialState] = useState<FinancialState>(albertScoreManager.getFinancialState());

  const refreshState = useCallback(() => {
    setScore(albertScoreManager.getScore());
    setFinancialState(albertScoreManager.getFinancialState());
  }, []);

  const addAsset = useCallback((asset: Asset) => {
    albertScoreManager.addAsset(asset);
    refreshState();
  }, [refreshState]);

  const addDebt = useCallback((debt: Debt) => {
    albertScoreManager.addDebt(debt);
    refreshState();
  }, [refreshState]);

  const addTransaction = useCallback((transaction: Transaction) => {
    albertScoreManager.addTransaction(transaction);
    refreshState();
  }, [refreshState]);

  const updateGoal = useCallback((goal: FinancialGoal) => {
    albertScoreManager.updateGoal(goal);
    refreshState();
  }, [refreshState]);

  const updateFinancialState = useCallback((state: Partial<FinancialState>) => {
    albertScoreManager.updateFinancialState(state);
    refreshState();
  }, [refreshState]);

  const contextValue = {
    score,
    financialState,
    addAsset,
    addDebt,
    addTransaction,
    updateGoal,
    updateFinancialState,
    refreshScore: refreshState
  };

  return (
    <AlbertScoreContext.Provider value={contextValue}>
      {children}
    </AlbertScoreContext.Provider>
  );
};

export const useAlbertScore = (): AlbertScoreContextType => {
  const context = useContext(AlbertScoreContext);
  if (!context) {
    throw new Error("useAlbertScore must be used within an AlbertScoreProvider");
  }
  return context;
};