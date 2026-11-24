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
  Sparkles,
  Layers,
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

  // Chart data: Performance across top models
  const performanceChartData = trainedModels.slice(0, 6).map((m) => ({
    name: m.name.length > 15 ? m.name.substring(0, 13) + '...' : m.name,
    score: m.task === 'Regression' ? m.metrics?.r2 || 0.85 : m.metrics?.accuracy || 0.88,
    metricType: m.task === 'Regression' ? 'R² Score' : 'Accuracy',
    task: m.task
  }));

  // Pie chart data: Task Distribution
  const taskDistribution = [
    { name: 'Regression', value: regressionModels.length, color: '#2563eb' },
    { name: 'Classification', value: classificationModels.length, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Machine Learning Dashboard"
        subtitle="Live platform summary of loaded datasets, active models and performance benchmarks."
        badge="Phase 1 Prototype"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload Dataset</span>
            </button>
            <button
              onClick={() => navigate('/train')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Train New Model</span>
            </button>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-100 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">
              Interactive Frontend Development Phase (Phase 1)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Local datasets and client-side simulated ML models. Full Scikit-learn and XGBoost backend training will integrate in Phase 2.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate('/train')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline whitespace-nowrap"
          >
            <span>Launch Training Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Datasets"
          value={totalDatasets}
          subtitle="Ready for model ingestion"
          icon={Database}
          change="+2 new"
          isPositive={true}
          tooltip="Total CSV and Excel datasets currently available in your workspace."
        />
        <MetricCard
          title="Trained Models"
          value={totalModels}
          subtitle="Evaluated & benchmarked"
          icon={Cpu}
          change="+4 this week"
          isPositive={true}
          tooltip="Total historical model artifacts configured and trained in this session."
        />
        <MetricCard
          title="Regression Models"
          value={regressionModels.length}
          subtitle="Continuous target modeling"
          icon={TrendingUp}
          tooltip="Models trained on continuous targets (R², MAE, MSE, RMSE)."
        />
        <MetricCard
          title="Classification Models"
          value={classificationModels.length}
          subtitle="Categorical & binary targets"
          icon={Target}
          tooltip="Models trained on discrete targets (Accuracy, F1, ROC-AUC)."
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setIsUploadOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Upload Dataset</h3>
              <p className="text-[11px] text-slate-500">Import CSV or Excel files with auto schema</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => navigate('/train')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Train New Model</h3>
              <p className="text-[11px] text-slate-500">Pick algorithm & tune hyperparameters</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => navigate('/comparison')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Compare Models</h3>
              <p className="text-[11px] text-slate-500">Benchmark metrics side-by-side</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Charts Section: Model Performance & Task Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Performance Overview (Bar Chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Model Performance Overview</h3>
              <p className="text-xs text-slate-500">Primary validation score (R² for Regression, Accuracy for Classification)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Top 6 Models
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis
                  domain={[0.5, 1.0]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl">
                          <div className="font-semibold">{data.name}</div>
                          <div className="text-slate-300 mt-1">
                            {data.metricType}: <span className="text-blue-400 font-mono font-bold">{(data.score * 100).toFixed(1)}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Task: {data.task}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {performanceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.task === 'Regression' ? '#2563eb' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-blue-600" />
              <span>Regression Models (R² Score)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span>Classification Models (Accuracy)</span>
            </div>
          </div>
        </div>

        {/* Task Distribution (Donut Chart) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Task Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown of models by learning objective</p>
          </div>

          <div className="h-48 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
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
                        <div className="p-2 rounded-lg bg-slate-900 text-white text-xs">
                          <span>{data.name}: </span>
                          <span className="font-bold">{data.value} models</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-700">Regression</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{regressionModels.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Classification</span>
              </div>
              <span className="font-mono font-semibold text-slate-900">{classificationModels.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Datasets & Recent Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Datasets */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recent Datasets</h3>
              <p className="text-xs text-slate-500">Datasets uploaded and ready for training</p>
            </div>
            <button
              onClick={() => navigate('/datasets')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all ({datasets.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {datasets.slice(0, 4).map((ds) => (
              <div
                key={ds.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/70 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                onClick={() => setPreviewDataset(ds)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {ds.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {ds.rows?.toLocaleString()} rows • {ds.columns} cols • {ds.task}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {ds.size}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Trained Models */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recently Trained Models</h3>
              <p className="text-xs text-slate-500">Latest pipeline executions and metrics</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Audit history ({trainedModels.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {trainedModels.slice(0, 4).map((model) => {
              const primaryMetric =
                model.task === 'Regression'
                  ? `R²: ${model.metrics?.r2?.toFixed(3)}`
                  : `Acc: ${(model.metrics?.accuracy * 100)?.toFixed(1)}%`;

              return (
                <div
                  key={model.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/70 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                  onClick={() =>
                    navigate(model.task === 'Regression' ? '/regression' : '/classification')
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        model.task === 'Regression'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {model.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {model.algorithmName} • {model.datasetName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {primaryMetric}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
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
