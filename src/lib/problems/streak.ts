export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
  activeDaysCount: number;
  solveDates: string[]; // sorted ascending YYYY-MM-DD
}

/**
 * Calculates current and longest daily streak from an array of local date strings.
 * @param solveDatesSorted unique YYYY-MM-DD strings sorted ascending
 * @param clientTodayStr today's local date string YYYY-MM-DD
 */
export function calculateStreak(solveDatesSorted: string[], clientTodayStr: string) {
  if (solveDatesSorted.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 1. Calculate longest streak
  let longestStreak = 0;
  let currentRun = 0;
  let prevDate: Date | null = null;

  for (let i = 0; i < solveDatesSorted.length; i++) {
    const curStr = solveDatesSorted[i];
    const curDate = new Date(curStr + "T00:00:00");
    
    if (prevDate === null) {
      currentRun = 1;
    } else {
      const diffTime = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentRun++;
      } else if (diffDays > 1) {
        if (currentRun > longestStreak) {
          longestStreak = currentRun;
        }
        currentRun = 1;
      }
    }
    prevDate = curDate;
  }
  if (currentRun > longestStreak) {
    longestStreak = currentRun;
  }

  // 2. Calculate current streak (ending today or yesterday)
  const today = new Date(clientTodayStr + "T00:00:00");
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const hasSolvedToday = solveDatesSorted.includes(clientTodayStr);
  const hasSolvedYesterday = solveDatesSorted.includes(yesterdayStr);

  let currentStreak = 0;
  if (hasSolvedToday || hasSolvedYesterday) {
    let checkDate = hasSolvedToday ? today : yesterday;
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (solveDatesSorted.includes(checkStr)) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}
