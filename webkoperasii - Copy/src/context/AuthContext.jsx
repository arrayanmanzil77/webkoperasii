import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("adminSession");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Restored user from localStorage:", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("No stored user found");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("adminSession");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log("Attempting login with:", { username });

      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      console.log("Supabase response:", {
        data: data ? "User found" : "No user",
        error,
      });

      if (error) {
        console.error("Supabase error:", error);

        if (error.code === "PGRST116") {
          return { success: false, message: "Username atau password salah" };
        }

        return { success: false, message: `Database error: ${error.message}` };
      }

      if (!data) {
        return { success: false, message: "Username atau password salah" };
      }

      const userData = {
        id: data.id, 
        username: data.username,
        name: data.name,
        role: data.role,
      };

      console.log("Login successful, user data:", userData);

      setUser(userData);
      localStorage.setItem("adminSession", JSON.stringify(userData)); 
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: `Terjadi kesalahan saat login: ${error.message}`,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminSession");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
