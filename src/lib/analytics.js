export function getAnalytics(activities, filters = {}) {
  const filtered = activities.filter(item => {
    if (filters.dateRange?.start && new Date(item.date) < new Date(filters.dateRange.start)) return false;
    if (filters.dateRange?.end && new Date(item.date) > new Date(filters.dateRange.end)) return false;
    return true;
  });
  const totalMinutes = filtered.reduce((sum, item) => sum + item.durationMinutes, 0);
  return { totalMinutes, averageMinutes: avgMinutes, activeDays: 0 };
}
