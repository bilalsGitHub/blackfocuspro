import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [defaultDuration, setDefaultDuration] = useState(20); // minutes
  const [dailyGoal, setDailyGoal] = useState(60); // minutes
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false); // Premium user flag

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Calculate streaks whenever sessions change
  useEffect(() => {
    if (!isLoading) {
      calculateStreaks();
    }
  }, [sessions, isLoading]);

  const loadData = async () => {
    try {
      const [
        storedSessions,
        storedDuration,
        storedGoal,
        storedBestStreak,
        storedPremium,
      ] = await Promise.all([
        AsyncStorage.getItem("sessions"),
        AsyncStorage.getItem("defaultDuration"),
        AsyncStorage.getItem("dailyGoal"),
        AsyncStorage.getItem("bestStreak"),
        AsyncStorage.getItem("isPremium"),
      ]);

      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
      if (storedDuration) {
        setDefaultDuration(parseInt(storedDuration, 10));
      }
      if (storedGoal) {
        setDailyGoal(parseInt(storedGoal, 10));
      }
      if (storedBestStreak) {
        setBestStreak(parseInt(storedBestStreak, 10));
      }
      if (storedPremium) {
        setIsPremium(JSON.parse(storedPremium));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreaks = () => {
    if (sessions.length === 0) {
      setCurrentStreak(0);
      return;
    }

    // Get unique days with sessions
    const daysWithSessions = new Set();
    sessions.forEach((session) => {
      const date = new Date(session.timestamp);
      date.setHours(0, 0, 0, 0);
      daysWithSessions.add(date.getTime());
    });

    // Sort days descending (newest first)
    const sortedDays = Array.from(daysWithSessions).sort((a, b) => b - a);

    // Calculate current streak
    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    // Check if streak is active (has session today or yesterday)
    if (sortedDays[0] === todayTime || sortedDays[0] === yesterdayTime) {
      current = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const dayDiff =
          (sortedDays[i - 1] - sortedDays[i]) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    setCurrentStreak(current);

    // Calculate best streak
    let maxStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const dayDiff =
        (sortedDays[i - 1] - sortedDays[i]) / (1000 * 60 * 60 * 24);
      if (dayDiff === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    if (maxStreak > bestStreak) {
      setBestStreak(maxStreak);
      AsyncStorage.setItem("bestStreak", maxStreak.toString()).catch(
        console.error
      );
    }
  };

  const addSession = async (duration) => {
    const newSession = {
      id: Date.now().toString(),
      duration, // in minutes
      timestamp: Date.now(),
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);

    try {
      await AsyncStorage.setItem("sessions", JSON.stringify(updatedSessions));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const updateDefaultDuration = async (duration) => {
    setDefaultDuration(duration);
    try {
      await AsyncStorage.setItem("defaultDuration", duration.toString());
    } catch (error) {
      console.error("Error saving default duration:", error);
    }
  };

  const updateDailyGoal = async (goal) => {
    setDailyGoal(goal);
    try {
      await AsyncStorage.setItem("dailyGoal", goal.toString());
    } catch (error) {
      console.error("Error saving daily goal:", error);
    }
  };

  const resetHistory = async () => {
    setSessions([]);
    try {
      await AsyncStorage.removeItem("sessions");
    } catch (error) {
      console.error("Error resetting history:", error);
    }
  };

  const getTodayMinutes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return sessions
      .filter((session) => session.timestamp >= todayTimestamp)
      .reduce((total, session) => total + session.duration, 0);
  };

  // Premium Statistics Functions
  const getWeeklyMinutes = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    return sessions
      .filter((session) => session.timestamp >= weekAgo.getTime())
      .reduce((total, session) => total + session.duration, 0);
  };

  const getMonthlyMinutes = () => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(0, 0, 0, 0);

    return sessions
      .filter((session) => session.timestamp >= monthAgo.getTime())
      .reduce((total, session) => total + session.duration, 0);
  };

  const getTotalMinutes = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getAverageDailyMinutes = () => {
    if (sessions.length === 0) return 0;

    const daysWithSessions = new Set();
    sessions.forEach((session) => {
      const date = new Date(session.timestamp);
      date.setHours(0, 0, 0, 0);
      daysWithSessions.add(date.getTime());
    });

    const totalMinutes = getTotalMinutes();
    const uniqueDays = daysWithSessions.size;

    return uniqueDays > 0 ? totalMinutes / uniqueDays : 0;
  };

  const togglePremium = async () => {
    const newPremiumStatus = !isPremium;
    setIsPremium(newPremiumStatus);
    try {
      await AsyncStorage.setItem("isPremium", JSON.stringify(newPremiumStatus));
    } catch (error) {
      console.error("Error saving premium status:", error);
    }
  };

  const value = {
    sessions,
    defaultDuration,
    dailyGoal,
    currentStreak,
    bestStreak,
    isLoading,
    isPremium,
    addSession,
    updateDefaultDuration,
    updateDailyGoal,
    resetHistory,
    getTodayMinutes,
    getWeeklyMinutes,
    getMonthlyMinutes,
    getTotalMinutes,
    getAverageDailyMinutes,
    togglePremium,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
