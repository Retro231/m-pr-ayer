function checkDayNight(fajrTime, maghribTime) {
  const now = new Date();

  // Helper function to convert time strings to Date objects
  function convertToDate(timeStr) {
    const [time, modifier] = timeStr.split(" ");

    if (modifier) {
      // 12-hour format
      let [hours, minutes] = time.split(":");
      if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
      if (modifier === "AM" && hours === "12") hours = "00"; // Midnight case
      return new Date(now.toDateString() + ` ${hours}:${minutes}`);
    } else {
      // 24-hour format
      return new Date(now.toDateString() + " " + timeStr);
    }
  }

  // Convert Fajr and Maghrib times to Date objects
  const fajr = convertToDate(fajrTime);
  const maghrib = convertToDate(maghribTime);

  // If the current time is between Fajr and Maghrib, it's day time, else night
  if (now >= fajr && now < maghrib) {
    return "Day";
  } else {
    return "Night";
  }
}

export default checkDayNight;
