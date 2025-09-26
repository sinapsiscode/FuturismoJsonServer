import BaseService from './baseService';

// Mock data para transacciones financieras de guías
const MOCK_EXPENSES = [
  {
    id: 1,
    category: 'transport',
    description: 'Gasolina para tour Miraflores',
    amount: 120,
    date: '2024-01-15',
    tourId: 'TOUR-001',
    guideId: 'guide-1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    category: 'food',
    description: 'Almuerzo durante tour',
    amount: 85,
    date: '2024-01-15',
    tourId: 'TOUR-001',
    guideId: 'guide-1',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 3,
    category: 'materials',
    description: 'Folletos informativos',
    amount: 45,
    date: '2024-01-14',
    tourId: null,
    guideId: 'guide-1',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z'
  },
  {
    id: 4,
    category: 'equipment',
    description: 'Micrófono portátil',
    amount: 250,
    date: '2024-01-10',
    tourId: null,
    guideId: 'guide-1',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z'
  },
  {
    id: 5,
    category: 'communication',
    description: 'Recarga celular',
    amount: 30,
    date: '2024-01-12',
    tourId: 'TOUR-002',
    guideId: 'guide-1',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-12T08:00:00Z'
  }
];

const MOCK_INCOME = [
  {
    id: 1,
    description: 'Tour Miraflores - Familia González',
    amount: 680,
    date: '2024-01-15',
    tourId: 'TOUR-001',
    type: 'tour',
    guideId: 'guide-1',
    clientId: 'client-1',
    commissionRate: 0.15,
    commission: 102,
    createdAt: '2024-01-15T18:00:00Z',
    updatedAt: '2024-01-15T18:00:00Z'
  },
  {
    id: 2,
    description: 'Tour Centro de Lima - Empresa ABC',
    amount: 490,
    date: '2024-01-14',
    tourId: 'TOUR-002',
    type: 'tour',
    guideId: 'guide-1',
    clientId: 'client-2',
    commissionRate: 0.15,
    commission: 73.5,
    createdAt: '2024-01-14T17:30:00Z',
    updatedAt: '2024-01-14T17:30:00Z'
  },
  {
    id: 3,
    description: 'Consultoría turística - Hotel Plaza',
    amount: 300,
    date: '2024-01-12',
    tourId: null,
    type: 'consulting',
    guideId: 'guide-1',
    clientId: 'client-3',
    commissionRate: 0.10,
    commission: 30,
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z'
  },
  {
    id: 4,
    description: 'Capacitación guías junior - Agencia XYZ',
    amount: 450,
    date: '2024-01-10',
    tourId: null,
    type: 'training',
    guideId: 'guide-1',
    clientId: 'client-4',
    commissionRate: 0.0,
    commission: 450,
    createdAt: '2024-01-10T15:00:00Z',
    updatedAt: '2024-01-10T15:00:00Z'
  }
];

