import { Badge } from "@/components/common/badge";
import { v2Admin } from "@packages/api";
import { getUserRole } from "../utils/get-user-role";

export const UserTable = () => {
  const { data: users } = v2Admin.useGetApiV2AdminUsersSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.users,
    },
  });

  return (
    <table className="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">이메일</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">
              <div className="flex items-center gap-2">
                <span>{user.id}</span>
                <Badge
                  theme={
                    ["root", "president", "manager"].includes(user.role)
                      ? "blue"
                      : "gray"
                  }
                >
                  {getUserRole(user.role)}
                </Badge>
              </div>
            </td>
            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
