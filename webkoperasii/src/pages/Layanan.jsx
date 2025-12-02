import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const Layanan = () => {
  const syaratKetentuan = [
    'Minimal 20 orang anggota pendiri.',
    'Akta pendirian koperasi yang disahkan oleh notaris.',
    'Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART).',
    'Surat keterangan domisili usaha.',
    'Nomor Pokok Wajib Pajak (NPWP).'
  ]

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Layanan Kami</h1>
            <p className="text-xl text-primary-50">
              Dinas Koperasi Kota Bogor menyediakan berbagai layanan untuk mendukung 
              pembentukan, pengembangan, dan keberlanjutan koperasi di Kota Bogor.
            </p>
          </div>
        </div>
      </section>

      {/* Syarat dan Ketentuan */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Title with Left Border */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-blue-600"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Syarat dan Ketentuan Pendaftaran</h2>
              </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
              {syaratKetentuan.map((syarat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      {syarat}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prosedur Layanan */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Prosedur Layanan</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Pengajuan Permohonan</h4>
                  <p className="text-gray-600">
                    Ajukan permohonan layanan melalui formulir online atau datang langsung ke kantor 
                    Dinas Koperasi Kota Bogor dengan membawa dokumen persyaratan.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Verifikasi Dokumen</h4>
                  <p className="text-gray-600">
                    Tim kami akan melakukan verifikasi terhadap kelengkapan dan keabsahan dokumen 
                    yang Anda ajukan.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Proses Layanan</h4>
                  <p className="text-gray-600">
                    Setelah dokumen terverifikasi, kami akan memproses permohonan Anda sesuai 
                    dengan jenis layanan yang dibutuhkan.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Penyelesaian</h4>
                  <p className="text-gray-600">
                    Anda akan menerima hasil layanan dan dapat melakukan konsultasi lanjutan 
                    jika diperlukan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl mb-8 text-primary-50">
            Tim kami siap membantu Anda. Hubungi kami untuk konsultasi lebih lanjut.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:02511234567" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Hubungi Kami
            </a>
            <a href="/form-pengajuan" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
              Ajukan Layanan
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Layanan
