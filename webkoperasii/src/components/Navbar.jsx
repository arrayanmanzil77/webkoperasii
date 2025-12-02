import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "LAYANAN", path: "/layanan" },
    { name: "PETA KOPERASI", path: "/peta-koperasi" },
    { name: "INFORMASI KOPERASI", path: "/informasi-koperasi" },
    { name: "TENTANG", path: "/tentang" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-[1000]">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/img/logojambi.png"
              alt="Logo Dinas Koperasi"
              className="w-12 h-12 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="font-bold text-lg text-gray-800">
                Dinas Koperasi
              </h1>
              <p className="text-xs text-gray-600">Kota Bogor</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <Link to="/form-pengajuan" className="hidden lg:block btn-primary">
            Ajukan Koperasi
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden py-4 border-t overflow-hidden"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-primary-600 text-white"
                      : "text-gray-700 hover:bg-primary-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/form-pengajuan"
                onClick={() => setIsOpen(false)}
                className="block mt-4 text-center btn-primary"
              >
                Ajukan Koperasi
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
