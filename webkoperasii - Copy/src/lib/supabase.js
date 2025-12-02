import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  url: supabaseUrl,
  key: supabaseAnonKey ? "Key loaded" : "Key missing",
}); // Debug log

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function untuk cek koneksi
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("admin")
      .select("count(*)")
      .single();

    if (error) {
      console.error("Connection test failed:", error);
      return false;
    }

    console.log("Connection test successful:", data);
    return true;
  } catch (error) {
    console.error("Connection test error:", error);
    return false;
  }
};

// Storage helper functions
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};

export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
};

// Helper functions untuk pengajuan koperasi
export const submitPengajuan = async (pengajuanData, files) => {
  try {
    console.log("Starting submitPengajuan...", { pengajuanData, files });

    // Upload file KTP, AD/ART, dan Berita Acara
    const fileUrls = {};

    for (const key of ["ktpKetua", "adArt", "beritaAcara"]) {
      const file = files[key];
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `pengajuan/${fileName}`;

        console.log(`Uploading ${key}:`, filePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("pengajuan-documents")
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Upload error for ${key}:`, uploadError);
          throw uploadError;
        }

        console.log(`Upload success for ${key}:`, uploadData);

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("pengajuan-documents").getPublicUrl(filePath);

        fileUrls[key] = publicUrl;
        console.log(`Public URL for ${key}:`, publicUrl);
      }
    }

    console.log("All files uploaded, URLs:", fileUrls);

    // Insert data pengajuan dengan koordinat
    const insertData = {
      nama_koperasi: pengajuanData.namaKoperasi,
      alamat_lengkap: pengajuanData.alamat,
      kelurahan: pengajuanData.kelurahan || "-",
      kecamatan: pengajuanData.kecamatan,
      nama_ketua: pengajuanData.namaKetua,
      nik_ketua: pengajuanData.nikKetua,
      email_ketua: pengajuanData.email,
      no_hp_ketua: pengajuanData.telepon,
      jumlah_anggota: parseInt(pengajuanData.jumlahAnggota),
      latitude: pengajuanData.latitude,
      longitude: pengajuanData.longitude,
      file_ktp_ketua: fileUrls.ktpKetua || null,
      file_ad_art: fileUrls.adArt || null,
      file_berita_acara: fileUrls.beritaAcara || null,
      status: "pending",
    };

    console.log("Inserting data:", insertData);

    const { data, error } = await supabase
      .from("pengajuan_koperasi")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    console.log("Insert success:", data);

    return { success: true, data };
  } catch (error) {
    console.error("Error in submitPengajuan:", error);
    return { success: false, error: error.message };
  }
};

export const getPengajuanList = async (filters = {}) => {
  try {
    let query = supabase
      .from("pengajuan_koperasi")
      .select("*")
      .order("tanggal_pengajuan", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.kecamatan && filters.kecamatan !== "Semua") {
      query = query.eq("kecamatan", filters.kecamatan);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error getting pengajuan:", error);
    return { success: false, error: error.message };
  }
};

// Helper function untuk mendapatkan admin ID dari session
export const getCurrentAdminId = () => {
  // Ambil dari localStorage atau session storage
  const adminData = localStorage.getItem("adminSession");
  if (adminData) {
    const parsed = JSON.parse(adminData);
    return parsed.id || parsed.admin_id; // Tidak perlu fallback ke 1 karena UUID
  }

  // Jika tidak ada session, return null - admin harus login
  return null;
};

export const updatePengajuanStatus = async (
  id,
  status,
  catatan,
  adminId = null
) => {
  try {
    // Jika adminId tidak diberikan, ambil dari session
    const processedBy = adminId || getCurrentAdminId();

    // Validasi admin ID tersedia
    if (!processedBy) {
      throw new Error("Admin ID tidak tersedia. Silakan login ulang.");
    }

    const { data, error } = await supabase
      .from("pengajuan_koperasi")
      .update({
        status,
        catatan_admin: catatan,
        tanggal_diproses: new Date().toISOString(),
        diproses_oleh: processedBy,
        updated_at: new Date().toISOString(), // Update timestamp
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    console.log("Status updated by admin ID:", processedBy); // Debug log

    return { success: true, data };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
};

export const getPengajuanById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("pengajuan_koperasi")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error getting pengajuan:", error);
    return { success: false, error: error.message };
  }
};

// ============= KOPERASI FUNCTIONS =============

// Get all koperasi dengan filter
export const getKoperasiList = async (filters = {}) => {
  try {
    let query = supabase
      .from("koperasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.kecamatan && filters.kecamatan !== "Semua") {
      query = query.eq("kecamatan", filters.kecamatan);
    }

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error getting koperasi:", error);
    return { success: false, error: error.message };
  }
};

// Get koperasi by ID
export const getKoperasiById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("koperasi")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error getting koperasi:", error);
    return { success: false, error: error.message };
  }
};

// Create new koperasi - SUDAH BENAR, tidak ada field jenis
export const createKoperasi = async (koperasiData) => {
  try {
    const insertData = {
      nama_koperasi: koperasiData.nama,
      alamat_lengkap: koperasiData.alamat,
      kelurahan: koperasiData.kelurahan,
      kecamatan: koperasiData.kecamatan,
      latitude: koperasiData.latitude || null,
      longitude: koperasiData.longitude || null,
      status: koperasiData.status || "Aktif",
    };

    const { data, error } = await supabase
      .from("koperasi")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error creating koperasi:", error);
    return { success: false, error: error.message };
  }
};

// Update koperasi - SUDAH BENAR, tidak ada field jenis
export const updateKoperasi = async (id, koperasiData) => {
  try {
    const updateData = {
      nama_koperasi: koperasiData.nama,
      alamat_lengkap: koperasiData.alamat,
      kelurahan: koperasiData.kelurahan,
      kecamatan: koperasiData.kecamatan,
      latitude: koperasiData.latitude || null,
      longitude: koperasiData.longitude || null,
      status: koperasiData.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("koperasi")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating koperasi:", error);
    return { success: false, error: error.message };
  }
};

// Delete koperasi
export const deleteKoperasi = async (id) => {
  try {
    const { error } = await supabase.from("koperasi").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting koperasi:", error);
    return { success: false, error: error.message };
  }
};

// Toggle status koperasi (Aktif/Nonaktif)
export const toggleKoperasiStatus = async (id, currentStatus) => {
  try {
    const newStatus = currentStatus === "Aktif" ? "Nonaktif" : "Aktif";

    const { data, error } = await supabase
      .from("koperasi")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error toggling status:", error);
    return { success: false, error: error.message };
  }
};
