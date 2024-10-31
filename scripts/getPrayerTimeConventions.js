const getPrayerTimeConventions = async () => {
  try {
    const url = `https://api.aladhan.com/v1/methods`;
    const headers = {
      Accept: "application/json",
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const json = await response.json();

    const data = json.data;

    const list = [];

    // Loop over the keys and access `id` dynamically
    Object.keys(data).forEach((key) => {
      list.push({
        id: data[key].id,
        label: data[key]?.name ?? null,
        Fajr: data[key]?.params?.Fajr ?? null,
        Isha: data[key]?.params?.Isha ?? null,
      });
    });

    if (list.length !== 0) {
      return list;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export default getPrayerTimeConventions;
