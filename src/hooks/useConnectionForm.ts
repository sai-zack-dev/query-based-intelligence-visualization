import { useState, ChangeEvent } from "react";

/**
 * Hook to manage connection form state and actions.
 */
export const useConnectionForm = () => {
  const [type, setType] = useState("MySQL");
  const [name, setName] = useState("Sales DB");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("80");
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("password");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "type":
        setType(value);
        break;
      case "name":
        setName(value);
        break;
      case "host":
        setHost(value);
        break;
      case "port":
        setPort(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleTestConnection = () => {
    // Simulate async test (replace with actual IPC call)
    setTimeout(() => setStatus("success"), 500);
  };

  return {
    type,
    name,
    host,
    port,
    username,
    password,
    status,
    handleChange,
    handleTestConnection,
  };
};
