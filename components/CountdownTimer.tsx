import { Colors } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

// Function to calculate the difference in milliseconds
const calculateTimeDifference = (currentTime: Date, targetTime: Date) => {
  const current: any = new Date(currentTime);
  const target: any = new Date(targetTime);

  return target - current;
};

// Format time difference into hours, minutes, and seconds
const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
interface CountdownTimerProps {
  targetTime: string;
}
const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  // Parse the 24-hour formatted time (e.g., "16:50")
  const parse24HourFormat = (time: any) => {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setHours(hours, minutes, 0, 0); // Set the target time
    return targetDate;
  };

  // Calculate the time difference
  const calculateTimeLeft = (target: any) => {
    const now: any = new Date();
    const difference = target - now; // Difference in milliseconds
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, minutes });
    } else {
      setTimeLeft({ hours: 0, minutes: 0 }); // Timer reached
    }
  };

  useEffect(() => {
    const targetDate = parse24HourFormat(targetTime);
    const timer = setInterval(() => calculateTimeLeft(targetDate), 1000);

    return () => clearInterval(timer); // Clean up on unmount
  }, [targetTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>
        {`${timeLeft.hours} hours, ${timeLeft.minutes} minutes`} left
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontFamily: "MontserratMedium",
    fontWeight: "medium",
    fontSize: 18,
    color: Colors.text2,
  },
});

export default CountdownTimer;
