"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/login");
      }
      setCheckingAuth(false); // stop showing spinner
    }
  }, [user, loading, router]);

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background/80 backdrop-blur-sm">
        <Spinner className="size-8 text-pink-600" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
