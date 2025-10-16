// Example usage of OverallInsights with real-time data
import React, { useState, useEffect, useCallback } from "react";
import OverallInsights from "../pages/OverallInsights";
import { EventInterface } from "@/types/event";
import { InsightsData } from "@/types/insights";
import { fetchEventInsights, setupRealTimeInsights } from "@/utils/insightsApi";

interface EventInsightsWrapperProps {
  eventData: EventInterface;
}

const EventInsightsWrapper: React.FC<EventInsightsWrapperProps> = ({
  eventData,
}) => {
  const [insightsData, setInsightsData] = useState<InsightsData | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Function to fetch initial data
  const loadInsightsData = useCallback(async () => {
    if (!eventData?.id) return;

    try {
      setError(null);
      const data = await fetchEventInsights(eventData.id);
      setInsightsData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
      console.error("Error loading insights:", err);
    }
  }, [eventData?.id]);

  // Setup real-time updates
  useEffect(() => {
    if (!eventData?.id) return;

    // Load initial data
    loadInsightsData();

    // Setup real-time updates (polling every 30 seconds)
    const cleanup = setupRealTimeInsights(
      eventData.id,
      (data) => {
        setInsightsData(data);
        setLastUpdated(new Date());
      },
      30000 // Update every 30 seconds
    );

    // Cleanup on unmount
    return cleanup;
  }, [eventData?.id, loadInsightsData]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    loadInsightsData();
  }, [loadInsightsData]);

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load insights
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Last updated indicator */}
      {lastUpdated && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg px-3 py-1 shadow-sm">
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      <OverallInsights
        eventData={eventData}
        insightsData={insightsData}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default EventInsightsWrapper;

// Alternative: Hook-based approach for reusable logic
export const useEventInsights = (eventId: string) => {
  const [insightsData, setInsightsData] = useState<InsightsData | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchEventInsights(eventId);
      setInsightsData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    // Initial load
    refresh();

    // Setup real-time updates
    const cleanup = setupRealTimeInsights(
      eventId,
      (data) => {
        setInsightsData(data);
        setLastUpdated(new Date());
      },
      30000
    );

    return cleanup;
  }, [eventId, refresh]);

  return {
    insightsData,
    loading,
    error,
    lastUpdated,
    refresh,
  };
};
