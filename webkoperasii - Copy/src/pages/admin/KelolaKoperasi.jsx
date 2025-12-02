import { AnimatePresence, motion } from "framer-motion";
import { Edit, Eye, MapPin, Plus, Power, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import MapLocationPicker from "../../components/MapLocationPicker";
import {
  createKoperasi,
  deleteKoperasi,
  getKoperasiList,
  toggleKoperasiStatus,
  updateKoperasi,
} from "../../lib/supabase";

const KelolaKoperasi = () => {
  const [koperasi, setKoperasi] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentKoperasi, setCurrentKoperasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    latitude: null,
    longitude: null,
    status: "Aktif",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getKoperasiList();
    if (result.success) {
      setKoperasi(result.data);
    }
    setLoading(false);
  };

  const kecamatanList = [
    "Semua",
    "Bogor Utara",
    "Bogor Timur",
    "Bogor Tengah",
    "Bogor Barat",
    "Bogor Selatan",
    "Tanah Sareal",
  ];

  const filteredData = koperasi.filter((k) => {
    const matchSearch =
      (k.nama_koperasi || k.nama)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (k.alamat_lengkap || k.alamat)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchKecamatan =
      filterKecamatan === "Semua" || k.kecamatan === filterKecamatan;
    return matchSearch && matchKecamatan;
  });

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      alamat: prev.alamat || locationData.location,
    }));
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      nama: "",
      alamat: "",
      kelurahan: "",
      kecamatan: "",
      latitude: null,
      longitude: null,
      status: "Aktif",
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentKoperasi(item);
    setFormData({
      nama: item.nama_koperasi || item.nama,
      alamat: item.alamat_lengkap || item.alamat,
      kelurahan: item.kelurahan,
      kecamatan: item.kecamatan,
      latitude: item.latitude,
      longitude: item.longitude,
      status: item.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, nama) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus koperasi "${nama}"?`)
    ) {
      const result = await deleteKoperasi(id);
      if (result.success) {
        await loadData();
      } else {
        alert("Gagal menghapus koperasi: " + result.error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const result = await toggleKoperasiStatus(id, currentStatus);
    if (result.success) {
      await loadData();
    } else {
      alert("Gagal mengubah status: " + result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;
    if (editMode) {
      result = await updateKoperasi(currentKoperasi.id, formData);
    } else {
      result = await createKoperasi(formData);
    }

    if (result.success) {
      await loadData();
      setShowModal(false);
    } else {
      alert("Gagal menyimpan data: " + result.error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data koperasi...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kelola Data Koperasi
            </h1>
            <p className="text-gray-600 mt-1">
              Tambah, edit, atau hapus data koperasi
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Koperasi
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Koperasi</p>
            <p className="text-2xl font-bold text-primary-600">
              {koperasi.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Koperasi Aktif</p>
            <p className="text-2xl font-bold text-green-600">
              {koperasi.filter((k) => k.status === "Aktif").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Koperasi Nonaktif</p>
            <p className="text-2xl font-bold text-red-600">
              {koperasi.filter((k) => k.status === "Nonaktif").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari nama atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <select
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {kecamatanList.map((kec) => (
                <option key={kec} value={kec}>
                  {kec}
                </option>
              ))}
            </select>
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
                      Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Kecamatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Koordinat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
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
                        {item.nama_koperasi}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.alamat_lengkap}
                      </td>
                      <td className="px-6 py-4 text-sm">{item.kecamatan}</td>
                      <td className="px-6 py-4 text-sm">
                        {item.latitude && item.longitude ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 text-xs">Ada</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-600" />
                            <span className="text-red-600 text-xs">Belum</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(item.id, item.status)
                            }
                            className={`p-2 rounded-lg ${
                              item.status === "Aktif"
                                ? "text-orange-600 hover:bg-orange-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              item.status === "Aktif"
                                ? "Nonaktifkan"
                                : "Aktifkan"
                            }
                          >
                            <Power size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item.id, item.nama_koperasi)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Hapus"
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
              <p className="text-lg font-medium">Tidak ada data koperasi</p>
              <p className="text-sm mt-1">
                Klik "Tambah Koperasi" untuk menambah data
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editMode ? "Edit Koperasi" : "Tambah Koperasi"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nama Koperasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Contoh: Koperasi Sejahtera Mandiri"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kecamatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.kecamatan}
                      onChange={(e) =>
                        setFormData({ ...formData, kecamatan: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList
                        .filter((k) => k !== "Semua")
                        .map((kec) => (
                          <option key={kec} value={kec}>
                            {kec}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kelurahan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kelurahan}
                      onChange={(e) =>
                        setFormData({ ...formData, kelurahan: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Nama Kelurahan"
                      required
                    />
                  </div>
                </div>

                {/* Lokasi pada Peta */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pilih Lokasi pada Peta
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <MapLocationPicker
                      value={
                        formData.latitude && formData.longitude
                          ? {
                              lat: formData.latitude,
                              lng: formData.longitude,
                              label: formData.alamat,
                              location: formData.alamat,
                            }
                          : null
                      }
                      onChange={handleLocationSelect}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Tips:</strong> Cari nama tempat atau klik pada peta
                    untuk menentukan lokasi koperasi
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Alamat akan terisi otomatis saat memilih lokasi, atau ketik manual"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alamat dapat diubah manual jika diperlukan
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                {/* Info Koordinat */}
                {formData.latitude && formData.longitude && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Koordinat:</strong> {formData.latitude.toFixed(6)}
                      , {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 btn-primary">
                    {editMode ? "Update" : "Tambah"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default KelolaKoperasi;
