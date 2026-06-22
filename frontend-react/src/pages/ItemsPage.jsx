import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Plus, Search } from 'lucide-react';

const CATEGORIES = ['Besi', 'Kayu', 'Aksesoris', 'Hardware', 'Finishing', 'Upholstery'];
const UNITS = ['batang', 'lembar', 'buah', 'kg', 'liter', 'box', 'pasang', 'meter', 'kaleng', 'roll', 'set'];

const initialForm = {
  code: '', name: '', category: 'Besi', unit: 'batang', stock: 0, minimum_stock: 0
};

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const toast = useToast();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data.data || response.data);
    } catch (error) {
      toast.error('Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/items/${editId}`, form);
        toast.success('Barang berhasil diperbarui');
      } else {
        await api.post('/items', form);
        toast.success('Barang berhasil ditambahkan');
      }
      resetForm();
      fetchItems();
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menyimpan barang';
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleEdit = (item) => {
    setForm({
      code: item.code,
      name: item.name,
      category: item.category,
      unit: item.unit,
      stock: item.stock,
      minimum_stock: item.minimum_stock,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/items/${deleteModal.id}`);
      toast.success('Barang berhasil dihapus');
      setDeleteModal(null);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus barang');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const getStockClass = (item) => {
    if (item.stock <= 0) return 'critical';
    if (item.stock <= item.minimum_stock) return 'low';
    return 'normal';
  };

  const filteredItems = items.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editId ? 'Edit Barang' : 'Tambah Barang'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="item-code">Kode</label>
                <input
                  id="item-code"
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Contoh: BES-001"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="item-name">Nama Barang</label>
                <input
                  id="item-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama barang"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="item-category">Kategori</label>
                <select
                  id="item-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="item-unit">Satuan</label>
                <select
                  id="item-unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  {UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="item-stock">Stok</label>
                <input
                  id="item-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="item-min-stock">Stok Minimum</label>
                <input
                  id="item-min-stock"
                  type="number"
                  min="0"
                  value={form.minimum_stock}
                  onChange={(e) => setForm({ ...form, minimum_stock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editId ? 'Update' : 'Simpan'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-section">
        <div className="table-header">
          <div>
            <h3 className="table-title">Daftar Barang</h3>
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Cari kode, nama, atau kategori"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <Plus size={16} />
              Tambah Barang
            </button>
          </div>
        </div>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Satuan</th>
                <th>Stok</th>
                <th>Stok Minimum</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                    {search ? 'Tidak ada barang yang cocok' : 'Belum ada data barang'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><span className="code-badge">{item.code}</span></td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span className={`stock-badge ${getStockClass(item)}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td>{item.minimum_stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn-delete" onClick={() => setDeleteModal(item)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Hapus Barang</h3>
            <p className="modal-message">
              Apakah Anda yakin ingin menghapus barang <strong>{deleteModal.name}</strong> ({deleteModal.code})?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Batal</button>
              <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={handleDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
