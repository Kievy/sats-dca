"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { PageTitle } from "@/frontend/components/page-title";
import { Panel } from "@/frontend/components/panel";
import { getMyProfile, listAppUsers, type AppUserListItem } from "@/backend/services/users";
import { formatDateTime } from "@/frontend/lib/date";

export default function UsuariosPage() {
  const [users, setUsers] = useState<AppUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoading(true);
      const profile = await getMyProfile();

      if (!active) {
        return;
      }

      if (profile.data?.role !== "admin") {
        setError("Acesso permitido apenas para admins.");
        setLoading(false);
        return;
      }

      const result = await listAppUsers();

      if (!active) {
        return;
      }

      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.data ?? []);
      }

      setLoading(false);
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageTitle icon={Users} title="Usuarios" />

      <Panel title={`Usuarios cadastrados (${users.length})`} icon={<Users size={20} className="text-bitcoin" />}>
        {loading ? <p className="text-sm font-semibold text-muted">Carregando usuarios...</p> : null}

        {error ? (
          <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-xs uppercase text-muted">
                <tr className="border-b border-line">
                  <th className="py-4">Nome</th>
                  <th>Role</th>
                  <th>Ultimo login</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-line">
                    <td className="py-4">{user.username}</td>
                    <td>
                      <span className="rounded-lg bg-bitcoin/10 px-2 py-1 text-xs uppercase text-bitcoin">
                        {user.role}
                      </span>
                    </td>
                    <td className="text-muted">{formatDateTime(user.last_sign_in_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Panel>
    </>
  );
}
