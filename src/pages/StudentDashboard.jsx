import { Calendar, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function StudentDashboard() {
  const [logs, setLogs] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("student_id, students(first_name, last_name)")
        .eq("id", user.id)
        .single();
      if (prof) {
        setName(`${prof.students.first_name} ${prof.students.last_name}`);
        setStudentId(prof.student_id);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchLogs = async () => {
      const { data: att } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });
      setLogs(att || []);
    };

    fetchLogs();

    const sub = supabase
      .channel(`student-attendance-${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `student_id=eq.${studentId}`,
        },
        fetchLogs,
      )
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, [studentId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="mb-8 bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Student Portal
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-lg leading-6 font-semibold text-gray-900">
            Attendance Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Record for <span className="font-medium text-gray-900">{name}</span>
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base leading-6 font-semibold text-gray-900">
                Attendance Log
              </h3>
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                Total Present: {logs.length}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-gray-500">
                No attendance records found.
              </li>
            ) : (
              logs.map((log) => (
                <li key={log.id} className="px-4 py-4 hover:bg-gray-50 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-100 p-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="truncate text-sm font-medium text-indigo-600">
                        {new Date(log.created_at).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">
                        Check-in:{" "}
                        <span className="font-mono font-medium text-gray-900">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}