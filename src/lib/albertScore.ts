import { Asset, Debt, Transaction, FinancialGoal, FinancialState } from '@/types/finance';

export type UserEvent = {
  type: string;
  weight: number;
  timestamp: Date;
};

// Constants for scoring
const CASH_ASSET_ID = 'cash-on-hand';
const NECESSARY_CATEGORIES = [
  'Housing', 'Utilities', 'Groceries', 'Healthcare',
  'Transportation', 'Insurance', 'Education', 'Childcare'
];
const DISCRETIONARY_CATEGORIES = [
  'Dining', 'Entertainment', 'Shopping', 'Travel',
  'Subscription', 'Hobby', 'Luxury'
];
const HIGH_INTEREST_THRESHOLD = 10; // 10% interest rate is considered high

export class AlbertScoreManager {
  private events: UserEvent[] = [];
  private financialState: FinancialState = {
    assets: [{
      id: CASH_ASSET_ID,
      name: 'Cash on Hand',
      value: 0,
      type: 'cash',
      lastUpdated: new Date()
    }],
    debts: [],
    transactions: [],
    goals: []
  };

  // Update financial state and recalculate score
  updateFinancialState(newState: Partial<FinancialState>): void {
    this.financialState = { ...this.financialState, ...newState };
    this.recalculateScore();
  }

  // Update cash on hand based on a transaction
  private updateCashOnHand(transaction: Transaction): void {
    const cashAsset = this.financialState.assets.find(a => a.id === CASH_ASSET_ID);
    if (cashAsset) {
      cashAsset.value += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      cashAsset.lastUpdated = new Date();
    }
  }

  // Add individual components
  addAsset(asset: Asset): void {
    if (asset.id === CASH_ASSET_ID) {
      return; // Prevent manual modification of cash on hand
    }
    this.financialState.assets.push(asset);
    this.addEvent({ type: 'asset_added', weight: 3, timestamp: new Date() });
  }

  addDebt(debt: Debt): void {
    this.financialState.debts.push(debt);
    // Weight based on interest rate
    const weight = debt.interestRate > HIGH_INTEREST_THRESHOLD ? -5 : -2;
    this.addEvent({ type: 'debt_added', weight, timestamp: new Date() });
  }

  addTransaction(transaction: Transaction): void {
    this.financialState.transactions.push(transaction);
    this.updateCashOnHand(transaction);
    const weight = this.calculateTransactionWeight(transaction);
    this.addEvent({
      type: 'transaction',
      weight,
      timestamp: new Date()
    });
  }

  updateGoal(goal: FinancialGoal): void {
    const existingGoal = this.financialState.goals.find(g => g.id === goal.id);
    if (existingGoal) {
      Object.assign(existingGoal, goal);
    } else {
      this.financialState.goals.push(goal);
    }
    this.recalculateScore();
  }

  private addEvent(event: UserEvent): void {
    this.events.push(event);
    this.recalculateScore();
  }

  private calculateTransactionWeight(transaction: Transaction): number {
    const monthlyIncome = this.calculateMonthlyIncome();
    let weight = 0;
    
    if (transaction.type === 'income') {
      weight = 2; // Base weight for income
    } else {
      // Differentiate necessary vs. discretionary expenses
      if (NECESSARY_CATEGORIES.includes(transaction.category)) {
        weight = -1;
      } else if (DISCRETIONARY_CATEGORIES.includes(transaction.category)) {
        weight = -2;
      } else {
        weight = -1.5;
      }
      
      // Additional penalty for recurring discretionary expenses
      if (DISCRETIONARY_CATEGORIES.includes(transaction.category)) {
        const similarTransactions = this.getRecentSimilarTransactions(transaction);
        if (similarTransactions.length >= 3) {
          weight -= 1;
        }
      }
    }
    
    // Amplify weight based on transaction size relative to monthly income
    if (monthlyIncome > 0) {
      const ratio = Math.abs(transaction.amount) / monthlyIncome;
      if (ratio > 0.5) {
        if (transaction.type === 'income') {
          weight *= 2;
        } else if (DISCRETIONARY_CATEGORIES.includes(transaction.category)) {
          weight *= 3;
        } else {
          weight *= 1.5;
        }
      }
    }
    
    // Bonus for income transactions that are savings/investment
    if (['Savings', 'Investment'].includes(transaction.category) && transaction.type === 'income') {
      weight += 3;
    }
    
    return weight;
  }

