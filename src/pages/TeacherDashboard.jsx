import { Activity, LogOut, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function TeacherDashboard() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  async function fetchLogs() {
    const { data } = await supabase
      .from("attendance")
      .select("*, students(first_name, last_name, class_name)")
      .order("created_at", { ascending: false });
    setLogs(data || []);
  }

  useEffect(() => {
    const init = async () => {
      await fetchLogs();
    };
    init();

    const sub = supabase
      .channel("attendance")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        fetchLogs,
      )
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-10 mb-8 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
              <Activity size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Teacher Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold leading-6 text-gray-900">
              Live Attendance Feed
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time student check-ins
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            Live Monitoring
          </span>
        </div>

        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="rounded-full bg-gray-50 p-4">
                <UserCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                No check-ins yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Attendance records will appear here in real-time.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10 group-hover:bg-emerald-100 transition-colors">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {log.students?.first_name} {log.students?.last_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {log.students?.class_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
