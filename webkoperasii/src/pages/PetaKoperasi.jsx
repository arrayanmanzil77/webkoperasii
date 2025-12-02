import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Building2, MapPin, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getKoperasiList } from "../lib/supabase";

// Fix marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PetaKoperasi = () => {
  const [koperasiData, setKoperasiData] = useState([]);
  const [selectedKoperasi, setSelectedKoperasi] = useState(null);
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getKoperasiList();
    if (result.success) {
      setKoperasiData(result.data);
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

  const filteredKoperasi =
    filterKecamatan === "Semua"
      ? koperasiData
      : koperasiData.filter((k) => k.kecamatan === filterKecamatan);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Peta Koperasi</h1>
            <p className="text-xl text-primary-50">
              Temukan lokasi koperasi aktif di seluruh wilayah Kota Bogor
            </p>
          </div>
        </div>
      </section>

      {/* Filter dan Statistik */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-gray-700">
                Filter Kecamatan:
              </label>
              <select
                value={filterKecamatan}
                onChange={(e) => setFilterKecamatan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {kecamatanList.map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {filteredKoperasi.length}
                </div>
                <div className="text-sm text-gray-600">
                  Koperasi Ditampilkan
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {koperasiData.length}
                </div>
                <div className="text-sm text-gray-600">Total Koperasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map dan List */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden h-[600px] relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Memuat peta...</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={[-6.5971, 106.806]}
                    zoom={12}
                    style={{ height: "100%", width: "100%", zIndex: 1 }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredKoperasi
                      .filter((k) => k.latitude && k.longitude)
                      .map((koperasi) => (
                        <Marker
                          key={koperasi.id}
                          position={[koperasi.latitude, koperasi.longitude]}
                          eventHandlers={{
                            click: () => setSelectedKoperasi(koperasi),
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-base mb-2">
                                {koperasi.nama_koperasi}
                              </h3>
                              <div className="space-y-1 text-sm">
                                <p className="flex items-start gap-2">
                                  <MapPin
                                    size={14}
                                    className="mt-1 flex-shrink-0"
                                  />
                                  {koperasi.alamat_lengkap}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPinned size={14} />
                                  {koperasi.kelurahan}, {koperasi.kecamatan}
                                </p>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                )}
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-1">
              <div className="card p-4 max-h-[600px] overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Daftar Koperasi</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredKoperasi.map((koperasi) => (
                      <div
                        key={koperasi.id}
                        onClick={() => setSelectedKoperasi(koperasi)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedKoperasi?.id === koperasi.id
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                        }`}
                      >
                        <h4 className="font-bold text-sm mb-2">
                          {koperasi.nama_koperasi}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          <MapPinned size={12} className="inline mr-1" />
                          {koperasi.kelurahan}, {koperasi.kecamatan}
                        </p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {koperasi.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detail Selected */}
          {selectedKoperasi && (
            <div className="mt-6 card">
              <h3 className="text-xl font-bold mb-4">Detail Koperasi</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-600 mb-4">
                    {selectedKoperasi.nama_koperasi}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-1 text-primary-600 flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">
                          Alamat Lengkap
                        </p>
                        <p className="text-gray-600 mt-1">
                          {selectedKoperasi.alamat_lengkap}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPinned
                        size={18}
                        className="mt-1 text-primary-600 flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">Lokasi</p>
                        <p className="text-gray-600 mt-1">
                          Kelurahan {selectedKoperasi.kelurahan}
                          <br />
                          Kecamatan {selectedKoperasi.kecamatan}
                          <br />
                          Kota Bogor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-[18px] h-[18px] mt-1 flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedKoperasi.status === "Aktif"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Status</p>
                      <p
                        className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedKoperasi.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedKoperasi.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PetaKoperasi;
