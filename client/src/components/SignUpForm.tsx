import React, { useState } from "react";
import analytics from "../utils/analytics";

const SignUpForm = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (email && password) {
      try {
        const response = await onSignup({ email, password });

        if (response.success) {
          analytics.track("user-signed-up", {
            email: email,
            subscription: "free",
          });

          // Clear the form fields
          setEmail("");
          setPassword("");
        } else {
          console.error("Sign-up error:", response.error);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign up</button>
    </div>
  );
};

export default SignUpForm;
