import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Lock, User, Eye, EyeOff, LogIn, CheckCircle2, TrendingUp, ShieldCheck, Clock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.username, form.password);
      toast.success('Login berhasil! Selamat datang di Inventory Cloud.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Username atau password salah';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-login-page">
      {/* Left Side - Visual/Brand */}
      <div className="login-visual">
        <div className="visual-bg">
          <img src="/warehouse-bg.png" alt="Warehouse" />
        </div>
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="visual-badge">Modern & Efisien</div>
          <h1 className="visual-title">Transformasi Manajemen Inventori Anda</h1>
          
          <div className="visual-features">
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-icon" />
              <span>Sistem terintegrasi berbasis Cloud</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-icon" />
              <span>Memantau stok secara real-time</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={20} className="feature-icon" />
              <span>Analisis pergerakan barang akurat</span>
            </div>
          </div>
          
          <div className="visual-stats">
            <div className="stat-item">
              <Clock className="stat-icon" size={24} />
              <div className="stat-info">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Real-time Tracking</div>
              </div>
            </div>
            <div className="stat-item">
              <ShieldCheck className="stat-icon" size={24} />
              <div className="stat-info">
                <div className="stat-number">100%</div>
                <div className="stat-label">Keamanan Data</div>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp className="stat-icon" size={24} />
              <div className="stat-info">
                <div className="stat-number">Optima</div>
                <div className="stat-label">Performa Bisnis</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-form-container">
        <div className="login-card-modern">
          {/* Brand/Logo Area */}
          <div className="login-brand-area">
            <img src="/logo.png" alt="Inventory Cloud Logo" className="brand-logo-img" />
          </div>

          <div className="login-header">
            <h2>Selamat Datang Kembali</h2>
            <p>Masukkan kredensial Anda untuk mengakses dashboard</p>
          </div>

          {error && (
            <div className="login-error-modern">
              <div className="error-icon">!</div>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper-modern">
                <div className="input-icon-box">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper-modern">
                <div className="input-icon-box">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options-modern">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Ingat perangkat ini
              </label>
              <a href="#" className="forgot-link">Lupa Password?</a>
            </div>

            <button type="submit" className="login-btn-modern" disabled={loading}>
              {loading ? (
                <div className="spinner-modern"></div>
              ) : (
                <>
                  Masuk Sekarang
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer-modern">
            <p>&copy; {new Date().getFullYear()} Inventory Cloud System</p>
            <p>Terhubung secara aman via SSL/TLS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
