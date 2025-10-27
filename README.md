<!-- LOGOUT USAGE EXAMPLE -->

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
const { logout } = useAuth();
const router = useRouter();

useEffect(() => {
logout();
router.push("/login"); // redirect after logout
}, [logout, router]);

return <p>Logging out...</p>;
}