  // Find similar recent transactions (last 60 days)
  private getRecentSimilarTransactions(transaction: Transaction): Transaction[] {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    return this.financialState.transactions.filter(t =>
      t.type === 'expense' &&
      t.category === transaction.category &&
      t.date >= sixtyDaysAgo &&
      t.id !== transaction.id
    );
  }

  private calculateMonthlyIncome(): number {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    
    return this.financialState.transactions
      .filter(t => t.type === 'income' && t.date >= monthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private calculateMonthlyExpenses(): number {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    
    return this.financialState.transactions
      .filter(t => t.type === 'expense' && t.date >= monthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  // Calculate savings rate: (income - expenses) / income
  private calculateSavingsRate(): number {
    const monthlyIncome = this.calculateMonthlyIncome();
    const monthlyExpenses = this.calculateMonthlyExpenses();
    if (monthlyIncome <= 0) return 0;
    return Math.max(0, (monthlyIncome - monthlyExpenses) / monthlyIncome);
  }

  // Weighted average interest rate for debts
  private calculateWeightedInterestRate(): number {
    const totalDebt = this.financialState.debts.reduce((sum, d) => sum + d.amount, 0);
    if (totalDebt === 0) return 0;
    const weightedSum = this.financialState.debts.reduce(
      (sum, debt) => sum + (debt.amount * debt.interestRate),
      0
    );
    return weightedSum / totalDebt;
  }

  // Calculate debt-to-income ratio
  private calculateDebtToIncomeRatio(): number {
    const monthlyIncome = this.calculateMonthlyIncome();
    if (monthlyIncome <= 0) return Infinity;
    const monthlyDebtPayments = this.financialState.debts.reduce(
      (sum, debt) => sum + debt.minimumPayment,
      0
    );
    return monthlyDebtPayments / monthlyIncome;
  }

  // Analyze spending trends over the last few months
  private analyzeSpendingTrends(): {
    increasingDiscretionary: boolean;
    discretionaryRatio: number;
  } {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    const recentTransactions = this.financialState.transactions.filter(t => t.date >= threeMonthsAgo);
    
    const recentDiscretionary = recentTransactions
      .filter(t =>
        t.type === 'expense' &&
        DISCRETIONARY_CATEGORIES.includes(t.category) &&
        t.date >= oneMonthAgo
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousDiscretionary = recentTransactions
      .filter(t =>
        t.type === 'expense' &&
        DISCRETIONARY_CATEGORIES.includes(t.category) &&
        t.date < oneMonthAgo
      )
      .reduce((sum, t) => sum + t.amount, 0) / 2; // average monthly
    
    const totalRecentSpending = recentTransactions
      .filter(t => t.type === 'expense' && t.date >= oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      increasingDiscretionary: recentDiscretionary > previousDiscretionary * 1.2, // 20% threshold
      discretionaryRatio: totalRecentSpending > 0 ? recentDiscretionary / totalRecentSpending : 0
    };
  }

  // Evaluate income stability using the coefficient of variation (CV)
  private evaluateIncomeStability(): number {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const incomeTransactions = this.financialState.transactions
      .filter(t => t.type === 'income' && t.date >= sixMonthsAgo);
    
    if (incomeTransactions.length < 3) return 0; // Not enough data
    
    const monthlyIncomes: Record<string, number> = {};
    incomeTransactions.forEach(transaction => {
      const yearMonth = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`;
      monthlyIncomes[yearMonth] = (monthlyIncomes[yearMonth] || 0) + transaction.amount;
    });
    
    const incomeValues = Object.values(monthlyIncomes);
    if (incomeValues.length < 2) return 0;
    
    const mean = incomeValues.reduce((sum, val) => sum + val, 0) / incomeValues.length;
    const variance = incomeValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / incomeValues.length;
    const std = Math.sqrt(variance);
    const cv = mean > 0 ? std / mean : 1;
    
    // More stable income yields a higher score (0 to 1 mapped to 0-10)
    return Math.max(0, Math.min(1, 1 - cv));
  }

  // New component: Emergency Fund Score (max 20 points)
  private calculateEmergencyFundScore(): number {
    const cashOnHand = this.financialState.assets.find(a => a.id === CASH_ASSET_ID)?.value || 0;
    const monthlyExpenses = this.calculateMonthlyExpenses();
    if (monthlyExpenses === 0) return 0;
    const monthsOfCash = cashOnHand / monthlyExpenses;
    // Award full 20 points if you have 6 months or more; otherwise, scale linearly.
    return Math.min(20, (monthsOfCash / 6) * 20);
  }

  // New component: Debt Structure Score (max 25 points)
  private calculateDebtStructureScore(): number {
    let score = 0;
    const totalAssets = this.financialState.assets.reduce((sum, a) => sum + a.value, 0);
    const totalDebts = this.financialState.debts.reduce((sum, d) => sum + d.amount, 0);
    
    // Debt-to-asset: Full 10 points if ratio is at least 2:1
    if (totalDebts > 0) {
      const ratio = totalAssets / totalDebts;
      score += 10 * Math.min(1, ratio / 2);
    } else if (totalAssets > 0) {
      score += 10;
    }
    
    // Debt-to-income: Full 10 points if DTI is 0.36 or lower; decreases linearly to 0 at DTI=1
    const dti = this.calculateDebtToIncomeRatio();
    if (dti < Infinity) {
      const dtiScore = dti <= 0.36 ? 10 : Math.max(0, 10 * (1 - (dti - 0.36) / (1 - 0.36)));
      score += dtiScore;
    }
    
    // Interest rate penalty: subtract up to 5 points for high average interest rates
    const avgInterest = this.calculateWeightedInterestRate();
    let interestPenalty = 0;
    if (avgInterest > HIGH_INTEREST_THRESHOLD) {
      interestPenalty = Math.min(5, (avgInterest - HIGH_INTEREST_THRESHOLD) / 2);
    }
    score -= interestPenalty;
    
    return Math.max(0, Math.min(25, score));
  }

  // New component: Savings Behavior Score (max 20 points)
  private calculateSavingsBehaviorScore(): number {
    const savingsRate = this.calculateSavingsRate();
    // Achieving a 20% savings rate yields full points; otherwise, scale linearly.
    return Math.min(20, (savingsRate / 0.2) * 20);
  }

  // New component: Spending Analysis Score (max 15 points)
  private calculateSpendingAnalysisScore(): number {
    const trends = this.analyzeSpendingTrends();
    let score = 0;
    // For discretionary ratio: 0 ratio = full 10 points, 50% ratio = 0 points.
    const discretionaryScore = Math.max(0, 10 * (1 - (trends.discretionaryRatio / 0.5)));
    score += discretionaryScore;
    // Bonus 5 points if discretionary spending isn’t trending upward.
    if (!trends.increasingDiscretionary) {
      score += 5;
    }
    return score;
  }

  // New component: Income Stability Score (max 10 points)
  private calculateIncomeStabilityScore(): number {
    const stability = this.evaluateIncomeStability();
    return stability * 10;
  }

  // New component: Goal Progress Score (max 10 points)
  private calculateGoalProgressScore(): number {
    if (this.financialState.goals.length === 0) return 0;
    const goalProgress = this.financialState.goals.reduce((sum, goal) => {
      return sum + Math.min(1, goal.currentAmount / goal.targetAmount);
    }, 0) / this.financialState.goals.length;
    return goalProgress * 10;
  }

  // Core base score calculation (sums components, max 100 points)
  private calculateBaseScore(): number {
    const emergencyScore = this.calculateEmergencyFundScore();
    const debtScore = this.calculateDebtStructureScore();
    const savingsScore = this.calculateSavingsBehaviorScore();
    const spendingScore = this.calculateSpendingAnalysisScore();
    const incomeScore = this.calculateIncomeStabilityScore();
    const goalScore = this.calculateGoalProgressScore();
    
    return emergencyScore + debtScore + savingsScore + spendingScore + incomeScore + goalScore;
  }

  // Revised event modifier: exponential decay on older events
  private calculateEventModifier(): number {
    const now = Date.now();
    let modifier = 0;
    for (const event of this.events) {
      const ageDays = (now - event.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const decayFactor = Math.exp(-0.1 * ageDays);
      modifier += event.weight * decayFactor;
    }
    // Clamp modifier to ±10
    return Math.min(10, Math.max(-10, modifier));
  }

  // Recalculate overall score by combining base score and event modifier
  private recalculateScore(): void {
    const baseScore = this.calculateBaseScore();
    const eventModifier = this.calculateEventModifier();
    this._currentScore = Math.min(100, Math.max(0, baseScore + eventModifier));
  }

  private _currentScore: number = 50;

  public getScore(): number {
    return Math.round(this._currentScore);
  }

  public getFinancialState(): FinancialState {
    return { ...this.financialState };
  }
}