const EXPENSE_CATEGORIES = [
  { value: 'transport', label: 'Transporte', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
  { value: 'food', label: 'Alimentación', icon: '🍽️', color: 'bg-green-100 text-green-800' },
  { value: 'materials', label: 'Materiales', icon: '📋', color: 'bg-purple-100 text-purple-800' },
  { value: 'accommodation', label: 'Hospedaje', icon: '🏨', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'equipment', label: 'Equipamiento', icon: '🎒', color: 'bg-red-100 text-red-800' },
  { value: 'communication', label: 'Comunicación', icon: '📱', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'insurance', label: 'Seguros', icon: '🛡️', color: 'bg-gray-100 text-gray-800' },
  { value: 'other', label: 'Otros', icon: '💼', color: 'bg-pink-100 text-pink-800' }
];

const INCOME_TYPES = [
  { value: 'tour', label: 'Tour Guiado', icon: '🗺️' },
  { value: 'consulting', label: 'Consultoría', icon: '💼' },
  { value: 'training', label: 'Capacitación', icon: '📚' },
  { value: 'other', label: 'Otros', icon: '💰' }
];

class MockFinancialService extends BaseService {
  constructor() {
    super();
    this.expenses = [...MOCK_EXPENSES];
    this.income = [...MOCK_INCOME];
    this.categories = [...EXPENSE_CATEGORIES];
    this.incomeTypes = [...INCOME_TYPES];
    this.nextExpenseId = Math.max(...this.expenses.map(e => e.id)) + 1;
    this.nextIncomeId = Math.max(...this.income.map(i => i.id)) + 1;
    this.initializeStorage();
  }

  initializeStorage() {
    try {
      const storedExpenses = localStorage.getItem('mock_guide_expenses');
      const storedIncome = localStorage.getItem('mock_guide_income');
      
      if (storedExpenses) {
        this.expenses = JSON.parse(storedExpenses);
        this.nextExpenseId = Math.max(...this.expenses.map(e => e.id)) + 1;
      }
      
      if (storedIncome) {
        this.income = JSON.parse(storedIncome);
        this.nextIncomeId = Math.max(...this.income.map(i => i.id)) + 1;
      }
    } catch (error) {
      console.warn('Error loading financial data from localStorage:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('mock_guide_expenses', JSON.stringify(this.expenses));
      localStorage.setItem('mock_guide_income', JSON.stringify(this.income));
    } catch (error) {
      console.warn('Error saving financial data to localStorage:', error);
    }
  }

  // Métodos para gastos
  async getExpenses(filters = {}) {
    await this.simulateNetworkDelay();

    try {
      let filtered = [...this.expenses];
      
      // Filtrar por guía
      if (filters.guideId) {
        filtered = filtered.filter(expense => expense.guideId === filters.guideId);
      }
      
      // Filtrar por categoría
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(expense => expense.category === filters.category);
      }
      
      // Filtrar por tour
      if (filters.tourId) {
        filtered = filtered.filter(expense => expense.tourId === filters.tourId);
      }
      
      // Filtrar por rango de fechas
      if (filters.startDate) {
        filtered = filtered.filter(expense => expense.date >= filters.startDate);
      }
      
      if (filters.endDate) {
        filtered = filtered.filter(expense => expense.date <= filters.endDate);
      }
      
      // Ordenar por fecha (más reciente primero)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Paginación
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return this.success(paginatedData, {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      });
    } catch (error) {
      return this.error('Error al obtener gastos', error);
    }
  }

  async createExpense(expenseData) {
    await this.simulateNetworkDelay();

    try {
      const newExpense = {
        id: this.nextExpenseId++,
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.expenses.push(newExpense);
      this.saveToStorage();

      return this.success(newExpense);
    } catch (error) {
      return this.error('Error al crear gasto', error);
    }
  }

  async updateExpense(id, updates) {
    await this.simulateNetworkDelay();

    try {
      const index = this.expenses.findIndex(expense => expense.id === parseInt(id));
      
      if (index === -1) {
        return this.error('Gasto no encontrado');
      }

      this.expenses[index] = {
        ...this.expenses[index],
        ...updates,
        amount: updates.amount ? parseFloat(updates.amount) : this.expenses[index].amount,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();

      return this.success(this.expenses[index]);
    } catch (error) {
      return this.error('Error al actualizar gasto', error);
    }
  }

  async deleteExpense(id) {
    await this.simulateNetworkDelay();

    try {
      const index = this.expenses.findIndex(expense => expense.id === parseInt(id));
      
      if (index === -1) {
        return this.error('Gasto no encontrado');
      }

      this.expenses.splice(index, 1);
      this.saveToStorage();

      return this.success({ deleted: true });
    } catch (error) {
      return this.error('Error al eliminar gasto', error);
    }
  }

  // Métodos para ingresos
  async getIncome(filters = {}) {
    await this.simulateNetworkDelay();

    try {
      let filtered = [...this.income];
      
      // Filtrar por guía
      if (filters.guideId) {
        filtered = filtered.filter(income => income.guideId === filters.guideId);
      }
      
      // Filtrar por tipo
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(income => income.type === filters.type);
      }
      
      // Filtrar por tour
      if (filters.tourId) {
        filtered = filtered.filter(income => income.tourId === filters.tourId);
      }
      
      // Filtrar por rango de fechas
      if (filters.startDate) {
        filtered = filtered.filter(income => income.date >= filters.startDate);
      }
      
      if (filters.endDate) {
        filtered = filtered.filter(income => income.date <= filters.endDate);
      }
      
      // Ordenar por fecha (más reciente primero)
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Paginación
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return this.success(paginatedData, {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      });
    } catch (error) {
      return this.error('Error al obtener ingresos', error);
    }
  }

  async createIncome(incomeData) {
    await this.simulateNetworkDelay();

    try {
      const newIncome = {
        id: this.nextIncomeId++,
        ...incomeData,
        amount: parseFloat(incomeData.amount),
        commission: incomeData.commission ? parseFloat(incomeData.commission) : 0,
        commissionRate: incomeData.commissionRate ? parseFloat(incomeData.commissionRate) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.income.push(newIncome);
      this.saveToStorage();

      return this.success(newIncome);
    } catch (error) {
      return this.error('Error al crear ingreso', error);
    }
  }

  async updateIncome(id, updates) {
    await this.simulateNetworkDelay();

    try {
      const index = this.income.findIndex(income => income.id === parseInt(id));
      
      if (index === -1) {
        return this.error('Ingreso no encontrado');
      }

      this.income[index] = {
        ...this.income[index],
        ...updates,
        amount: updates.amount ? parseFloat(updates.amount) : this.income[index].amount,
        commission: updates.commission ? parseFloat(updates.commission) : this.income[index].commission,
        commissionRate: updates.commissionRate ? parseFloat(updates.commissionRate) : this.income[index].commissionRate,
        updatedAt: new Date().toISOString()
      };

      this.saveToStorage();

      return this.success(this.income[index]);
    } catch (error) {
      return this.error('Error al actualizar ingreso', error);
    }
  }

  async deleteIncome(id) {
    await this.simulateNetworkDelay();

    try {
      const index = this.income.findIndex(income => income.id === parseInt(id));
      
      if (index === -1) {
        return this.error('Ingreso no encontrado');
      }

      this.income.splice(index, 1);
      this.saveToStorage();

      return this.success({ deleted: true });
    } catch (error) {
      return this.error('Error al eliminar ingreso', error);
    }
  }

  // Métodos para categorías y tipos
  async getExpenseCategories() {
    await this.simulateNetworkDelay();
    return this.success(this.categories);
  }

  async getIncomeTypes() {
    await this.simulateNetworkDelay();
    return this.success(this.incomeTypes);
  }

  // Métodos para estadísticas
  async getFinancialStats(filters = {}) {
    await this.simulateNetworkDelay();

    try {
      let expenses = [...this.expenses];
      let income = [...this.income];
      
      // Aplicar filtros
      if (filters.guideId) {
        expenses = expenses.filter(e => e.guideId === filters.guideId);
        income = income.filter(i => i.guideId === filters.guideId);
      }
      
      if (filters.startDate) {
        expenses = expenses.filter(e => e.date >= filters.startDate);
        income = income.filter(i => i.date >= filters.startDate);
      }
      
      if (filters.endDate) {
        expenses = expenses.filter(e => e.date <= filters.endDate);
        income = income.filter(i => i.date <= filters.endDate);
      }
      
      // Calcular totales
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncome = income.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);
      const totalCommission = income.reduce((sum, incomeItem) => sum + (incomeItem.commission || 0), 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
      
      // Gastos por categoría
      const expensesByCategory = expenses.reduce((acc, expense) => {
        const category = this.categories.find(cat => cat.value === expense.category);
        const categoryName = category ? category.label : 'Otros';
        acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
        return acc;
      }, {});
      
      // Ingresos por tipo
      const incomeByType = income.reduce((acc, incomeItem) => {
        const type = this.incomeTypes.find(t => t.value === incomeItem.type);
        const typeName = type ? type.label : 'Otros';
        acc[typeName] = (acc[typeName] || 0) + incomeItem.amount;
        return acc;
      }, {});
      
      const stats = {
        totalExpenses,
        totalIncome,
        totalCommission,
        netProfit,
        profitMargin: parseFloat(profitMargin.toFixed(1)),
        expensesByCategory,
        incomeByType,
        toursCount: income.filter(i => i.type === 'tour').length,
        averageIncomePerTour: income.length > 0 ? totalIncome / income.length : 0
      };
      
      return this.success(stats);
    } catch (error) {
      return this.error('Error al calcular estadísticas financieras', error);
    }
  }

  // Método para exportar datos
  async exportFinancialData(filters = {}) {
    await this.simulateNetworkDelay();

    try {
      const expensesResult = await this.getExpenses(filters);
      const incomeResult = await this.getIncome(filters);
      
      if (!expensesResult.success || !incomeResult.success) {
        return this.error('Error al obtener datos para exportar');
      }
      
      const data = {
        expenses: expensesResult.data,
        income: incomeResult.data,
        exportDate: new Date().toISOString(),
        filters
      };
      
      return this.success(data);
    } catch (error) {
      return this.error('Error al exportar datos financieros', error);
    }
  }

  // Método para simular guardado de cálculo de calculadora
  async saveCalculation(calculationData) {
    await this.simulateNetworkDelay();

    try {
      const { income: incomeAmount, expenses: expensesList, tourId, description } = calculationData;
      const today = new Date().toISOString().split('T')[0];
      const calculationId = `CALC-${Date.now()}`;
      
      // Crear ingreso
      const newIncome = {
        id: this.nextIncomeId++,
        description: description || `Tour calculado - ${new Date().toLocaleDateString()}`,
        amount: parseFloat(incomeAmount),
        date: today,
        tourId: tourId || calculationId,
        type: 'tour',
        guideId: calculationData.guideId || 'guide-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.income.push(newIncome);
      
      // Crear gastos
      const newExpenses = [];
      if (expensesList && expensesList.length > 0) {
        expensesList.forEach((expense, index) => {
          if (expense.amount > 0) {
            newExpenses.push({
              id: this.nextExpenseId + index,
              category: expense.category,
              description: expense.description || `${expense.category} (calculadora)`,
              amount: parseFloat(expense.amount),
              date: today,
              tourId: tourId || calculationId,
              guideId: calculationData.guideId || 'guide-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        });
        
        this.expenses.push(...newExpenses);
        this.nextExpenseId += newExpenses.length;
      }
      
      this.saveToStorage();
      
      return this.success({
        income: newIncome,
        expenses: newExpenses,
        calculationId
      });
    } catch (error) {
      return this.error('Error al guardar cálculo', error);
    }
  }
}

// Crear instancia del servicio
const mockFinancialService = new MockFinancialService();

export { mockFinancialService, EXPENSE_CATEGORIES, INCOME_TYPES };
export default mockFinancialService;