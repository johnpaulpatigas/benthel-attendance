import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { supabase } from "./supabaseClient";

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (user) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    setRole(data?.role || user.user_metadata?.role);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchRole(session.user);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setLoading(true);
        fetchRole(session.user);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading application...
          </p>
        </div>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!session ? <Login /> : <Navigate to={`/${role}`} />}
        />
        <Route path="/signup" element={<SignUp />} />
        {role === "admin" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
        {role === "teacher" && (
          <Route path="/teacher" element={<TeacherDashboard />} />
        )}
        {(role === "student" || role === "parent") && (
          <>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/parent" element={<StudentDashboard />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
