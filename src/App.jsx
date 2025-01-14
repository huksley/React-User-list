import { useState, useEffect, useRef } from "react";
import "./App.css";
import UserForm from "./UserForm";
import UserList from "./UserList";
import useSWR from "swr";

export default function App() {
  const [action, setAction] = useState("");
  const [editedUser, setEditedUser] = useState(undefined);
  const { data: users, mutate } = useSWR("/api/user", (key) => fetch(key).then((res) => res.json()));

  function handleOnCancel() {
    setAction("");
  }

  // Add a new user => POST /api/user
  function handleOnSave(newUser) {
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).then((res) => res.json().then(() => mutate()));
    setAction("");
  }

  // Edit existing user => PATCH /api/user/:id
  function handleOnSaveEdit(editUser) {
    fetch("/api/user/" + editUser.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editUser),
    }).then((res) => res.json().then(() => mutate()));
    setEditedUser(undefined);
    setAction("");
  }

  function handleOnEdit(id) {
    setEditedUser(users.find((user) => user.id === id));
    setAction("edit");
  }

  function handleDeleteUser(id) {
    fetch("/api/user/" + id, {
      method: "DELETE",
    }).then((res) => res.json().then(() => mutate()));
  }

  return (
    <main>
      {users == null || users == undefined ? (
        "Loading.."
      ) : action == "edit" ? (
        <UserForm
          title="Edit user"
          user={editedUser}
          onCancel={handleOnCancel}
          onSave={handleOnSaveEdit}
          users={users}
        />
      ) : action == "form" ? (
        <UserForm title="Add user" onCancel={handleOnCancel} onSave={handleOnSave} users={users} />
      ) : (
        <div>
          <h2 className="text-white text-3xl font-bold p-1 mb-3">User list ({users.length})</h2>
          <UserList users={users} onEdit={handleOnEdit} onDelete={handleDeleteUser} />
          <button
            className="px-6 py-1 mt-6 bg-neutral-400 border-neutral-400 border-solid rounded-lg"
            onClick={() => setAction("form")}
          >
            Add new
          </button>
        </div>
      )}
    </main>
  );
}
