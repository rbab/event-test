interface AnalyticsClient {
  identify(email: string, userProperties: Record<string, any>): void;
  track(eventName: string, eventProperties: Record<string, any>): void;
}

class Analytics implements AnalyticsClient {
  identify(userId: string, userProperties: Record<string, any>): void {
    console.log(
      `Identify User: ${JSON.stringify({
        userId,
        properties: userProperties,
      })}`
    );
  }

  track(eventName: string, eventProperties: Record<string, any>): void {
    console.log(
      `Track Event: ${JSON.stringify({
        eventName,
        properties: eventProperties,
      })}`
    );
  }
}

const analytics = new Analytics();

export default analytics;

/*
// Example Usage

analytics.track("subscription-upgraded", {
  previousPlan: previousPlan,
  plan: plan,
});

const userId = "11111-22222-33333-44444-55555";
const userProperties = {
  email: "example@example.com",
  subscriptionId: "12345",
  plan: "free",
};

analytics.identify(userId, userProperties);
*/
