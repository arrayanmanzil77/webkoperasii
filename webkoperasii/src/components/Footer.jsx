import { MapPin, Instagram, Mail, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/img/logojambi.png" 
                alt="Logo Dinas Koperasi" 
                className="w-12 h-12 object-contain"
              />
              <h3 className="text-white font-bold text-lg">Dinas Koperasi<br/>Kota Bogor</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Memberdayakan koperasi untuk kesejahteraan masyarakat Kota Bogor melalui pembinaan dan pengembangan berkelanjutan.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <p className="text-sm">Jl. Dadali II No.3, RT.01/RW.05, Tanah Sareal, Kec. Tanah Sereal, Kota Bogor, Jawa Barat 16161</p>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram size={18} className="flex-shrink-0" />
                <a href="https://instagram.com/dinas_kukmdagin_kotabogor" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary-400 transition-colors">@dinas_kukmdagin_kotabogor</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <a href="mailto:koperasi@kotabogor.go.id" className="text-sm hover:text-primary-400 transition-colors">koperasi@kotabogor.go.id</a>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Jam Operasional</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Clock size={18} className="mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-white">Senin - Jumat</p>
                  <p>08:00 - 16:00 WIB</p>
                </div>
              </div>
              <div className="text-sm ml-8">
                <p className="font-semibold text-white">Sabtu - Minggu</p>
                <p>Tutup</p>
              </div>
            </div>
          </div>

          {/* Link Cepat */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/layanan" className="hover:text-primary-400 transition-colors">Layanan</a>
              </li>
              <li>
                <a href="/peta-koperasi" className="hover:text-primary-400 transition-colors">Peta Koperasi</a>
              </li>
              <li>
                <a href="/informasi-koperasi" className="hover:text-primary-400 transition-colors">Informasi Koperasi</a>
              </li>
              <li>
                <a href="/form-pengajuan" className="hover:text-primary-400 transition-colors">Form Pengajuan</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Dinas Koperasi Kota Bogor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
