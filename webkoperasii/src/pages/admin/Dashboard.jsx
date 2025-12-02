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
import { getKoperasiList, getPengajuanList } from "../../lib/supabase";

const Dashboard = () => {
  const [pengajuanData, setPengajuanData] = useState([]);
  const [koperasiData, setKoperasiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pengajuanResult, koperasiResult] = await Promise.all([
      getPengajuanList(),
      getKoperasiList(),
    ]);

    if (pengajuanResult.success) {
      setPengajuanData(pengajuanResult.data);
    }

    if (koperasiResult.success) {
      setKoperasiData(koperasiResult.data);
    }

    setLoading(false);
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

  const koperasiAktif = koperasiData.filter((k) => k.status === "Aktif");

  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      label: "Total Koperasi",
      value: koperasiData.length,
      color: "bg-blue-500",
      link: "/admin/koperasi",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      label: "Koperasi Aktif",
      value: koperasiAktif.length,
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

  // Statistik per kecamatan menggunakan data dari database
  const kecamatanStats = [
    "Bogor Utara",
    "Bogor Timur",
    "Bogor Tengah",
    "Bogor Barat",
    "Bogor Selatan",
    "Tanah Sareal",
  ].map((kec) => {
    const count = koperasiData.filter((k) => k.kecamatan === kec).length;
    const percentage =
      koperasiData.length > 0
        ? ((count / koperasiData.length) * 100).toFixed(1)
        : 0;
    return { kecamatan: kec, count, percentage };
  });

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

            {/* Update dashboard untuk menampilkan status dokumen dari Supabase */}
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
                          {pengajuan.nama_koperasi || pengajuan.namaKoperasi}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pengajuan.kecamatan}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {pengajuan.nama_ketua || pengajuan.namaKetua}
                        </p>

                        {/* Indikator Dokumen dari Supabase */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            Dokumen:
                          </span>
                          <div className="flex gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                pengajuan.file_ktp_ketua
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              title="KTP"
                            />
                            <div
                              className={`w-2 h-2 rounded-full ${
                                pengajuan.file_ad_art
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              title="AD/ART"
                            />
                            <div
                              className={`w-2 h-2 rounded-full ${
                                pengajuan.file_berita_acara
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              title="Berita Acara"
                            />
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

          {/* Quick Stats - Update section */}
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
              {kecamatanStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {stat.kecamatan}
                    </span>
                    <span className="text-gray-600">
                      {stat.count} ({stat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="bg-primary-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
