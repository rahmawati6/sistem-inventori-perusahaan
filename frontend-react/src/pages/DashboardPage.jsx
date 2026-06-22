import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Package, Layers, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from 'lucide-react';

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#22c55e', '#8b5cf6', '#ef4444',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316'
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /></div>;
  }

  if (!data) {
    return <div className="empty-state"><p>Gagal memuat data dashboard</p></div>;
  }

  // Format chart data for monthly stock in/out
  const labels = data.monthly_stock_in?.labels || [];
  const stockInData = data.monthly_stock_in?.data || [];
  const stockOutData = data.monthly_stock_out?.data || [];

  const monthlyData = labels.map((label, index) => ({
    name: label,
    'Barang Masuk': stockInData[index] || 0,
    'Barang Keluar': stockOutData[index] || 0,
  }));

  // Format donut chart data
  const categoryData = (data.stock_by_category || []).map((item, index) => ({
    name: item.category,
    value: parseInt(item.total_stock),
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const totalCategoryStock = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="animate-fade-in-up">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Barang</div>
          <div className="stat-value">{data.total_items?.toLocaleString('id-ID') || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Stok</div>
          <div className="stat-value">{data.total_stock?.toLocaleString('id-ID') || 0}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Barang Masuk</div>
          <div className="stat-value success">{data.total_stock_in?.toLocaleString('id-ID') || 0}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Barang Keluar</div>
          <div className="stat-value">{data.total_stock_out?.toLocaleString('id-ID') || 0}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Stok Menipis</div>
          <div className="stat-value danger">{data.low_stock_count || 0}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar Chart - Monthly Stock In/Out */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Grafik Barang Masuk & Keluar</h3>
            <span className="chart-subtitle">6 bulan terakhir</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
              />
              <Bar
                dataKey="Barang Masuk"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                label={{ position: 'top', fontSize: 11, fill: '#3b82f6' }}
              />
              <Bar
                dataKey="Barang Keluar"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
                label={{ position: 'top', fontSize: 11, fill: '#f59e0b' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart - Stock by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Stok per Kategori</h3>
            <span className="chart-subtitle">Saat ini</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => value.toLocaleString('id-ID')}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div className="donut-center-value">{totalCategoryStock.toLocaleString('id-ID')}</div>
              <div className="donut-center-label">Total Stok</div>
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            {categoryData.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-left">
                  <div className="legend-dot" style={{ backgroundColor: item.color }} />
                  <span className="legend-label">{item.name}</span>
                </div>
                <span className="legend-value">{item.value.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="recent-grid">
        {/* Recent Stock In */}
        <div className="table-section">
          <h3 className="table-title">Barang Masuk Terbaru</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {(data.recent_stock_in || []).length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>Belum ada data</td></tr>
                ) : (
                  data.recent_stock_in.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date_in}</td>
                      <td>{item.item?.name || '-'}</td>
                      <td><strong>{item.quantity}</strong></td>
                      <td>{item.supplier}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Stock Out */}
        <div className="table-section">
          <h3 className="table-title">Barang Keluar Terbaru</h3>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Tujuan</th>
                </tr>
              </thead>
              <tbody>
                {(data.recent_stock_out || []).length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>Belum ada data</td></tr>
                ) : (
                  data.recent_stock_out.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date_out}</td>
                      <td>{item.item?.name || '-'}</td>
                      <td><strong>{item.quantity}</strong></td>
                      <td>{item.destination}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
