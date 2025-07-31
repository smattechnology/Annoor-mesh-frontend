import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  setSelect: (value: "login" | "register") => void;
}

export default function LoginSection({ setSelect }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const payload = JSON.stringify({
        username_or_email: username,
        password,
      });

      const res = await fetch("https://api.nuraloom.xyz/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: payload,
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Login failed");
      }

      const data = await res.json();
      if (data.user_id && data.token) {
        getAuth();
      }
    } catch (err: any) {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.detail || "Something went wrong");
      } catch {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Mess Bazar Login</h2>
      {error && (
        <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin h-5 w-5" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="mt-4 text-center">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => setSelect("register")}
          className="text-green-600 underline hover:text-green-800"
        >
          Register here
        </button>
      </p>
    </div>
  );
}
