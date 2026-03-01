import { v2Admin } from "@packages/api";

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
          <th className="border border-gray-300 px-4 py-2">역할</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
