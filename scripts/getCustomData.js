const getCustomData = async () => {
  const url = "https://retrosoft.co/muslims_pryer_vv11.json";

  const headers = {
    Accept: "application/json",
  };

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  const json = await response.json();

  const data = {
    dhikr_list: json.dhikr_list ?? null,
    dua_list: json.dua_list ?? null,
    software_update_url: json.software_update_url ?? null,
    notice: json.notice ?? null,
    media: json.media ?? null,
    our_post: json.our_post ?? null,
  };

  return data;
};

export default getCustomData;
