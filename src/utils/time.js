// Helper to parse time string "HH:MM-HH:MM" into an object with start and end times in minutes
export const parseTime = (timeRange) => {
  const [start, end] = timeRange.split('-');
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  return {
    start: startHour * 60 + startMinute,
    end: endHour * 60 + endMinute,
  };
};

// Helper to check if two time intervals overlap
export const timeOverlaps = (time1, time2) => {
  const timeA = parseTime(time1);
  const timeB = parseTime(time2);
  return (
    (timeA.start <= timeB.end && timeA.end >= timeB.start) ||
    (timeB.start <= timeA.end && timeB.end >= timeA.start)
  );
};
