import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useCallback } from "react";

export default function Header() {
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    await api.post("/api/auth/logout");
    router.push("/");
  }, [router]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50 flex items-center justify-between px-6 py-3">
      <Link href="/" className="text-xl font-bold text-blue-900">MedConnect</Link>
      <nav className="flex items-center space-x-6">
        <Link href="/feed" className="text-blue-700 hover:underline">Feed</Link>
        <Link href="/jobs" className="text-blue-700 hover:underline">Jobs</Link>
        <Link href="/colleges" className="text-blue-700 hover:underline">Colleges</Link>
        <Link href="/hospitals" className="text-blue-700 hover:underline">Hospitals</Link>
        <Link href="/connections" className="text-blue-700 hover:underline">Connections</Link>
        <Link href="/login" className="text-blue-700 hover:underline">Login</Link>
        <Link href="/signup" className="text-blue-700 hover:underline">Signup</Link>
        <button onClick={handleLogout} className="text-blue-700 hover:underline">Logout</button>
      </nav>
    </header>
  );
}
