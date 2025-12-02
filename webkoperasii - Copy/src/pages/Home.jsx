import { motion } from "framer-motion";
import { Award, Target, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getKoperasiList, getPengajuanList } from "../lib/supabase";

const Home = () => {
  const [statsData, setStatsData] = useState({
    totalKoperasi: 0,
    totalAktif: 0,
    totalKecamatan: 6,
    totalPengajuan: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const [koperasiResult, pengajuanResult] = await Promise.all([
        getKoperasiList(),
        getPengajuanList(),
      ]);

      if (koperasiResult.success && pengajuanResult.success) {
        const koperasiData = koperasiResult.data;
        const pengajuanData = pengajuanResult.data;

        setStatsData({
          totalKoperasi: koperasiData.length,
          totalAktif: koperasiData.filter((k) => k.status === "Aktif").length,
          totalKecamatan: 6,
          totalPengajuan: pengajuanData.length,
        });
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Pembentukan Koperasi",
      description: "Panduan dan bantuan dalam proses pembentukan koperasi baru",
    },
    {
      icon: <Target className="w-8 h-8 text-primary-600" />,
      title: "Pembinaan",
      description:
        "Program pembinaan dan pelatihan untuk pengembangan koperasi",
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: "Sertifikasi",
      description: "Pengurusan perizinan dan sertifikasi koperasi",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: "Pengembangan Usaha",
      description: "Konsultasi dan pendampingan pengembangan usaha koperasi",
    },
  ];

  const stats = [
    {
      number: loading ? "..." : `${statsData.totalKoperasi}`,
      label: "Koperasi Terdaftar",
    },
    {
      number: loading ? "..." : `${statsData.totalAktif}`,
      label: "Koperasi Aktif",
    },
    { number: `${statsData.totalKecamatan}`, label: "Kecamatan" },
    { number: "100%", label: "Komitmen Pelayanan" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
        <div className="container-custom py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/img/logojambi.png"
                  alt="Logo Dinas Koperasi"
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                />
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Dinas Koperasi Kota Bogor
                </h1>
              </div>
              <p className="text-lg lg:text-xl mb-8 text-primary-50">
                Membangun ekonomi kerakyatan melalui pemberdayaan koperasi yang
                tangguh, modern, dan berdaya saing untuk kesejahteraan
                masyarakat Kota Bogor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/form-pengajuan"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Ajukan Koperasi Baru
                </Link>
                <Link
                  to="/layanan"
                  className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Lihat Layanan
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold mb-2">
                        {stat.number}
                      </div>
                      <div className="text-primary-100 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tentang Singkat */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tentang Dinas Koperasi
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Dinas Koperasi Kota Bogor hadir sebagai lembaga pemerintah yang
              berkomitmen untuk mengembangkan dan memberdayakan koperasi di
              wilayah Kota Bogor. Kami memberikan berbagai layanan untuk
              mendukung pertumbuhan koperasi yang sehat dan berkelanjutan.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card text-center group hover:border-primary-300 border border-transparent transition-all cursor-pointer"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Koperasi Anda?
          </h2>
          <p className="text-xl mb-8 text-primary-50">
            Bergabunglah dengan ratusan koperasi yang telah berkembang bersama
            kami
          </p>
          <Link
            to="/form-pengajuan"
            className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
          >
            Ajukan Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
