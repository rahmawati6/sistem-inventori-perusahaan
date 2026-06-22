import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Printer } from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ start_date: '', end_date: '' });
  const toast = useToast();

  useEffect(() => {
    fetchReport();
  }, [activeTab]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let endpoint = '/reports/items';
      let params = {};

      if (activeTab === 'stock-in') {
        endpoint = '/reports/stock-ins';
        if (filters.start_date) params.start_date = filters.start_date;
        if (filters.end_date) params.end_date = filters.end_date;
      } else if (activeTab === 'stock-out') {
        endpoint = '/reports/stock-outs';
        if (filters.start_date) params.start_date = filters.start_date;
        if (filters.end_date) params.end_date = filters.end_date;
      }

      const response = await api.get(endpoint, { params });
      setData(response.data.data || response.data);
    } catch (error) {
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const renderItemsTable = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Satuan</th>
            <th>Stok</th>
            <th>Stok Minimum</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="8" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Tidak ada data</td></tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td><span className="code-badge">{item.code}</span></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>
                  <span className={`stock-badge ${item.stock <= 0 ? 'critical' : item.stock <= item.minimum_stock ? 'low' : 'normal'}`}>
                    {item.stock}
                  </span>
                </td>
                <td>{item.minimum_stock}</td>
                <td>
                  {item.stock <= 0 ? (
                    <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.82rem' }}>Habis</span>
                  ) : item.stock <= item.minimum_stock ? (
                    <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.82rem' }}>Menipis</span>
                  ) : (
                    <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.82rem' }}>Aman</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderStockInTable = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Supplier</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Tidak ada data</td></tr>
          ) : (
            data.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.date_in}</td>
                <td><span className="code-badge">{entry.item?.code || '-'}</span></td>
                <td>{entry.item?.name || '-'}</td>
                <td><strong>{entry.quantity}</strong></td>
                <td>{entry.supplier}</td>
                <td>{entry.notes || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderStockOutTable = () => (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Tujuan</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>Tidak ada data</td></tr>
          ) : (
            data.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{entry.date_out}</td>
                <td><span className="code-badge">{entry.item?.code || '-'}</span></td>
                <td>{entry.item?.name || '-'}</td>
                <td><strong>{entry.quantity}</strong></td>
                <td>{entry.destination}</td>
                <td>{entry.notes || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-fade-in-up">
      <div className="table-section">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
          >
            Data Barang
          </button>
          <button
            className={`tab ${activeTab === 'stock-in' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock-in')}
          >
            Barang Masuk
          </button>
          <button
            className={`tab ${activeTab === 'stock-out' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock-out')}
          >
            Barang Keluar
          </button>
        </div>

        {/* Date Filters for Stock In/Out */}
        {(activeTab === 'stock-in' || activeTab === 'stock-out') && (
          <form onSubmit={handleFilter} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ gap: '4px' }}>
              <label style={{ fontSize: '0.8rem' }}>Tanggal Mulai</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
            </div>
            <div className="form-group" style={{ gap: '4px' }}>
              <label style={{ fontSize: '0.8rem' }}>Tanggal Akhir</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Filter</button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setFilters({ start_date: '', end_date: '' }); }}
            >
              Reset
            </button>
          </form>
        )}

        {/* Print Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="table-title">
            Laporan {activeTab === 'items' ? 'Data Barang' : activeTab === 'stock-in' ? 'Barang Masuk' : 'Barang Keluar'}
          </h3>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            Cetak Laporan
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-container"><div className="loading-spinner" /></div>
        ) : (
          <>
            {activeTab === 'items' && renderItemsTable()}
            {activeTab === 'stock-in' && renderStockInTable()}
            {activeTab === 'stock-out' && renderStockOutTable()}
          </>
        )}

        {/* Summary */}
        {!loading && data.length > 0 && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 'var(--border-radius)', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
            Total data: <strong>{data.length}</strong> records
            {activeTab !== 'items' && data.length > 0 && (
              <> | Total jumlah: <strong>
                {data.reduce((sum, item) => sum + (item.quantity || 0), 0).toLocaleString('id-ID')}
              </strong> unit</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
