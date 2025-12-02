import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MapPin,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPengajuanList, updatePengajuanStatus } from "../../lib/supabase";

const KelolaPengajuan = () => {
  const [pengajuan, setPengajuan] = useState([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getPengajuanList();
      if (result.success) {
        console.log("Loaded pengajuan data:", result.data); 
        setPengajuan(result.data);
      } else {
        console.error("Failed to load pengajuan:", result.error);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menyetujui pengajuan ini?")) {
      try {
        const adminSession = JSON.parse(
          localStorage.getItem("adminSession") || "{}"
        );
        const adminId = adminSession.id;

        if (!adminId) {
          alert("Session admin tidak valid. Silakan login ulang.");
          return;
        }

        const result = await updatePengajuanStatus(
          id,
          "approved",
          "Pengajuan disetujui oleh admin",
          adminId
        );

        if (result.success) {
          await loadData(); 
        } else {
          alert("Gagal mengupdate status: " + result.error);
        }
      } catch (error) {
        console.error("Error approving:", error);
        alert("Terjadi kesalahan saat menyetujui pengajuan");
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menolak pengajuan ini?")) {
      try {
        const adminSession = JSON.parse(
          localStorage.getItem("adminSession") || "{}"
        );
        const adminId = adminSession.id;

        if (!adminId) {
          alert("Session admin tidak valid. Silakan login ulang.");
          return;
        }

        const result = await updatePengajuanStatus(
          id,
          "rejected",
          "Pengajuan ditolak oleh admin",
          adminId
        );

        if (result.success) {
          await loadData(); 
        } else {
          alert("Gagal mengupdate status: " + result.error);
        }
      } catch (error) {
        console.error("Error rejecting:", error);
        alert("Terjadi kesalahan saat menolak pengajuan");
      }
    }
  };

  const handleDelete = async (id, namaKoperasi) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus pengajuan "${namaKoperasi}"?\n\nData yang dihapus tidak dapat dikembalikan!`
      )
    ) {
      try {


        alert("Fitur hapus belum diimplementasi");

        if (selectedPengajuan?.id === id) {
          setShowModal(false);
          setSelectedPengajuan(null);
        }
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Terjadi kesalahan saat menghapus pengajuan");
      }
    }
  };

  const handleView = (item) => {
    setSelectedPengajuan(item);
    setShowModal(true);
  };

  const handlePreviewFile = (fileUrl, title) => {
    if (fileUrl) {
      setPreviewFile({
        data: fileUrl,
        title,
        type: fileUrl.includes(".pdf") ? "application/pdf" : "image/jpeg",
        name: title,
      });
      setShowPreviewModal(true);
    }
  };

  const filteredData = pengajuan.filter((p) => {
    if (filterStatus === "Semua") return true;
    return p.status === filterStatus;
  });

  const stats = [
    { label: "Total Pengajuan", value: pengajuan.length, color: "bg-blue-500" },
    {
      label: "Pending",
      value: pengajuan.filter((p) => p.status === "pending").length,
      color: "bg-orange-500",
    },
    {
      label: "Disetujui",
      value: pengajuan.filter((p) => p.status === "approved").length,
      color: "bg-green-500",
    },
    {
      label: "Ditolak",
      value: pengajuan.filter((p) => p.status === "rejected").length,
      color: "bg-red-500",
    },
  ];

  const LocationMap = ({ latitude, longitude, address }) => {
    const mapRef = useRef();
    const mapInstanceRef = useRef(null);

    useEffect(() => {
      const loadLeaflet = async () => {
        if (typeof window.L === "undefined") {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);

          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = initMap;
          document.head.appendChild(script);
        } else {
          initMap();
        }
      };

      const initMap = () => {
        if (!mapRef.current || !latitude || !longitude) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        mapRef.current.innerHTML = "";

        try {
          const mapInstance = window.L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          }).setView([latitude, longitude], 15);

          window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
          ).addTo(mapInstance);

          window.L.marker([latitude, longitude])
            .addTo(mapInstance)
            .bindPopup(address || `${latitude}, ${longitude}`)
            .openPopup();

          mapInstanceRef.current = mapInstance;
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      };

      loadLeaflet();

      return () => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            // ignore
          }
          mapInstanceRef.current = null;
        }
      };
    }, [latitude, longitude, address]);

    if (!latitude || !longitude) {
      return (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">Koordinat lokasi tidak tersedia</p>
        </div>
      );
    }

    return (
      <div>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "300px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        />
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Lokasi:</p>
              <p className="text-xs text-blue-700">{address}</p>
              <p className="text-xs text-blue-600 mt-1">
                Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pengajuan...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kelola Pengajuan Koperasi
          </h1>
          <p className="text-gray-600 mt-1">
            Verifikasi dan kelola pengajuan koperasi baru
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.color} text-white p-6 rounded-lg shadow-lg`}
            >
              <p className="text-sm opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter & Legend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>

            {/* Legend Dokumen */}
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-gray-700">
                Indikator Dokumen:
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Lengkap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Belum Upload</span>
              </div>
              <span className="text-xs text-gray-500">
                (KTP, AD/ART, Berita Acara)
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Nama Koperasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Ketua
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Kecamatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Koordinat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Dokumen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {item.nama_koperasi || item.namaKoperasi}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.nama_ketua || item.namaKetua}
                      </td>
                      <td className="px-6 py-4 text-sm">{item.kecamatan}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.jumlah_anggota || item.jumlahAnggota}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.latitude && item.longitude ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 text-xs">
                              Tersedia
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-600" />
                            <span className="text-red-600 text-xs">
                              Tidak ada
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : item.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "approved"
                            ? "Disetujui"
                            : "Ditolak"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.file_ktp_ketua
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            title={
                              item.file_ktp_ketua
                                ? "KTP: Tersedia"
                                : "KTP: Belum upload"
                            }
                          />
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.file_ad_art ? "bg-green-500" : "bg-red-500"
                            }`}
                            title={
                              item.file_ad_art
                                ? "AD/ART: Tersedia"
                                : "AD/ART: Belum upload"
                            }
                          />
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.file_berita_acara
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            title={
                              item.file_berita_acara
                                ? "Berita Acara: Tersedia"
                                : "Berita Acara: Belum upload"
                            }
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Setujui"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Tolak"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              handleDelete(
                                item.id,
                                item.nama_koperasi || item.namaKoperasi
                              )
                            }
                            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Hapus Pengajuan"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Belum ada pengajuan</p>
              <p className="text-sm mt-1">
                Pengajuan dari user akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      <AnimatePresence>
        {showModal && selectedPengajuan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Detail Pengajuan</h2>

              <div className="space-y-6">
                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedPengajuan.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : selectedPengajuan.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedPengajuan.status === "pending"
                        ? "Pending"
                        : selectedPengajuan.status === "approved"
                        ? "Disetujui"
                        : "Ditolak"}
                    </span>
                  </div>
                </div>

                {/* Lokasi pada Peta */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary-600">
                    Lokasi pada Peta
                  </h3>
                  <LocationMap
                    latitude={selectedPengajuan.latitude}
                    longitude={selectedPengajuan.longitude}
                    address={
                      selectedPengajuan.alamat_lengkap ||
                      selectedPengajuan.alamat
                    }
                  />
                </div>

                {/* Data Koperasi */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary-600">
                    Data Koperasi
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Nama Koperasi
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.nama_koperasi ||
                          selectedPengajuan.namaKoperasi}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-600">
                        Alamat
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.alamat_lengkap ||
                          selectedPengajuan.alamat}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Kecamatan
                      </label>
                      <p className="mt-1">{selectedPengajuan.kecamatan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Kelurahan
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.kelurahan || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Ketua */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary-600">
                    Data Ketua
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Nama Lengkap
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.nama_ketua ||
                          selectedPengajuan.namaKetua}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        NIK
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.nik_ketua ||
                          selectedPengajuan.nikKetua ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Email
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.email_ketua ||
                          selectedPengajuan.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Telepon
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.no_hp_ketua ||
                          selectedPengajuan.telepon}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary-600">
                    Informasi Tambahan
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Jumlah Anggota
                      </label>
                      <p className="mt-1">
                        {selectedPengajuan.jumlah_anggota ||
                          selectedPengajuan.jumlahAnggota}{" "}
                        orang
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">
                        Modal Awal
                      </label>
                      <p className="mt-1">
                        Rp{" "}
                        {parseInt(
                          selectedPengajuan.modalAwal || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    {selectedPengajuan.deskripsi && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600">
                          Deskripsi Usaha
                        </label>
                        <p className="mt-1">{selectedPengajuan.deskripsi}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dokumen Pendukung */}
                <div>
                  <h3 className="font-bold text-lg mb-3 text-primary-600">
                    Dokumen Pendukung
                  </h3>
                  <div className="space-y-3">
                    {/* KTP Ketua */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            KTP Ketua Koperasi
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedPengajuan.file_ktp_ketua
                              ? "File tersedia"
                              : "Tidak ada file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPengajuan.file_ktp_ketua && (
                          <>
                            <button
                              onClick={() =>
                                handlePreviewFile(
                                  selectedPengajuan.file_ktp_ketua,
                                  "KTP Ketua Koperasi"
                                )
                              }
                              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
                            >
                              Lihat
                            </button>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Uploaded
                            </span>
                          </>
                        )}
                        {!selectedPengajuan.file_ktp_ketua && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                            Belum Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AD/ART */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            Anggaran Dasar/Anggaran Rumah Tangga
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedPengajuan.file_ad_art
                              ? "File tersedia"
                              : "Tidak ada file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPengajuan.file_ad_art && (
                          <>
                            <button
                              onClick={() =>
                                handlePreviewFile(
                                  selectedPengajuan.file_ad_art,
                                  "AD/ART"
                                )
                              }
                              className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded hover:bg-purple-700"
                            >
                              Lihat
                            </button>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Uploaded
                            </span>
                          </>
                        )}
                        {!selectedPengajuan.file_ad_art && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                            Belum Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Berita Acara */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-8 h-8 text-orange-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            Berita Acara Pembentukan
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedPengajuan.file_berita_acara
                              ? "File tersedia"
                              : "Tidak ada file"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPengajuan.file_berita_acara && (
                          <>
                            <button
                              onClick={() =>
                                handlePreviewFile(
                                  selectedPengajuan.file_berita_acara,
                                  "Berita Acara Pembentukan"
                                )
                              }
                              className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded hover:bg-orange-700"
                            >
                              Lihat
                            </button>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Uploaded
                            </span>
                          </>
                        )}
                        {!selectedPengajuan.file_berita_acara && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                            Belum Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Jika semua dokumen kosong */}
                    {!selectedPengajuan.file_ktp_ketua &&
                      !selectedPengajuan.file_ad_art &&
                      !selectedPengajuan.file_berita_acara && (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Tidak ada dokumen yang di-upload</p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Tanggal Pengajuan */}
                {(selectedPengajuan.tanggal_pengajuan ||
                  selectedPengajuan.submittedAt) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-600">
                        Tanggal Pengajuan:
                      </span>
                      <span className="text-sm text-gray-900">
                        {new Date(
                          selectedPengajuan.tanggal_pengajuan ||
                            selectedPengajuan.submittedAt
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedPengajuan.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleApprove(selectedPengajuan.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Setujui
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedPengajuan.id);
                        setShowModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Tolak
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Preview Dokumen */}
      <AnimatePresence>
        {showPreviewModal && previewFile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {previewFile.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {previewFile.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewFile(null);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6 bg-gray-100">
                {previewFile.type?.startsWith("image/") ? (
                  <div className="flex justify-center">
                    <img
                      src={previewFile.data}
                      alt={previewFile.title}
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : previewFile.type === "application/pdf" ? (
                  <div
                    className="bg-white rounded-lg shadow-lg"
                    style={{ height: "600px" }}
                  >
                    <iframe
                      src={previewFile.data}
                      className="w-full h-full rounded-lg"
                      title={previewFile.title}
                    />
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">
                      Preview tidak tersedia untuk tipe file ini
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      File: {previewFile.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Tipe:</span>{" "}
                  {previewFile.type || "Unknown"}
                </div>
                <a
                  href={previewFile.data}
                  download={previewFile.name}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Download
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default KelolaPengajuan;
