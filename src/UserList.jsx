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

  return (
    <ul className="flex flex-col gap-4">
      {sortedUsers.map((user, index) => (
        <UserViewInList key={user.id} user={user} index={index} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  );
}
