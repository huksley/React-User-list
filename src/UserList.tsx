import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { User } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

function UserViewInList({
  user,
  index,
  onDelete,
  onEdit,
}: {
  user: User;
  index: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p className="text-lg font-semibold">{user.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Country</p>
            <p className="text-lg font-semibold">{user.country}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(user.id)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserList({
  users,
  onDelete,
  onEdit,
}: {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const sortedUsers = [...users].sort((a, b) => a.age - b.age);

  const averageAge = useMemo(() => {
    if (users.length === 0) return 0;
    const totalAge = users.reduce((sum, user) => sum + (user.age ?? 0), 0);
    return (totalAge / users.length).toFixed(2);
  }, [users]);

  const ageGroups = useMemo(() => {
    const ageCounts = { "18-25": 0, "26-35": 0, "36-45": 0, "46+": 0 };

    users.forEach((user) => {
      if (user.age >= 18 && user.age <= 25) {
        ageCounts["18-25"]++;
      } else if (user.age >= 26 && user.age <= 35) {
        ageCounts["26-35"]++;
      } else if (user.age >= 36 && user.age <= 45) {
        ageCounts["36-45"]++;
      } else if (user.age >= 46) {
        ageCounts["46+"]++;
      }
    });

    return ageCounts;
  }, [users]);

  const chartData = useMemo(() => {
    return Object.entries(ageGroups).map(([range, count]) => ({
      ageRange: range,
      users: count,
    }));
  }, [ageGroups]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Average Age: {averageAge}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={30}>
                <XAxis dataKey="ageRange" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" interval={1} />
                <Tooltip />
                <Bar dataKey="users" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {sortedUsers.map((user, index) => (
          <UserViewInList
            key={user.id}
            user={user}
            index={index}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
