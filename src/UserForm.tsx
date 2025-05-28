import { useState, useMemo } from "react";
import { User } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

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

  const isFormValid = !(
    (valueAge && valueAge < (minAge ?? 18)) ||
    valueFName.trim() === "" ||
    valueLName.trim() === "" ||
    valueCountry === "" ||
    valueEmail === "" ||
    isDuplicate ||
    !valueEmailValid ||
    (valueWebsite && !valueWebsiteValid)
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                value={valueFName}
                placeholder="Enter First name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValueFName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                value={valueLName}
                placeholder="Enter Last Name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValueLName(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age*</Label>
            <Input
              id="age"
              type="number"
              value={typeof valueAge === "number" ? valueAge : ""}
              placeholder="Enter Age"
              min={0}
              max={100}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValueAge(parseInt(event.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={valueEmail}
              placeholder="Enter Email"
              className={valueEmail && !valueEmailValid ? "border-destructive" : ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValueEmail(event.target.value)}
            />
            {valueEmail && !valueEmailValid && (
              <p className="text-sm text-destructive">Please enter a valid email address.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={valueWebsite}
              placeholder="Enter Website URL"
              className={valueWebsite && !valueWebsiteValid ? "border-destructive" : ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValueWebsite(event.target.value)}
            />
            {valueWebsite && !valueWebsiteValid && (
              <p className="text-sm text-destructive">Please enter a valid Website URL.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country*</Label>
            <Select value={valueCountry} onValueChange={setValueCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FI">Finland</SelectItem>
                <SelectItem value="SW">Sweden</SelectItem>
                <SelectItem value="NW">Norway</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(valueAge && valueAge < (minAge ?? 18) || isDuplicate) && (
            <div className="text-destructive font-medium">
              {valueAge && valueAge < (minAge ?? 18)
                ? `You need to be at least ${minAge ?? 18} to continue`
                : isDuplicate
                ? "A user with this name already exists"
                : ""}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleOnSave}
              disabled={!isFormValid}
            >
              Save
            </Button>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
