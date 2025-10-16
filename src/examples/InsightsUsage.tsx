// Example of how to use the updated OverallInsights component
import React from "react";
import OverallInsights from "../pages/OverallInsights";
import { EventInterface } from "@/types/event";

// Example usage in your event dashboard or routing
const EventInsightsPage: React.FC = () => {
  // Get eventData from your props, context, or API
  const eventData: EventInterface = {
    // Your event data structure
    id: "event-123",
    title: "My Event",
    // ... other event properties
  };

  return (
    <OverallInsights
      eventData={eventData}
      // Optional: pass pre-calculated insights data
      // insightsData={yourInsightsData}
      // Optional: handle refresh callback
      // onRefresh={() => console.log('Refreshing insights')}
    />
  );
};

export default EventInsightsPage;
