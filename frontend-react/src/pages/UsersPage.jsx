import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Plus } from 'lucide-react';

const ROLES = ['Admin', 'Petugas Gudang', 'Pimpinan'];

const initialForm = {
  name: '', username: '', email: '', password: '', role: 'Admin'
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast.error('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editId && !payload.password) {
        delete payload.password;
      }
      if (editId) {
        await api.put(`/users/${editId}`, payload);
        toast.success('User berhasil diperbarui');
      } else {
        await api.post('/users', payload);
        toast.success('User berhasil ditambahkan');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menyimpan user';
      const errors = error.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role,
    });
    setEditId(user.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    if (deleteModal.id === currentUser?.id) {
      toast.error('Anda tidak dapat menghapus akun sendiri');
      setDeleteModal(null);
      return;
    }
    try {
      await api.delete(`/users/${deleteModal.id}`);
      toast.success('User berhasil dihapus');
      setDeleteModal(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus user');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin':
        return { background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-200)' };
      case 'Petugas Gudang':
        return { background: 'var(--success-light)', color: '#059669', border: '1px solid #a7f3d0' };
      case 'Pimpinan':
        return { background: 'var(--warning-light)', color: '#d97706', border: '1px solid #fde68a' };
      default:
        return {};
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="animate-fade-in-up">
      {/* Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editId ? 'Edit User' : 'Tambah User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="user-name">Nama</label>
                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="user-username">Username</label>
                <input
                  id="user-username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="user-role">Role</label>
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="user-password">
                  Password {editId && <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input
                  id="user-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editId ? 'Kosongkan jika tidak diubah' : 'Password'}
                  required={!editId}
                  autoComplete="new-password"
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
          <h3 className="table-title">Daftar User</h3>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <Plus size={16} />
              Tambah User
            </button>
          </div>
        </div>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                    Belum ada data user
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <tr key={u.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px',
                          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                          borderRadius: '8px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white', fontWeight: 700,
                          fontSize: '0.75rem', flexShrink: 0
                        }}>
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.username}</td>
                    <td>
                      <span style={{
                        ...getRoleBadgeStyle(u.role),
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: 600, display: 'inline-block'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                        {u.id !== currentUser?.id && (
                          <button className="btn-delete" onClick={() => setDeleteModal(u)}>Hapus</button>
                        )}
                      </div>
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
            <h3 className="modal-title">Hapus User</h3>
            <p className="modal-message">
              Apakah Anda yakin ingin menghapus user <strong>{deleteModal.name}</strong> ({deleteModal.username})?
              Tindakan ini tidak dapat dibatalkan.
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
