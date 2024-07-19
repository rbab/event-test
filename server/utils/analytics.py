import json

from abc import ABC, abstractmethod

class AnalyticsClient(ABC):
    @abstractmethod
    def identify(self, user_id, user_properties):
        pass

    @abstractmethod
    def track(self, event_name, event_properties):
        pass

class Analytics(AnalyticsClient):
    def identify(self, user_id, user_properties):
        print("Identify User: { user_id: %s, properties: %s }" % (user_id, json.dumps(user_properties)))

    def track(self, event_name, event_properties):
        print("Track Event: { event_name: %s, properties: %s }" % (event_name, json.dumps(event_properties)))

analytics = Analytics()

"""
Example usage:

analytics.identify(user_id="11111-22222-33333-444444-555555", user_properties={
    "email": "example@example.com",
    "subscription_id": db_user.subscription_id,
    "plan": db_user.plan
})

analytics.track(event_name="user-registered", event_properties={
    "user_id": db_user.user_id,
    "subscription_id": db_user.subscription_id,
    "plan": db_user.plan
})
"""
