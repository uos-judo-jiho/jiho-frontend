import { RouterUrl } from "@/app/routers/router-url";
import { Badge } from "@/components/common/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { v2Admin } from "@packages/api";
import { Link } from "react-router-dom";
import { getUserRole } from "../utils/get-user-role";

export const UserTable = () => {
  const { data: users } = v2Admin.useGetApiV2AdminUsersSuspense({
    axios: { withCredentials: true },
    query: {
      select: (data) => data.data.users,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:none">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>이메일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/90">
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>
                <Link to={RouterUrl.회원.상세({ id: user.id })}>
                  <div className="flex items-center gap-2">
                    <Badge
                      theme={
                        ["root", "president", "manager"].includes(user.role)
                          ? "blue"
                          : "gray"
                      }
                    >
                      {getUserRole(user.role)}
                    </Badge>
                    {user.email}
                  </div>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
