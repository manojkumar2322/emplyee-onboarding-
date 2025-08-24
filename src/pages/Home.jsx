import { Link } from "react-router-dom";
import "./Home.css"; // you can delete if not needed

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with logo only */}
      <header className="p-6">
        <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
      </header>

      {/* Centered content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow p-8 space-y-6 text-center">
          <h1 className="text-2xl font-bold">Employee Onboarding</h1>
          <Link
            to="/new"
            className="block w-full text-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:opacity-90"
          >
            New Form
          </Link>
          <Link
            to="/view"
            className="block w-full text-center px-6 py-3 rounded-xl bg-gray-800 text-white hover:opacity-90"
          >
            View Forms
          </Link>
        </div>
      </div>
    </div>
  );
}
