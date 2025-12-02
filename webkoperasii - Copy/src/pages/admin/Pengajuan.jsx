import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { getPengajuanList, updatePengajuanStatus } from "../../lib/supabase";

const Pengajuan = () => {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");
  const { user } = useAuth();

  useEffect(() => {
    loadPengajuan();
  }, [filterStatus, filterKecamatan]);

  const loadPengajuan = async () => {
    setLoading(true);
    const result = await getPengajuanList({
      status: filterStatus,
      kecamatan: filterKecamatan,
    });

    if (result.success) {
      setPengajuanData(result.data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus, catatan = "") => {
    const result = await updatePengajuanStatus(id, newStatus, catatan, user.id);

    if (result.success) {
      loadPengajuan(); 
    }
  };

  const dokumenBelumLengkap = pengajuanData.filter((p) => {
    if (!p.files) return true;
    const hasKtp =
      p.files.ktp && (p.files.ktp.data || typeof p.files.ktp === "string");
    const hasAdArt =
      p.files.adArt &&
      (p.files.adArt.data || typeof p.files.adArt === "string");
    const hasBeritaAcara =
      p.files.beritaAcara &&
      (p.files.beritaAcara.data || typeof p.files.beritaAcara === "string");
    return !hasKtp || !hasAdArt || !hasBeritaAcara;
  }).length;

  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      label: "Total Koperasi",
      value: pengajuanData.length,
      color: "bg-blue-500",
      link: "/admin/koperasi",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      label: "Koperasi Aktif",
      value: pengajuanData.filter((k) => k.status === "Aktif").length,
      color: "bg-green-500",
      link: "/admin/koperasi",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      label: "Total Pengajuan",
      value: pengajuanData.length,
      color: "bg-purple-500",
      link: "/admin/pengajuan",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: "Menunggu Verifikasi",
      value: pengajuanData.filter((p) => p.status === "pending").length,
      color: "bg-orange-500",
      link: "/admin/pengajuan",
    },
  ];

  const recentPengajuan = pengajuanData.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Ringkasan data koperasi dan pengajuan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`${stat.color} rounded-xl p-6 text-white shadow-lg cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">{stat.icon}</div>
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-white/90">{stat.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Pengajuan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Pengajuan Terbaru
              </h2>
              <Link
                to="/admin/pengajuan"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Lihat Semua →
              </Link>
            </div>

            {recentPengajuan.length > 0 ? (
              <div className="space-y-3">
                {recentPengajuan.map((pengajuan, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {pengajuan.namaKoperasi}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pengajuan.kecamatan}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {pengajuan.namaKetua}
                        </p>

                        {/* Indikator Dokumen */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Dokumen:
                          </span>
                          <div className="flex gap-1">
                            {pengajuan.files ? (
                              <>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    pengajuan.files.ktp
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                  title="KTP"
                                />
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    pengajuan.files.adArt
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                  title="AD/ART"
                                />
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    pengajuan.files.beritaAcara
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                  title="Berita Acara"
                                />
                              </>
                            ) : (
                              <span className="text-xs text-red-500">
                                Belum upload
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pengajuan.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : pengajuan.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pengajuan.status === "pending"
                          ? "Pending"
                          : pengajuan.status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pengajuan</p>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Statistik Per Kecamatan
            </h2>
            <div className="space-y-3">
              {[
                "Bogor Utara",
                "Bogor Timur",
                "Bogor Tengah",
                "Bogor Barat",
                "Bogor Selatan",
                "Tanah Sareal",
              ].map((kec, index) => {
                const count = pengajuanData.filter(
                  (k) => k.kecamatan === kec
                ).length;
                const percentage = (
                  (count / pengajuanData.length) *
                  100
                ).toFixed(1);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{kec}</span>
                      <span className="text-gray-600">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="bg-primary-600 h-2 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pengajuan;
