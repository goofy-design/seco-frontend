# Dynamic Real-Time Insights Implementation

## Overview

The OverallInsights component has been updated to support dynamic, real-time data instead of static mock data. Here's what changed and how to use it:

## Key Changes Made

### 1. Updated Metric Cards

- **Total Applications**: Shows total number of applications submitted
- **Applications Reviewed**: Shows how many applications have been reviewed/scored
- **Average Score**: Shows the average score across all reviewed applications
- **Unique Users**: Shows count of unique users who registered

### 2. Dynamic Application Status Chart

- Automatically calculates percentages based on actual counts
- Supports flexible status types (submitted, reviewing, accepted, rejected, etc.)
- Handles different status naming conventions

### 3. Removed Category Chart

- Removed as requested since categories can vary greatly between events

### 4. Enhanced Recent Activity

- Shows real activities based on your data
- Supports multiple activity types:
  - Application submissions
  - Status changes
  - Score submissions
  - Judge assignments
  - User registrations
  - Event updates

## Data Structure Required

### API Response Format

Your API should provide data in this format:

```typescript
// Applications API (/api/events/{eventId}/applications)
interface ApplicationData {
  id: string;
  userId: string;
  eventId: string;
  status: "submitted" | "reviewing" | "accepted" | "rejected";
  score?: number; // Optional score from judges
  submittedAt: string; // ISO date string
  reviewedAt?: string; // ISO date string when reviewed
  judgeId?: string; // Judge who reviewed
}

// Users API (/api/events/{eventId}/users)
interface UserData {
  id: string;
  email: string;
  registeredAt: string; // ISO date string
}
```

## Implementation Options

### Option 1: Use the Wrapper Component

```tsx
import EventInsightsWrapper from "@/components/EventInsightsWrapper";

// In your parent component
<EventInsightsWrapper eventData={eventData} />;
```

### Option 2: Use the Hook (for custom implementation)

```tsx
import { useEventInsights } from "@/components/EventInsightsWrapper";
import OverallInsights from "@/pages/OverallInsights";

const MyComponent = ({ eventData }) => {
  const { insightsData, loading, error, refresh } = useEventInsights(
    eventData.id
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <OverallInsights
      eventData={eventData}
      insightsData={insightsData}
      onRefresh={refresh}
    />
  );
};
```

### Option 3: Direct Component Usage

```tsx
import OverallInsights from "@/pages/OverallInsights";

// In your parent component
const [insightsData, setInsightsData] = useState();

// Fetch your data however you want
useEffect(() => {
  // Your API call logic here
  fetchData().then(setInsightsData);
}, []);

<OverallInsights
  eventData={eventData}
  insightsData={insightsData}
  onRefresh={handleRefresh}
/>;
```

## Real-Time Updates

The system supports real-time updates through:

1. **Polling**: Updates every 30 seconds by default
2. **Manual Refresh**: Users can click the refresh button
3. **WebSocket**: Commented code available for WebSocket implementation

To change the update interval:

```typescript
setupRealTimeInsights(eventId, onUpdate, 15000); // Update every 15 seconds
```

## Recent Activity Ideas

Based on your API data, recent activities can include:

### Application-based Activities

- "5 new applications submitted"
- "Application #123 status changed to accepted"
- "Score 8.5/10 submitted for application #456"

### User-based Activities

- "3 new users registered for event"
- "User John Doe submitted application"

### Judge-based Activities

- "Judge Sarah assigned to review applications"
- "Judge panel completed 5 reviews"

### Event-based Activities

- "Event details updated"
- "Registration deadline extended"
- "Evaluation criteria modified"

## API Integration Steps

1. **Update API Endpoints**: Ensure your backend provides the required endpoints
2. **Replace Mock Calls**: Update `fetchEventInsights()` in `insightsApi.ts` with your actual API calls
3. **Test Data Flow**: Verify the data transformation works with your API response format
4. **Configure Updates**: Set up appropriate update intervals for your use case

## Customization Options

### Custom Status Types

The component automatically handles any status types you send. Just ensure they're lowercase with underscores:

```typescript
applicationsByStatus: {
  'draft': 5,
  'submitted': 12,
  'in_review': 8,
  'pending_approval': 3,
  'approved': 7,
  'declined': 2
}
```

### Custom Activity Types

Add new activity types by extending the Activity interface in `types/insights.ts`:

```typescript
type: "application_submitted" | "status_changed" | "your_custom_type";
```

### Custom Metrics

You can easily add more metric cards by modifying the component and data structure.

## Performance Considerations

- **Caching**: Consider implementing API response caching
- **Pagination**: For large datasets, implement pagination in recent activities
- **Rate Limiting**: Be mindful of API call frequency for real-time updates
- **Error Handling**: Implement proper error boundaries and retry logic

## Next Steps

1. Replace the mock API calls in `insightsApi.ts` with your actual endpoints
2. Test with real data from your backend
3. Adjust the real-time update interval based on your needs
4. Add any additional metrics specific to your use case
5. Implement WebSocket connection if you need more immediate updates

Would you like me to help you integrate this with your specific API endpoints?
