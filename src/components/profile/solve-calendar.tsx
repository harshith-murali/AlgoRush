"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Calendar, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDay {
  date: Date;
  dateStr: string;
  count: number;
}

interface SolveCalendarProps {
  tzOffset: number;
}

export function SolveCalendar({ tzOffset }: SolveCalendarProps) {
  const [activity, setActivity] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch(`/api/me/solve-calendar?tzOffset=${tzOffset}`);
        if (!res.ok) throw new Error("Failed to fetch calendar");
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, [tzOffset]);

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((act) => {
      map.set(act.date, act.count);
    });
    return map;
  }, [activity]);

  // Construct a grid of 53 weeks (371 days) ending today
  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // We want the last 365 days, aligned to start on a Sunday
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const startDayOfWeek = startDate.getDay(); // 0 is Sunday
    
    // Shift startDate back to the Sunday of that week
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    
    const cur = new Date(startDate);
    // Include all days up to today
    while (cur <= today) {
      const dateStr = cur.toISOString().split("T")[0];
      days.push({
        date: new Date(cur),
        dateStr,
        count: activityMap.get(dateStr) || 0,
      });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [activityMap]);

  // Group days by week (columns) for the Github-style grid
  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];
    
    calendarDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [calendarDays]);

  // Identify months positions for headers
  const monthHeaders = useMemo(() => {
    const headers: { label: string; colSpan: number }[] = [];
    let currentMonth = -1;
    let colSpan = 0;
    
    weeks.forEach((week) => {
      const firstDayOfWeek = week[0]?.date;
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.getMonth();
        if (month !== currentMonth) {
          if (colSpan > 0) {
            headers[headers.length - 1].colSpan = colSpan;
          }
          const monthLabel = firstDayOfWeek.toLocaleString("default", { month: "short" });
          headers.push({ label: monthLabel, colSpan: 0 });
          currentMonth = month;
          colSpan = 0;
        }
      }
      colSpan++;
    });
    
    if (headers.length > 0) {
      headers[headers.length - 1].colSpan = colSpan;
    }
    
    return headers;
  }, [weeks]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 flex items-center justify-center min-h-[220px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-450 uppercase tracking-widest">Loading calendar...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 text-center text-red-500 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Info className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wide">Error loading solve calendar data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-4.5 w-4.5 text-amber-500" />
        <h2 className="text-sm font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
          Activity Heatmap
        </h2>
      </div>

      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[760px] flex flex-col gap-1.5 select-none">
          {/* Month Headers */}
          <div className="flex text-[9px] font-mono text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider pl-8">
            {monthHeaders.map((header, idx) => (
              <span 
                key={idx} 
                style={{ width: `${header.colSpan * 14}px` }} 
                className="truncate block"
              >
                {header.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Weekday labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500 font-bold uppercase h-[88px] w-6 py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => {
                    let intensityClass = "bg-zinc-100 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700";
                    if (day.count === 1) {
                      intensityClass = "bg-amber-500/20 text-amber-500 border border-amber-500/20 hover:bg-amber-500/30 hover:border-amber-500/40";
                    } else if (day.count === 2) {
                      intensityClass = "bg-amber-500/45 text-amber-500 border border-amber-500/35 hover:bg-amber-500/60";
                    } else if (day.count >= 3) {
                      intensityClass = "bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400";
                    }

                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          "h-2.5 w-2.5 rounded-[2px] transition-colors cursor-pointer border border-transparent",
                          intensityClass
                        )}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Tooltip info */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-900">
        <div className="h-6 flex items-center">
          {hoveredDay ? (
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              {hoveredDay.count} solve{hoveredDay.count !== 1 && "s"} on {hoveredDay.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Hover over cells to view stats
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-amber-500/20" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-amber-500/45" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-amber-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
