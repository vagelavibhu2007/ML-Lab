import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Cpu,
  TrendingUp,
  Target,
  Plus,
  BarChart2,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useML } from '../context/MLContext';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { DatasetUploadModal } from '../components/datasets/DatasetUploadModal';
import { DatasetPreviewModal } from '../components/datasets/DatasetPreviewModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { datasets, trainedModels } = useML();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDataset, setPreviewDataset] = useState(null);

  // Statistics
  const totalDatasets = datasets.length;
  const totalModels = trainedModels.length;
  const regressionModels = trainedModels.filter((m) => m.task === 'Regression');
  const classificationModels = trainedModels.filter((m) => m.task === 'Classification');

  // Performance overview data (Top models)
  const performanceChartData = trainedModels.slice(0, 6).map((m) => ({
    name: m.name.length > 16 ? m.name.substring(0, 14) + '..' : m.name,
    score: m.task === 'Regression' ? m.metrics?.r2 || 0.85 : m.metrics?.accuracy || 0.88,
    metricType: m.task === 'Regression' ? 'R² Score' : 'Accuracy',
    task: m.task
  }));

  // Task distribution data
  const taskDistribution = [
    { name: 'Regression', value: regressionModels.length, color: '#2563eb' },
    { name: 'Classification', value: classificationModels.length, color: '#0d9488' }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Operational summary of loaded datasets, model benchmark metrics, and execution history."
        badge="Phase 1 Ready"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Upload Dataset</span>
            </button>
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Train Models</span>
            </button>
          </div>
        }
      />

      {/* Understated Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">ML Model Studio Environment:</span> Client-side training simulations and evaluations. Native Python/Scikit-learn model execution will integrate in Phase 2.
          </div>
        </div>
        <button
          onClick={() => navigate('/train')}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 shrink-0"
        >
          <span>Open Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Total Datasets"
          value={totalDatasets}
          subtitle="Available in workspace"
          icon={Database}
          tooltip="Total CSV datasets loaded and ready for ingestion."
        />
        <MetricCard
          title="Trained Models"
          value={totalModels}
          subtitle="Historical evaluations"
          icon={Cpu}
          tooltip="Total model pipeline executions stored in local history."
        />
        <MetricCard
          title="Regression Models"
          value={regressionModels.length}
          subtitle="Continuous targets"
          icon={TrendingUp}
          tooltip="Models evaluated on continuous targets (R², MAE, RMSE)."
        />
        <MetricCard
          title="Classification Models"
          value={classificationModels.length}
          subtitle="Categorical targets"
          icon={Target}
          tooltip="Models evaluated on discrete classes (Accuracy, F1, ROC-AUC)."
        />
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => setIsUploadOpen(true)}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dataset Manager</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Import and inspect CSV schemas</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>

        <div
          onClick={() => navigate('/train')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Multi-Model Training</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Select and train multiple algorithms</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>

        <div
          onClick={() => navigate('/comparison')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Model Comparison</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Benchmark metrics side-by-side</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Performance Overview Bar Chart */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Model Performance Benchmarks
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Primary validation scores across recently trained models
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Top 6 Models
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -25, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0.5, 1.0]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded-lg bg-slate-900 text-white text-xs shadow-lg space-y-0.5 border border-slate-800">
                          <div className="font-semibold">{data.name}</div>
                          <div className="text-slate-300">
                            {data.metricType}: <span className="font-mono font-bold text-blue-400">{(data.score * 100).toFixed(1)}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Task: {data.task}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {performanceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.task === 'Regression' ? '#2563eb' : '#0d9488'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-5 pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              <span>Regression (R² Score)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
              <span>Classification (Accuracy)</span>
            </div>
          </div>
        </div>

        {/* Task Distribution (Donut Chart) */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Task Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Distribution of trained pipelines</p>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-1.5 rounded-lg bg-slate-900 text-white text-xs border border-slate-800">
                          {data.name}: <span className="font-bold">{data.value} models</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-slate-700 dark:text-slate-300">Regression</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{regressionModels.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="text-slate-700 dark:text-slate-300">Classification</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{classificationModels.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Datasets & Recent Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Datasets Table */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Recent Datasets
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Datasets available for model training</p>
            </div>
            <button
              onClick={() => navigate('/datasets')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <span>View all ({datasets.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {datasets.slice(0, 4).map((ds) => (
              <div
                key={ds.id}
                onClick={() => setPreviewDataset(ds)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ds.name}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {ds.rows?.toLocaleString()} rows • {ds.columns} cols • {ds.task}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {ds.size}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Trained Models Table */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Recently Trained Models
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Latest pipeline executions and metrics</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <span>Audit history ({trainedModels.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {trainedModels.slice(0, 4).map((model) => {
              const primaryMetric =
                model.task === 'Regression'
                  ? `R²: ${model.metrics?.r2?.toFixed(3)}`
                  : `Acc: ${(model.metrics?.accuracy * 100)?.toFixed(1)}%`;

              return (
                <div
                  key={model.id}
                  onClick={() =>
                    navigate(model.task === 'Regression' ? '/regression' : '/classification')
                  }
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        model.task === 'Regression'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                          : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {model.name}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {model.algorithmName} • {model.datasetName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                      {primaryMetric}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DatasetUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <DatasetPreviewModal
        dataset={previewDataset}
        isOpen={Boolean(previewDataset)}
        onClose={() => setPreviewDataset(null)}
      />
    </div>
  );
};
