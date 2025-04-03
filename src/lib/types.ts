
// Shared types for the application

// Mimicking Firebase Timestamp for compatibility
export interface Timestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

// Helper to convert ISO string dates to our Timestamp format
export function createTimestamp(isoString: string): Timestamp {
  const date = new Date(isoString);
  const seconds = Math.floor(date.getTime() / 1000);
  const nanoseconds = (date.getTime() % 1000) * 1000000;
  
  return {
    seconds,
    nanoseconds,
    toDate: () => new Date(seconds * 1000 + nanoseconds / 1000000),
  };
}
