import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  MapPin,
  Upload,
  User,
  Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import MapLocationPicker from "../components/MapLocationPicker";
import { submitPengajuan } from "../lib/supabase";

const FormPengajuan = () => {
  const [formData, setFormData] = useState({
    namaKoperasi: "",
    alamat: "",
    kecamatan: "",
    kelurahan: "",
    namaKetua: "",
    nikKetua: "",
    email: "",
    telepon: "",
    jumlahAnggota: "",
    modalAwal: "",
    deskripsi: "",
    latitude: null,
    longitude: null,
    alamatKoordinat: "",
  });

  const [files, setFiles] = useState({
    ktpKetua: null,
    adArt: null,
    beritaAcara: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [fileType]: "Ukuran file maksimal 5MB" });
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          [fileType]: "Format file harus PDF, JPG, JPEG, atau PNG",
        });
        return;
      }

      setFiles({ ...files, [fileType]: file });
      setErrors({ ...errors, [fileType]: "" });
    }
  };

  const handleLocationSelect = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      alamatKoordinat: locationData.location,
      alamat: locationData.location,
    }));

    if (errors.alamat) {
      setErrors((prev) => ({ ...prev, alamat: "" }));
    }
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.namaKoperasi)
      newErrors.namaKoperasi = "Nama koperasi wajib diisi";
    if (!formData.alamat) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.kecamatan) newErrors.kecamatan = "Kecamatan wajib dipilih";
    if (!formData.kelurahan) newErrors.kelurahan = "Kelurahan wajib diisi";
    if (!formData.namaKetua) newErrors.namaKetua = "Nama ketua wajib diisi";
    if (!formData.nikKetua) newErrors.nikKetua = "NIK ketua wajib diisi";
    if (!formData.email) newErrors.email = "Email wajib diisi";
    if (!formData.telepon) newErrors.telepon = "Telepon wajib diisi";
    if (!formData.jumlahAnggota)
      newErrors.jumlahAnggota = "Jumlah anggota wajib diisi";
    if (!files.ktpKetua) newErrors.ktpKetua = "File KTP wajib diupload";
    if (!files.adArt) newErrors.adArt = "File AD/ART wajib diupload";
    if (!files.beritaAcara)
      newErrors.beritaAcara = "File Berita Acara wajib diupload";
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Lokasi pada peta wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi untuk mengirim notifikasi ke Discord
  const sendToDiscord = async (pengajuanData) => {
    const DISCORD_WEBHOOK_URL =
      "https://discord.com/api/webhooks/1432327468416630874/0a2FkNeHIHvwP6x9PHLEf5CHoX4FJWqDOBsRntpq1IZCjjmFBJG8ZbAJkHw_NTsauz3I";

    const tanggal = new Date().toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const embed = {
      title: "🏢 PENGAJUAN KOPERASI BARU",
      description: `Pengajuan koperasi baru telah diterima dari **${pengajuanData.namaKetua}**`,
      color: 3447003,
      fields: [
        {
          name: "📋 Nama Koperasi",
          value: pengajuanData.namaKoperasi,
          inline: false,
        },
        {
          name: "👤 Ketua Koperasi",
          value: pengajuanData.namaKetua,
          inline: true,
        },
        {
          name: "📞 Telepon",
          value: pengajuanData.telepon,
          inline: true,
        },
        {
          name: "📧 Email",
          value: pengajuanData.email,
          inline: false,
        },
        {
          name: "📍 Lokasi",
          value: `${pengajuanData.alamat}\nKecamatan: ${pengajuanData.kecamatan}`,
          inline: false,
        },
        {
          name: "👥 Jumlah Anggota",
          value: `${pengajuanData.jumlahAnggota} orang`,
          inline: true,
        },
      ],
      footer: {
        text: `ID Pengajuan: ${pengajuanData.id} | Dinas Koperasi Kota Bogor`,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Sistem Pengajuan Koperasi",
          avatar_url: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
          embeds: [embed],
        }),
      });
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (validate()) {
      setIsSubmitting(true);

      try {
        console.log("Submitting pengajuan to Supabase...", formData);

        // Submit ke Supabase
        const result = await submitPengajuan(formData, files);

        console.log("Supabase result:", result);

        if (result.success) {
          // Kirim notifikasi ke Discord
          await sendToDiscord({
            id: result.data.id,
            ...formData,
          });

          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          alert(`Gagal mengirim pengajuan: ${result.error}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto card text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Pengajuan Berhasil Dikirim!
            </h2>
            <p className="text-gray-600 mb-6">
              Terima kasih atas pengajuan pembentukan koperasi{" "}
              <strong>{formData.namaKoperasi}</strong>. Tim kami akan segera
              melakukan verifikasi dokumen dan menghubungi Anda dalam 3-5 hari
              kerja.
            </p>
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                Pengajuan Anda telah tersimpan di sistem
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Anda akan dihubungi melalui email atau telepon
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  namaKoperasi: "",
                  alamat: "",
                  kecamatan: "",
                  kelurahan: "",
                  namaKetua: "",
                  nikKetua: "",
                  email: "",
                  telepon: "",
                  jumlahAnggota: "",
                  modalAwal: "",
                  deskripsi: "",
                  latitude: null,
                  longitude: null,
                  alamatKoordinat: "",
                });
                setFiles({
                  ktpKetua: null,
                  adArt: null,
                  beritaAcara: null,
                });
              }}
              className="btn-primary"
            >
              Ajukan Lagi
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Form Pengajuan Koperasi</h1>
            <p className="text-xl text-primary-50">
              Isi formulir di bawah ini untuk mengajukan pembentukan koperasi
              baru
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Koperasi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="text-primary-600" />
                  Data Koperasi
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Koperasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaKoperasi"
                      value={formData.namaKoperasi}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.namaKoperasi
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Contoh: Koperasi Sejahtera"
                    />
                    {errors.namaKoperasi && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.namaKoperasi}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kecamatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="kecamatan"
                      value={formData.kecamatan}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.kecamatan ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Pilih Kecamatan</option>
                      <option value="Bogor Tengah">Bogor Tengah</option>
                      <option value="Bogor Utara">Bogor Utara</option>
                      <option value="Bogor Selatan">Bogor Selatan</option>
                      <option value="Bogor Timur">Bogor Timur</option>
                      <option value="Bogor Barat">Bogor Barat</option>
                    </select>
                    {errors.kecamatan && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.kecamatan}
                      </p>
                    )}
                  </div>

                  {/* Lokasi pada Peta - Menggunakan MapLocationPicker baru */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Lokasi pada Peta{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <MapLocationPicker
                        value={
                          formData.latitude && formData.longitude
                            ? {
                                lat: formData.latitude,
                                lng: formData.longitude,
                                label: formData.alamatKoordinat,
                                location: formData.alamatKoordinat,
                              }
                            : null
                        }
                        onChange={handleLocationSelect}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Tips:</strong> Cari nama tempat atau klik langsung
                      pada peta untuk memilih lokasi
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.alamat ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Alamat akan terisi otomatis saat memilih lokasi di peta, atau ketik manual di sini..."
                    />
                    {errors.alamat && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.alamat}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Alamat dapat diubah manual jika diperlukan
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kelurahan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="kelurahan"
                      value={formData.kelurahan}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.kelurahan ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nama Kelurahan"
                    />
                    {errors.kelurahan && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.kelurahan}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Data Pengurus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="text-primary-600" />
                  Data Ketua Koperasi
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="namaKetua"
                      value={formData.namaKetua}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.namaKetua ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.namaKetua && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.namaKetua}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.telepon ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.telepon && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.telepon}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nikKetua"
                      value={formData.nikKetua}
                      onChange={handleInputChange}
                      maxLength="16"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.nikKetua ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="16 digit NIK"
                    />
                    {errors.nikKetua && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.nikKetua}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Informasi Tambahan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UsersIcon className="text-primary-600" />
                  Informasi Tambahan
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jumlah Anggota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="jumlahAnggota"
                      value={formData.jumlahAnggota}
                      onChange={handleInputChange}
                      min="20"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                        errors.jumlahAnggota
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.jumlahAnggota && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.jumlahAnggota}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Minimal 20 anggota
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Modal Awal (Rp)
                    </label>
                    <input
                      type="number"
                      name="modalAwal"
                      value={formData.modalAwal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Usaha
                    </label>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Deskripsikan rencana usaha koperasi..."
                    />
                  </div>
                </div>
              </motion.div>

              {/* Upload Dokumen */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Upload className="text-primary-600" />
                  Upload Dokumen
                </h3>
                <div className="space-y-4">
                  {[
                    { key: "ktpKetua", label: "KTP Ketua", required: true },
                    { key: "adArt", label: "AD/ART", required: true },
                    {
                      key: "beritaAcara",
                      label: "Berita Acara Pembentukan",
                      required: true,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors"
                    >
                      <label className="cursor-pointer block">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-700">
                            {doc.label}
                            {doc.required && (
                              <span className="text-red-500"> *</span>
                            )}
                          </span>
                          {files[doc.key] && (
                            <CheckCircle className="text-green-500" size={20} />
                          )}
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, doc.key)}
                          className="hidden"
                        />
                        <div className="text-center">
                          {files[doc.key] ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle size={20} />
                              <span className="font-medium">
                                {files[doc.key]?.name}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <Upload
                                className="mx-auto mb-2 text-gray-400"
                                size={24}
                              />
                              <p className="text-sm text-gray-600">
                                Klik untuk upload file
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF, JPG, PNG (Max 5MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                      {errors[doc.key] && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors[doc.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-gray-100"
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle
                    className="text-primary-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Perhatian:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Pastikan semua data yang diisi sudah benar</li>
                      <li>
                        Dokumen yang diupload harus jelas dan dapat dibaca
                      </li>
                      <li>Proses verifikasi memakan waktu 3-5 hari kerja</li>
                    </ul>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className={`w-full btn-primary ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    "Kirim Pengajuan"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormPengajuan;
