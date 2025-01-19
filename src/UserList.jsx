import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

function UserViewInList({ user, index, onDelete, onEdit }) {
  return (
    <li key={index} className="text-white border rounded-md p-2">
      <div className="flex gap-2">
        <span>{user.id}</span>
        <span>{user.firstName}</span>
        <span>{user.lastName}</span>
        <span>{user.age}</span>
        <span>{user.email}</span>
        <span>{user.website}</span>
        <span>{user.country}</span>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          className="px-6 py-1 mr-3 bg-stone-600 border-stone-600 border-solid rounded-lg"
          onClick={() => onEdit(user.id)}
        >
          Edit
        </button>
        <button
          className="px-6 py-1 bg-red-600 border-red-600 border-solid rounded-lg"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default function UserList({ users, onDelete, onEdit }) {
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

  console.log("Average Age:", averageAge);
  console.log("Age Groups:", ageGroups);

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {sortedUsers.map((user, index) => (
          <UserViewInList key={user.id} user={user} index={index} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </ul>
        <div className="text-white font-bold text-2xl my-3">
        <p>Average Age: {averageAge}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-white text-2xl font-bold mb-2">User Age</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart 
           data={chartData}
           barSize={30}>
            <XAxis dataKey="ageRange" stroke="#ffffff" />
            <YAxis stroke="#ffffff" interval={1}/>
            <Tooltip />
            <Bar dataKey="users" fill="#009fff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
  );
}
