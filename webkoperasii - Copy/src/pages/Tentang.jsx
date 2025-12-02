import { Eye, Target } from "lucide-react";

const Tentang = () => {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
            <p className="text-xl text-primary-50">
              Mengenal lebih dekat Dinas Koperasi Kota Bogor
            </p>
          </div>
        </div>
      </section>

      {/* Profil */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <img
                src="/img/logojambi.png"
                alt="Logo Dinas Koperasi"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-center mb-8">
              Profil Dinas
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Dinas Koperasi Kota Bogor adalah lembaga pemerintah daerah yang
                bertanggung jawab dalam pembinaan, pengembangan, dan pengawasan
                koperasi di wilayah Kota Bogor. Kami berkomitmen untuk membangun
                ekonomi kerakyatan yang kuat melalui pemberdayaan koperasi
                sebagai soko guru perekonomian nasional.
              </p>
              <p>
                Dengan pengalaman lebih dari 20 tahun, kami telah membantu
                ratusan koperasi tumbuh dan berkembang, memberikan dampak
                positif bagi kesejahteraan masyarakat Kota Bogor. Kami
                menyediakan berbagai layanan mulai dari pembentukan, pembinaan,
                hingga pengembangan usaha koperasi.
              </p>
              <p>
                Tim kami terdiri dari profesional berpengalaman yang siap
                memberikan bimbingan dan dukungan kepada koperasi untuk mencapai
                tujuan bersama dalam memajukan ekonomi kerakyatan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Visi */}
            <div className="card border-l-4 border-primary-600">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-10 h-10 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Visi</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "Mewujudkan koperasi yang sehat, kuat, mandiri, dan berdaya
                saing sebagai pilar utama perekonomian Kota Bogor yang
                berkeadilan dan berkelanjutan menuju masyarakat sejahtera pada
                tahun 2025."
              </p>
            </div>

            {/* Misi */}
            <div className="card border-l-4 border-primary-600">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-10 h-10 text-primary-600" />
                <h3 className="text-2xl font-bold text-gray-900">Misi</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2 font-bold">1.</span>
                  <span>
                    Meningkatkan kualitas kelembagaan dan manajemen koperasi
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2 font-bold">2.</span>
                  <span>
                    Mengembangkan usaha koperasi yang produktif dan kompetitif
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2 font-bold">3.</span>
                  <span>
                    Meningkatkan kesadaran dan partisipasi masyarakat
                    berkoperasi
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2 font-bold">4.</span>
                  <span>
                    Memberikan pelayanan prima dan bimbingan berkelanjutan
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Bergabunglah Dengan Kami</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Mari bersama membangun koperasi yang kuat untuk kesejahteraan
            bersama
          </p>
          <a href="/form-pengajuan" className="btn-primary">
            Ajukan Koperasi Baru
          </a>
        </div>
      </section>
    </div>
  );
};

export default Tentang;
