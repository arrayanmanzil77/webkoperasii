import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import FormPengajuan from "./pages/FormPengajuan";
import Home from "./pages/Home";
import InformasiKoperasi from "./pages/InformasiKoperasi";
import Layanan from "./pages/Layanan";
import PetaKoperasi from "./pages/PetaKoperasi";
import Tentang from "./pages/Tentang";

// Admin Pages
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import KelolaKoperasi from "./pages/admin/KelolaKoperasi";
import KelolaPengajuan from "./pages/admin/KelolaPengajuan";
import Login from "./pages/admin/Login";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/layanan"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Layanan />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/peta-koperasi"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <PetaKoperasi />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/informasi-koperasi"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <InformasiKoperasi />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/form-pengajuan"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <FormPengajuan />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/tentang"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Tentang />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/koperasi"
          element={
            <ProtectedRoute>
              <KelolaKoperasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pengajuan"
          element={
            <ProtectedRoute>
              <KelolaPengajuan />
            </ProtectedRoute>
          }
        />

        {/* Redirect /admin to /admin/login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
