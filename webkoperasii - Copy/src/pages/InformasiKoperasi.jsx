import { motion } from "framer-motion";
import { Download, Eye, Filter, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getKoperasiList } from "../lib/supabase";

const InformasiKoperasi = () => {
  const [allKoperasi, setAllKoperasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");
  const [filterKelurahan, setFilterKelurahan] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getKoperasiList();
    if (result.success) {
      setAllKoperasi(result.data);
    }
    setLoading(false);
  };

  const stats = {
    totalKoperasi: allKoperasi.length,
    totalAktif: allKoperasi.filter((k) => k.status === "Aktif").length,
    totalKecamatan: 6,
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
  const kelurahanList = [
    "Semua",
    ...new Set(allKoperasi.map((k) => k.kelurahan)),
  ];

  // Filter data
  const filteredData = allKoperasi.filter((koperasi) => {
    const matchSearch =
      koperasi.nama_koperasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      koperasi.alamat_lengkap
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      koperasi.kelurahan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKecamatan =
      filterKecamatan === "Semua" || koperasi.kecamatan === filterKecamatan;
    const matchKelurahan =
      filterKelurahan === "Semua" || koperasi.kelurahan === filterKelurahan;
    return matchSearch && matchKecamatan && matchKelurahan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "No",
      "Nama Koperasi",
      "Alamat",
      "Kelurahan",
      "Kecamatan",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((k, i) =>
        [
          i + 1,
          `"${k.nama_koperasi}"`,
          `"${k.alamat_lengkap}"`,
          k.kelurahan,
          k.kecamatan,
          k.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-koperasi-kota-bogor.csv";
    a.click();
  };

  if (loading) {
    return (
      <div>
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Informasi Koperasi</h1>
              <p className="text-xl text-primary-50">
                Database lengkap koperasi aktif di Kota Bogor
              </p>
            </div>
          </div>
        </section>

        {/* Loading Spinner */}
        <section className="py-16">
          <div className="container-custom">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Memuat data koperasi...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Informasi Koperasi</h1>
            <p className="text-xl text-primary-50">
              Database lengkap koperasi aktif di Kota Bogor
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-600">
                {stats.totalKoperasi}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Koperasi</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalAktif}
              </div>
              <div className="text-sm text-gray-600 mt-1">Koperasi Aktif</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalKecamatan}
              </div>
              <div className="text-sm text-gray-600 mt-1">Kecamatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <div className="card">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau alamat koperasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterKecamatan}
                  onChange={(e) => {
                    setFilterKecamatan(e.target.value);
                    setFilterKelurahan("Semua");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {kecamatanList.map((kec) => (
                    <option key={kec} value={kec}>
                      {kec === "Semua" ? "Semua Kecamatan" : kec}
                    </option>
                  ))}
                </select>

                <select
                  value={filterKelurahan}
                  onChange={(e) => {
                    setFilterKelurahan(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {kelurahanList.map((kel) => (
                    <option key={kel} value={kel}>
                      {kel === "Semua" ? "Semua Kelurahan" : kel}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredData.length} dari {allKoperasi.length}{" "}
              koperasi
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-6">
        <div className="container-custom">
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nama Koperasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Kelurahan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Kecamatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((koperasi, index) => (
                    <motion.tr
                      key={koperasi.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {koperasi.nama_koperasi}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {koperasi.alamat_lengkap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {koperasi.kelurahan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {koperasi.kecamatan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {koperasi.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InformasiKoperasi;
