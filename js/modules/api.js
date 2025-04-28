// Foursquare API
const API_KEY = "fsq3Y4j9Dj6ORupcxdlObWJ89XOiyBNdGNSMJvIZysPjqGE=";
const BASE_URL = "https://api.foursquare.com/v3/places";
const SEARCH_URL = `${BASE_URL}/search`;

async function fetchFeaturedCafes(location = "Boston, MA") {
  const params = new URLSearchParams({
    query: "coffee",
    near: location,
    limit: 20,
  });

  const res = await fetch(`${SEARCH_URL}?${params}`, {
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });

  const data = await res.json();
  const cafes = data.results || [];

  return await Promise.all(cafes.map(async (cafe) => {
    const detail = await fetchCafeById(cafe.fsq_id);
    const photo = await fetchCafePhoto(cafe.fsq_id);
    return {
      id: cafe.fsq_id,
      name: cafe.name,
      location: detail.location,  // Clean location
      cleaned_address: detail.cleaned_address,  
      categories: cafe.categories,
      photo: photo || "https://via.placeholder.com/600x400?text=Café+Image",
      tel: detail.tel || "",
      website: detail.website || "",
      rating: detail.rating || (Math.random() * 2 + 3).toFixed(1),
    };
  }));
}

async function fetchCafePhoto(fsq_id) {
  try {
    const res = await fetch(`${BASE_URL}/${fsq_id}/photos`, {
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    });
    const data = await res.json();
    if (data.length > 0) {
      return `${data[0].prefix}original${data[0].suffix}`;
    }
  } catch {
    return null;
  }
  return null;
}

async function fetchCafeById(fsq_id) {
  const res = await fetch(`${BASE_URL}/${fsq_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });
  const data = await res.json();

  const addressParts = [
    data.location.address,
    data.location.locality,
    data.location.region,
    data.location.postcode
  ].filter(Boolean);
  data.cleaned_address = addressParts.join(', ');

  return data;
}

async function fetchCafePhotos(fsq_id) {
  try {
    const res = await fetch(`${BASE_URL}/${fsq_id}/photos?limit=6`, {
      headers: {
        Accept: "application/json",
        Authorization: API_KEY,
      },
    });
    const data = await res.json();
    return data.map(photo => `${photo.prefix}original${photo.suffix}`);
  } catch (err) {
    console.error("Error fetching cafe photos", err);
    return [];
  }
}

export default {
  fetchFeaturedCafes,
  fetchCafeById,
  fetchCafePhotos,
};
