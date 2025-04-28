import API from './modules/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const data = await API.fetchCafeById(id);
  renderDetails(data);

  if (data?.geocodes?.main) {
    loadMap(data.geocodes.main.latitude, data.geocodes.main.longitude);
  }

  const photos = await API.fetchCafePhotos(id);
  if (photos.length > 0) {
    renderPhotos(photos);
  }
});

function renderDetails(data) {
  const container = document.getElementById('cafeDetailContent');
  if (!data) {
    container.innerHTML = "<p>Café not found.</p>";
    return;
  }

  const address = data.cleaned_address || 'N/A';
  const categories = data.categories.map(c => c.name).join(', ') || 'N/A';
  const geo = data.geocodes?.main ? `${data.geocodes.main.latitude}, ${data.geocodes.main.longitude}` : 'N/A';

  container.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Categories:</strong> ${categories}</p>
    <p><strong>Geolocation:</strong> ${geo}</p>
  `;
}

// OpenStreetMap
function loadMap(lat, lng) {
  const mapDiv = document.getElementById('map');
  if (!mapDiv) return;
  const map = L.map('map').setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map)
    .bindPopup('Café Location')
    .openPopup();
}

function renderPhotos(photoUrls) {
  const gallery = document.getElementById('photoGallery');
  if (!gallery) return;

  gallery.innerHTML = ""; 

  photoUrls.slice(0, 6).forEach(url => {
    const card = document.createElement('div');
    card.className = 'col-md-4 col-sm-6 mb-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${url}" class="card-img-top" alt="Cafe Photo">
      </div>
    `;
    gallery.appendChild(card);
  });
}
