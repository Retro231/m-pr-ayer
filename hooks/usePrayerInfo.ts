import { RootState } from "@/rtk/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface UpcomingPrayer {
  name: string;
  time: string;
}

interface ApiResponse {
  timing: any | "";
  date: string | "";
  hijri: string | "";
  upcomingPrayer: UpcomingPrayer;
}

interface Prayer {
  name: string;
  time: string;
}

interface PrayerWithMinutes extends Prayer {
  minutes: number;
}

const usePrayerInfo = () => {
  const {
    location,
    defaultLocation,
    is24HourFormat,
    prayerTimeConventions,
    menualCorrections,
    juristicMethod,
  } = useSelector((state: RootState) => state.app);
  const [prayerInfo, setPrayerInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to convert time to 24-hour format and apply manual correction
  const applyCorrection = (time: string, correction: number): string => {
    console.log(correction);

    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + correction;

    // Handle overflow and underflow of minutes (e.g., if totalMinutes < 0 or > 1440)
    if (totalMinutes < 0) {
      totalMinutes += 1440; // wrap to previous day
    } else if (totalMinutes >= 1440) {
      totalMinutes -= 1440; // wrap to next day
    }

    const correctedHours = Math.floor(totalMinutes / 60);
    const correctedMinutes = totalMinutes % 60;

    // Return corrected time in 24-hour format
    return `${correctedHours < 10 ? `0${correctedHours}` : correctedHours}:${
      correctedMinutes < 10 ? `0${correctedMinutes}` : correctedMinutes
    }`;
  };

  // Function to convert 24-hour format to 12-hour format
  const convertTo12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert "0" to "12" for midnight
    return `${hour12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
  };

  // Function to format the time based on the current format (24 or 12-hour)
  const formatTime = (time: string) => {
    return is24HourFormat ? time : convertTo12HourFormat(time);
  };

  const getUpcomingPrayer = async (timings: Prayer[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const timesInMinutes: PrayerWithMinutes[] = timings.map(
      (prayer: Prayer): PrayerWithMinutes => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        return { ...prayer, minutes: hours * 60 + minutes };
      }
    );

    const upcomingPrayer = timesInMinutes.find(
      (prayer) => prayer.minutes > currentTime
    );

    return upcomingPrayer
      ? { name: upcomingPrayer.name, time: formatTime(upcomingPrayer.time) }
      : { name: timings[0].name, time: formatTime(timings[0].time) };
  };

  const headers = {
    Accept: "application/json",
  };

  const getPrayerInfo = async () => {
    try {
      const url = `https://api.aladhan.com/v1/timingsByAddress?address=${location}&method=${prayerTimeConventions}&school=${juristicMethod}`;

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      const result = await response.json();

      const data = result.data;
      const timingsObj = data.timings;
      let timing = [];

      for (const key in timingsObj) {
        if (timingsObj.hasOwnProperty.call(timingsObj, key)) {
          // Apply manual correction to each prayer time
          const correctedTime = applyCorrection(
            timingsObj[key],
            menualCorrections[key] ?? 0
          );
          timing.push({
            name: key,
            time: correctedTime,
          });
        }
      }

      timing = timing.filter((prayer) =>
        ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(prayer.name)
      );

      // timing = [
      //   { name: "Fajr", time: "22:45" },
      //   { name: "Dhuhr", time: "22:47" },
      //   { name: "Asr", time: "22:49" },
      //   { name: "Maghrib", time: "22:51" },
      //   { name: "Isha", time: "22:53" },
      // ];

      // console.log("tttt", timing);

      const upcomingPrayer = await getUpcomingPrayer(timing);

      const date = data.date.readable;
      const hijri = `${data.date.hijri.day} ${data.date.hijri.month.en}, ${data.date.hijri.year}`;

      return {
        timing: timing.map((prayer) => ({
          name: prayer.name,
          time: formatTime(prayer.time),
        })),
        date,
        hijri,
        upcomingPrayer,
      };
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const info: any = await getPrayerInfo();
    setPrayerInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    location,
    is24HourFormat,
    prayerTimeConventions,
    menualCorrections,
    juristicMethod,
  ]);

  return [prayerInfo, loading, fetchData];
};

export default usePrayerInfo;
