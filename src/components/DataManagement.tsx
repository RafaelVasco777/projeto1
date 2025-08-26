import React from 'react';
import { Download, FileText } from 'lucide-react';

interface DataManagementProps {
  allData: Record<string, any[]>;
}

const DataManagement: React.FC<DataManagementProps> = ({ allData }) => {

  const exportToCsv = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Exportar Dados para CSV</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Exporte seus dados de renda e gastos para análise em planilhas como Excel ou Google Sheets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => exportToCsv(allData.salaries, 'salarios')}
            className="w-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 py-3 px-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <FileText className="w-5 h-5" />
            <span>Exportar Renda</span>
          </button>
          <button
            onClick={() => exportToCsv(allData.expenses, 'gastos')}
            className="w-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 py-3 px-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <FileText className="w-5 h-5" />
            <span>Exportar Gastos</span>
          </button>
        </div>
      </div>
       <div>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Backup na Nuvem</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Todos os seus dados agora são salvos automaticamente na nuvem. Não há necessidade de backups manuais.
        </p>
      </div>
    </div>
  );
};

export default DataManagement;
