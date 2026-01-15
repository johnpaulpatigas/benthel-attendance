import { School } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student",
    studentId: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("students")
      .select("id, first_name, last_name")
      .then(({ data }) => setStudents(data || []));
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          role: form.role,
          student_id: form.studentId || null,
        },
      },
    });
    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("Account created successfully!");
      navigate("/");
    }
  };

  const inputClasses =
    "block w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all";

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-gray-50 to-slate-100 p-4">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg shadow-indigo-500/30">
            <School className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join the school attendance system
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm leading-6 font-medium text-gray-700">
                First Name
              </label>
              <input
                required
                className={`mt-1 ${inputClasses}`}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm leading-6 font-medium text-gray-700">
                Last Name
              </label>
              <input
                required
                className={`mt-1 ${inputClasses}`}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm leading-6 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className={`mt-1 ${inputClasses}`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm leading-6 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className={`mt-1 ${inputClasses}`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm leading-6 font-medium text-gray-700">
              Role
            </label>
            <select
              className={`mt-1 ${inputClasses}`}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {(form.role === "student" || form.role === "parent") && (
            <div>
              <label className="block text-sm leading-6 font-medium text-gray-700">
                Link to Student
              </label>
              <select
                required
                className={`mt-1 ${inputClasses}`}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
              >
                <option value="">Select a student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full transform justify-center rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
