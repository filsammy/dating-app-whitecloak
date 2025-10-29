"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Ban, Unlock } from "lucide-react";
import { getBlockedUsers, unblockUser } from "@/api/block";
import { Button } from "@/components/ui/button";

interface BlockedUser {
  _id: string;
  email: string;
}

export default function BlockedUsersPage() {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState<string | null>(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      const data = await getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error("Failed to load blocked users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to unblock ${email}?`)) return;

    setUnblocking(userId);
    try {
      await unblockUser(userId);
      await loadBlockedUsers();
    } catch (err: any) {
      console.error("Failed to unblock user:", err);
      alert(err?.message || "Failed to unblock user");
    } finally {
      setUnblocking(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8 text-pink-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Ban className="size-6 text-red-600" />
              Blocked Users
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users you've blocked
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {blockedUsers.length === 0 ? (
              <div className="text-center py-12">
                <Ban className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Blocked Users
                </h3>
                <p className="text-sm text-muted-foreground">
                  You haven't blocked anyone yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {blockedUsers.map((blockedUser) => (
                  <div
                    key={blockedUser._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Ban className="size-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{blockedUser.email}</h3>
                        <p className="text-xs text-muted-foreground">
                          User ID: {blockedUser._id}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleUnblock(blockedUser._id, blockedUser.email)
                      }
                      disabled={unblocking === blockedUser._id}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Unlock className="size-4 mr-2" />
                      {unblocking === blockedUser._id
                        ? "Unblocking..."
                        : "Unblock"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {blockedUsers.length > 0 && (
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-muted-foreground text-center">
                {blockedUsers.length}{" "}
                {blockedUsers.length === 1 ? "user" : "users"} blocked
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
