import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../types';
import { getCategoryLabel, formatCurrency } from '../utils/formatters';
import { getExpensesByCategory } from '../utils/calculations';

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const categoryData = getExpensesByCategory(expenses);

  const COLORS = ['#059669', '#dc2626', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#14b8a6'];

  const chartData = categoryData.map((item, index) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">{payload[0].name}</p>
          <p className="text-primary text-sm font-medium">
            Valor: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-4 px-2">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-300 truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
        Gastos por Categoria
      </h2>
      
      {categoryData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-center text-neutral-500 dark:text-neutral-400">
          <p className="font-semibold">Nenhum gasto para exibir no gráfico.</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={window.innerWidth > 640 ? 100 : 80}
                innerRadius={window.innerWidth > 640 ? 60 : 40}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
