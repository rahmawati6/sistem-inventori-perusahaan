import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Plus } from 'lucide-react';

const initialForm = {
  item_id: '', date_in: new Date().toISOString().split('T')[0],
  quantity: 1, supplier: '', notes: ''
};

export default function StockInPage() {
  const [stockIns, setStockIns] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [itemSearch, setItemSearch] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockInRes, itemsRes] = await Promise.all([
        api.get('/stock-ins'),
        api.get('/items'),
      ]);
      setStockIns(stockInRes.data.data || stockInRes.data);
      setItems(itemsRes.data.data || itemsRes.data);
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id) {
      toast.error('Silakan pilih barang terlebih dahulu');
      return;
    }
    try {
      await api.post('/stock-ins', form);
      toast.success('Barang masuk berhasil disimpan. Stok telah diperbarui.');
      resetForm();
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menyimpan data barang masuk';
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/stock-ins/${deleteModal.id}`);
      toast.success('Data barang masuk berhasil dihapus. Stok telah dikurangi.');
      setDeleteModal(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setShowForm(false);
    setItemSearch('');
  };

  const selectItem = (item) => {
    setForm({ ...form, item_id: item.id });
    setItemSearch(`${item.code} - ${item.name}`);
    setShowItemDropdown(false);
  };

  const filteredItems = items.filter(item =>
    item.code.toLowerCase().includes(itemSearch.toLowerCase()) ||
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">Input Barang Masuk</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Pilih Barang</label>
                <input
                  type="text"
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setShowItemDropdown(true);
                    if (!e.target.value) setForm({ ...form, item_id: '' });
                  }}
                  onFocus={() => setShowItemDropdown(true)}
                  placeholder="Ketik kode atau nama barang"
                  required
                />
                {showItemDropdown && itemSearch && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'white', border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--border-radius)', maxHeight: '200px',
                    overflowY: 'auto', zIndex: 10, boxShadow: 'var(--shadow-lg)'
                  }}>
                    {filteredItems.length === 0 ? (
                      <div style={{ padding: '12px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                        Barang tidak ditemukan
                      </div>
                    ) : (
                      filteredItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => selectItem(item)}
                          style={{
                            padding: '10px 14px', cursor: 'pointer', fontSize: '0.88rem',
                            borderBottom: '1px solid var(--gray-100)',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--primary-50)'}
                          onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                          <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{item.code}</span>
                          {' - '}{item.name}
                          <span style={{ color: 'var(--gray-400)', marginLeft: '8px' }}>
                            (Stok: {item.stock})
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Tanggal Masuk</label>
                <input
                  type="date"
                  value={form.date_in}
                  onChange={(e) => setForm({ ...form, date_in: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Jumlah Masuk</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                  placeholder="Nama supplier"
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Keterangan</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Keterangan (opsional)"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-section">
        <div className="table-header">
          <h3 className="table-title">Riwayat Barang Masuk</h3>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <Plus size={16} />
              Input Barang Masuk
            </button>
          </div>
        </div>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kode</th>
                <th>Barang</th>
                <th>Jumlah</th>
                <th>Supplier</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stockIns.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                    Belum ada data barang masuk
                  </td>
                </tr>
              ) : (
                stockIns.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date_in}</td>
                    <td><span className="code-badge">{entry.item?.code || '-'}</span></td>
                    <td>{entry.item?.name || '-'}</td>
                    <td><strong>{entry.quantity}</strong></td>
                    <td>{entry.supplier}</td>
                    <td>{entry.notes || '-'}</td>
                    <td>
                      <button className="btn-delete" onClick={() => setDeleteModal(entry)}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Hapus Data Barang Masuk</h3>
            <p className="modal-message">
              Apakah Anda yakin ingin menghapus data ini? Stok barang akan dikurangi kembali sebanyak {deleteModal.quantity} unit.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Batal</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={handleDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
