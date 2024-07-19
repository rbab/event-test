import React, { useState } from "react";
import OfferForm from "./OfferForm";
import analytics from "../utils/analytics";

const Dashboard = ({onLogout, user, onUpgradeSubscription, onDowngradeSubscription, onCreateOffer }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [plan, setPlan] = useState(user.plan);
  const [activeUser, setUser] = useState(user);

  // TODO: Combine upgrade/downgrade into generic function
  const handleUpgrade = async () => {
    try {
      const response = await onUpgradeSubscription();

      if (response.success) {
        setPageLoad(true)
        const { plan } = response;
        setPlan(plan);
        localStorage.setItem("user", JSON.stringify({ ...user, plan }));

        analytics.track("subscription-upgraded", {
          previousPlan: user.plan,
          plan: plan,
        });

        const userId = user.id;
        const userProperties = {
          email: user.email,
          subscriptionId: user.subscription_id,
          plan: plan,
        };
        analytics.identify(userId, userProperties);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    }
  };

  const handleDowngrade = async () => {
    try {
      const response = await onDowngradeSubscription();

      if (response.success) {
        setPageLoad(true)
        const { plan } = response;
        setPlan(plan);
        localStorage.setItem("user", JSON.stringify({ ...user, plan }));

        analytics.track("subscription-downgraded", {
          previousPlan: user.plan,
          plan: plan,
        });

        const userId = user.id;
        const userProperties = {
          email: user.email,
          subscriptionId: user.subscription_id,
          plan: plan,
        };
        analytics.identify(userId, userProperties);
      }
    } catch (error) {
      console.error("Downgrade error:", error);
    }
  };


  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");

    // Reset the user state
    setUser(null);

    // Track the "user-logged-out" event for analytics
    analytics.track("user-logged-out", {
      email: user.email,
    });
    onLogout();
  };

  const renderSuccessMessage = (text: string) => {
    return pageLoad && (
    <div className="bg-green-200 p-2 rounded mb-4">
      Your subscription has been successfully {text}. Your new plan is:{" "}
      <strong>{plan}</strong>
    </div>
  )};

  const renderActionButton = (text: string, onClick) => (
    <button
      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      onClick={onClick}
    >
      {text}
    </button>
  );

  return (
    <div className="max-w-md mx-auto mt-12 p-4 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-4">Plan: {plan}</p>
      <p className="mb-4">Subscription ID: {user.subscription_id}</p>

      <OfferForm onCreateOffer={onCreateOffer} />

      <div>
        {renderSuccessMessage(plan == "growth" ? "downgraded" : "upgraded")}
        {renderActionButton(
          plan == "growth" ? "Downgrade Your Subscription" : "Upgrade Your Subscription",
          plan == "growth" ? handleDowngrade : handleUpgrade
        )}
      </div>
      <div>
        <button
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
