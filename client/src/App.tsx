import { useState } from "react";

import SignUpForm from "./components/SignUpForm";
import Dashboard from "./components/Dashboard";
import analytics from "./utils/analytics";

import "./App.css";

interface Person {
  email: string;
  password: string;
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  console.log(user);

  const subscriptionId = user?.subscription_id;

  const handleSignup = async ({ email, password }: Person) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data = await response.json();

      // Store the subscription ID in local storage
      localStorage.setItem("user", JSON.stringify(data));

      // Set "logged in" user and update the login state
      setUser(data);
      setIsLoggedIn(true);

      // Track the "user-signed-up" event for analytics
      analytics.track("user-signed-up", {
        email: email,
        subscription: "free",
      });
    }
  };

  const handleUpgradeSubscription = async () => {
    if (subscriptionId) {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "growth" }),
      });

      if (response.status === 200) {
        const data = await response.json();

        // Track the "subscription-upgraded" event for analytics
        analytics.track("subscription-upgraded", {
          previousPlan: user.plan,
          plan: data.plan,
        });

        return {
          success: true,
          plan: data.plan,
        };
      }
      // TODO: Handle errors
    }
  };

  const handleDowngradeSubscription = async () => {
    if (subscriptionId) {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: "free" }), // Downgrade to the "free" plan
      });
  
      // TODO: Handle errors
      if (response.status === 200) {
        const data = await response.json();
        return {
          success: true,
          plan: data.plan,
        };
      }
    }
  };

  const handleCreateOffer = async (offerData) => {
    const requestData = { ...offerData, "user_id": user.user_id };

    console.log(requestData)

    const response = await fetch("/api/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
  
    if (response.status === 200) {
      const data = await response.json();
      console.log("Offer created:", data);
      // TODO: add analytics tracking for offer creation here
    } else {
      // TODO: Handle errors
      console.error("Offer creation failed");
    }
  };
  

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard
          user={user}
          onUpgradeSubscription={handleUpgradeSubscription}
          onDowngradeSubscription={handleDowngradeSubscription}
          onLogout={() => setIsLoggedIn(false)}
          onCreateOffer={handleCreateOffer}
        />
      ) : (
        <SignUpForm onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
