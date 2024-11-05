function checkDayNight(fajrTime, maghribTime) {
  const now = new Date();

  // Helper function to convert time strings to Date objects
  function convertToDate(timeStr) {
    const [time, modifier] = timeStr.split(" ");

    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (modifier) {
      // 12-hour format
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0; // Midnight case
    }

    // Create date with the same day as 'now'
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    return date;
  }

  // Convert Fajr and Maghrib times to Date objects
  const fajr = convertToDate(fajrTime);
  const maghrib = convertToDate(maghribTime);

  // If the current time is between Fajr and Maghrib, it's day time; otherwise, it's night
  if (now >= fajr && now < maghrib) {
    return "Day";
  } else {
    return "Night";
  }
}

export default checkDayNight;
