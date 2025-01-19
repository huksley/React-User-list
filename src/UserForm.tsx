import { useState, useMemo } from "react";
import { User } from "./types";

export default function UserForm({
  minAge,
  title,
  onSave,
  onCancel,
  user,
  users,
}: {
  minAge?: number;
  title: string;
  onSave: (user: User) => void;
  onCancel: () => void;
  user?: User;
  users: User[];
}) {
  const [valueFName, setValueFName] = useState(user?.firstName ?? "");
  const [valueLName, setValueLName] = useState(user?.lastName ?? "");
  const [valueAge, setValueAge] = useState(user?.age ?? undefined);
  const [valueCountry, setValueCountry] = useState(user?.country ?? "");
  const [valueEmail, setValueEmail] = useState(user?.email ?? "");
  const [valueWebsite, setValueWebsite] = useState(user?.website ?? "");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const valueEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(valueEmail);
  }, [valueEmail]);

  const valueWebsiteValid = useMemo(() => {
    const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
    return valueWebsite === "" || websiteRegex.test(valueWebsite);
  }, [valueWebsite]);

  useMemo(() => {
    const duplicate = users.some(
      (newUser) =>
        newUser.id !== user?.id &&
        newUser.firstName.toLowerCase() === valueFName.toLowerCase() &&
        newUser.lastName.toLowerCase() === valueLName.toLowerCase()
    );
    setIsDuplicate(duplicate);
  }, [valueFName, valueLName, user?.id, users]);

  function handleOnSave() {
    const newUser = {
      id: user?.id ?? Math.floor(Date.now() / 1000),
      firstName: valueFName,
      lastName: valueLName,
      age: valueAge ?? 0,
      country: valueCountry,
      email: valueEmail,
      website: valueWebsite || "",
    } satisfies User;
    onSave(newUser);
  }

  return (
    <div>
      {title ? <h2 className="text-white text-3xl font-bold p-1">{title}</h2> : null}
      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">First Name*</label>
          <input
            className="text-black p-1 border border-white border-solid rounded-lg"
            type="text"
            value={valueFName}
            placeholder="Enter First name"
            onChange={(event) => {
              setValueFName(event.target.value);
            }}
          />
        </div>
      </div>

      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">Last Name*</label>
          <input
            type="text"
            className="text-black p-1 border border-white border-solid rounded-lg"
            value={valueLName}
            placeholder="Enter Last Name"
            onChange={(event) => {
              setValueLName(event.target.value);
            }}
          />
        </div>
      </div>

      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">Age*</label>
          <input
            type="number"
            value={typeof valueAge === "number" ? valueAge : ""}
            placeholder="Enter Age"
            min={0}
            max={100}
            className="text-black p-1 border border-white border-solid rounded-lg"
            onChange={(event) => {
              setValueAge(parseInt(event.target.value, 10));
            }}
          />
        </div>
      </div>

      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">Email*</label>
          <input
            type="email"
            value={valueEmail}
            placeholder="Enter Email"
            className={`text-black p-1 border ${
              valueEmail && !valueEmailValid ? "border-red-600" : "border-white"
            } border-solid rounded-lg`}
            onChange={(event) => setValueEmail(event.target.value)}
          />
          {valueEmail && !valueEmailValid && (
            <p className="text-red-600 text-[12px]">Please enter a valid email address.</p>
          )}
        </div>
      </div>

      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">Website</label>
          <input
            type="url"
            className="text-black p-1 border border-white border-solid rounded-lg"
            value={valueWebsite}
            placeholder="Enter Website URL"
            onChange={(event) => setValueWebsite(event.target.value)}
          />
          {valueWebsite && !valueWebsiteValid && (
            <p className="text-red-600 text-[12px]">Please enter a valid Website URL.</p>
          )}
        </div>
      </div>

      <div className="form text-white text-20 p-1">
        <div className="fields pt-2.5 text-[13px]">
          <label className="block">Country*</label>
          <select
            value={valueCountry}
            className="text-slate-800 p-1 border border-white border-solid rounded-lg"
            onChange={(event) => setValueCountry(event.target.value)}
          >
            <option value="" disabled>
              --Select country--
            </option>
            <option value="FI">Finland</option>
            <option value="SW">Sweden</option>
            <option value="NW">Norway</option>
          </select>
        </div>
      </div>

      <div className="text-red-600 font-bold py-3 w-[300px] min-h-[48px] mb-[10px]">
        {valueAge && valueAge < (minAge ?? 18)
          ? "You need to be at least " + (minAge ?? 18) + " to continue"
          : isDuplicate
          ? "A user with this name already exists"
          : ""}
      </div>

      <button
        className="disabled:text-gray-200 disabled:bg-black disabled:border-black px-6 py-1 mr-10 bg-lime-300 border-lime-300 border-solid rounded-lg"
        disabled={
          (valueAge && valueAge < (minAge ?? 18)) ||
          valueFName.trim() === "" ||
          valueLName.trim() === "" ||
          valueCountry === "" ||
          valueEmail === "" ||
          isDuplicate
        }
        onClick={handleOnSave}
      >
        Save
      </button>

      {onCancel ? (
        <button className="px-6 py-1 mr-10 bg-red-600 border-red-600 border-solid rounded-lg" onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </div>
  );
}
