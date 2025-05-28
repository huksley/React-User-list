import { useState } from "react";
import "./App.css";
import UserForm from "./UserForm";
import UserList from "./UserList";
import useSWR from "swr";
import { User } from "./types";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";

export default function App() {
  const [action, setAction] = useState("");
  const [editedUser, setEditedUser] = useState<User | undefined>();
  const { data: users, mutate } = useSWR<User[]>("/api/user", (key: string) => fetch(key).then((res) => res.json()));

  function handleOnCancel() {
    setAction("");
  }

  // Add a new user => POST /api/user
  function handleOnSave(newUser: User) {
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
  function handleOnSaveEdit(editUser: User) {
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

  function handleOnEdit(id: number) {
    setEditedUser(users?.find((user) => user.id === id));
    setAction("edit");
  }

  function handleDeleteUser(id: number) {
    fetch("/api/user/" + id, {
      method: "DELETE",
    }).then((res) => res.json().then(() => mutate()));
  }

  return (
    <main className="container mx-auto py-8 px-4">
      {users == null || users == undefined ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : action == "edit" ? (
        <UserForm
          title="Edit user"
          user={editedUser}
          onCancel={handleOnCancel}
          onSave={handleOnSaveEdit}
          users={users}
        />
      ) : action == "form" ? (
        <UserForm
          title="Add user"
          onCancel={handleOnCancel}
          onSave={handleOnSave}
          users={users}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <Button
              onClick={() => setAction("form")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New User
            </Button>
          </div>
          <UserList
            users={users}
            onEdit={handleOnEdit}
            onDelete={handleDeleteUser}
          />
        </div>
      )}
    </main>
  );
}
