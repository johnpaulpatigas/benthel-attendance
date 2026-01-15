import { LogOut, Pencil, Save, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    rfid_tag: "",
    class_name: "",
  });
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("*")
      .order("first_name");
    setStudents(data || []);
  };

  useEffect(() => {
    const init = async () => {
      await fetchStudents();
    };
    init();

    const sub = supabase
      .channel("students-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        fetchStudents,
      )
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("students")
        .update(form)
        .eq("id", editingId);

      if (error) alert(error.message);
      else setEditingId(null);
    } else {
      const { error } = await supabase.from("students").insert([form]);
      if (error) alert(error.message);
    }

    setForm({ first_name: "", last_name: "", rfid_tag: "", class_name: "" });
    fetchStudents();
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setForm({
      first_name: student.first_name,
      last_name: student.last_name,
      rfid_tag: student.rfid_tag,
      class_name: student.class_name,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ first_name: "", last_name: "", rfid_tag: "", class_name: "" });
  };

  const inputClasses =
    "mt-1 block w-full rounded-lg border-0 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-10 mb-8 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
              <UserPlus size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {editingId && (
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <X size={16} /> Cancel Edit
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    editingId
                      ? "bg-amber-100 text-amber-600"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingId ? "Edit Student" : "New Registration"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingId
                      ? "Update student details"
                      : "Add a new student to the system"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm leading-6 font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    value={form.first_name}
                    required
                    placeholder="John"
                    className={inputClasses}
                    onChange={(e) =>
                      setForm({ ...form, first_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-6 font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    value={form.last_name}
                    required
                    placeholder="Doe"
                    className={inputClasses}
                    onChange={(e) =>
                      setForm({ ...form, last_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-6 font-medium text-gray-700">
                    RFID Tag UID
                  </label>
                  <input
                    value={form.rfid_tag}
                    required
                    placeholder="UID"
                    className={inputClasses}
                    onChange={(e) =>
                      setForm({ ...form, rfid_tag: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-6 font-medium text-gray-700">
                    Class Name
                  </label>
                  <input
                    value={form.class_name}
                    required
                    placeholder="11-STEM"
                    className={inputClasses}
                    onChange={(e) =>
                      setForm({ ...form, class_name: e.target.value })
                    }
                  />
                </div>
                <button
                  className={`mt-6 flex w-full transform items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 ${
                    editingId
                      ? "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
                      : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  }`}
                >
                  {editingId ? <Save size={18} /> : <UserPlus size={18} />}
                  {editingId ? "Update Student" : "Register Student"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base leading-6 font-semibold text-gray-900">
                      Student Directory
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Total registered: {students.length}
                    </p>
                  </div>
                </div>
              </div>
              {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-100 p-3">
                    <UserPlus className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No students found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by registering a new student.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {students.map((s) => (
                    <li
                      key={s.id}
                      className="group flex items-center justify-between gap-x-6 px-6 py-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                            {s.first_name[0]}
                            {s.last_name[0]}
                          </div>
                          <p className="text-sm leading-6 font-semibold text-gray-900">
                            {s.first_name} {s.last_name}
                          </p>
                          <p className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/10 ring-inset">
                            {s.class_name}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-x-2 pl-11 text-xs leading-5 text-gray-500">
                          <span className="font-mono text-[10px] text-gray-400">
                            RFID:
                          </span>
                          <span className="font-mono">{s.rfid_tag}</span>
                        </div>
                      </div>
                      <div className="flex flex-none items-center gap-x-4">
                        <button
                          onClick={() => startEdit(s)}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset group-hover:ring-indigo-200 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
