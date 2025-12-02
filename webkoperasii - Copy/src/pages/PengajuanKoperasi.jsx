import { motion } from "framer-motion";
import { AlertCircle, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitPengajuan } from "../lib/supabase";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePengajuanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi file
      if (!files.ktpKetua || !files.adArt || !files.beritaAcara) {
        setError(
          "Mohon lengkapi semua dokumen wajib (KTP, AD/ART, Berita Acara)"
        );
        setLoading(false);
        return;
      }

      // Submit ke Supabase
      const result = await submitPengajuan(formData, files);

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          namaKoperasi: "",
          alamat: "",
          kelurahan: "",
          kecamatan: "",
          jenisKoperasi: "",
          namaKetua: "",
          nikKetua: "",
          emailKetua: "",
          noHpKetua: "",
          jumlahAnggota: "",
        });
        setFiles({
          ktpKetua: null,
          adArt: null,
          beritaAcara: null,
          daftarAnggota: null,
          susunanPengurus: null,
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(`Gagal mengirim pengajuan: ${result.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/img/logojambi.png"
              alt="Logo Dinas Koperasi"
              className="w-20 h-20 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Dinas Koperasi Kota Bogor</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Login"}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Info Login:</strong> Gunakan kredensial yang telah
              diberikan oleh administrator
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
