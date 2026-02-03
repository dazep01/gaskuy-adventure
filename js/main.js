let allTrips = [];
const navItems = document.querySelectorAll('.nav-item');
const contents = {
  'home': document.getElementById('home-content'),
  'explore': document.getElementById('explore-content'),
  'about': document.getElementById('about-content'),
  'account': document.getElementById('account-content')
};
navItems.forEach(item => {
  item.addEventListener('click', function() {
    const target = this.getAttribute('data-target');
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
    Object.values(contents).forEach(div => div.style.display = 'none');
    if (contents[target]) contents[target].style.display = 'block';
    document.querySelector('.app').scrollTop = 0;
  });
});
const overlay = document.getElementById('modalOverlay');
const sheet = document.getElementById('modalSheet');
function openModal(title, trips) {
  document.getElementById('modalTitle').innerText = title;
  const body = document.getElementById('modalBody');
  if(trips.length > 0) {
    body.innerHTML = trips.map(trip => createTripCard(trip)).join('');
    } else {
    body.innerHTML = `<p style="text-align:center; width:100%;">Belum ada trip untuk kategori ini.</p>`;
  }
  overlay.classList.add('active');
  sheet.classList.add('active');
}
function closeModal() {
  overlay.classList.remove('active');
  sheet.classList.remove('active');
  setTimeout(() => {
    document.getElementById('modalBody').classList.add('trip-grid');
  }, 300);
}
overlay.addEventListener('click', closeModal);
const formatHarga = (angka) => 'Rp ' + (angka / 1000) + 'k';
const createTripCard = (trip) => {
  const badge = trip.marks[0] || 'Trip';
  return `
  <div class="trip-card">
  <div class="trip-image" style="background: url('${trip.media.gambar_utama}') center/cover;">
  <div class="trip-badge">${badge}</div>
  </div>
  <div class="trip-content">
  <h3 class="trip-name">${trip.nama_trip}</h3>
  <p class="trip-location"><i class="hgi hgi-stroke hgi-map-pinpoint-02"></i> ${trip.lokasi.wilayah}</p>
  <p class="trip-description">${trip.deskripsi}</p>
  <div class="trip-stats">
  <span class="trip-price">${formatHarga(trip.harga)}</span>
  <button class="book-btn" onclick="showDetail('${trip.trip_id}')">Lihat</button>
  </div>
  </div>
  </div>
  `;
};
function openTripFromAd(tripName) {
  const trip = allTrips.find(t => t.nama_trip.includes(tripName));
  if (trip) {
    showDetail(trip.trip_id);
    } else {
    alert("Trip tidak ditemukan!");
  }
}
function showDetail(id) {
  const trip = allTrips.find(t => t.trip_id === id);
  if (!trip) return;
  document.getElementById('modalTitle').innerText = "Rincian Petualangan";
  const body = document.getElementById('modalBody');
  body.classList.remove('trip-grid');
  body.scrollTop = 0;
  body.innerHTML = `
  <div class="detail-container">
  <img src="${trip.media.gambar_utama}" style="width:100%; border-radius:20px; margin-bottom:15px; box-shadow: var(--ios-shadow);">
  <h2 style="color:var(--earth-charcoal); line-height:1.2; margin-bottom:8px;">${trip.nama_trip}</h2>
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
  <span style="color:var(--earth-soil); font-size:1.3rem; font-weight:700;">${formatHarga(trip.harga)}</span>
  <span style="background:var(--earth-cream); padding:4px 12px; border-radius:50px; font-size:0.8rem;">${trip.durasi}</span>
  </div>
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:25px;">
  <div style="background:var(--earth-warm-white); border:1px solid var(--earth-mist); padding:12px; border-radius:12px;">
  <small style="color:var(--earth-wood);">Gunung</small>
  <p style="font-weight:600; font-size:0.9rem;">${trip.lokasi.gunung}</p>
  </div>
  <div style="background:var(--earth-warm-white); border:1px solid var(--earth-mist); padding:12px; border-radius:12px;">
  <small style="color:var(--earth-wood);">Ketinggian</small>
  <p style="font-weight:600; font-size:0.9rem;">${trip.lokasi.ketinggian}</p>
  </div>
  <div style="background:var(--earth-warm-white); border:1px solid var(--earth-mist); padding:12px; border-radius:12px;">
  <small style="color:var(--earth-wood);">Wilayah</small>
  <p style="font-weight:600; font-size:0.9rem;">${trip.lokasi.wilayah}</p>
  </div>
  <div style="background:var(--earth-warm-white); border:1px solid var(--earth-mist); padding:12px; border-radius:12px;">
  <small style="color:var(--earth-wood);">Jalur</small>
  <p style="font-weight:600; font-size:0.9rem;">${trip.lokasi.jalur_pendakian}</p>
  </div>
  </div>
  <h3 class="section-title">Galeri Foto</h3>
  <div class="gallery-container">
  ${trip.media.galeri.map(img => `<img src="${img}" class="gallery-img" alt="Gallery">`).join('')}
  </div>
  <h3 class="section-title" style="margin-top:20px;">Titik Kumpul</h3>
  <div class="mp-container">
  ${trip.meeting_points.map(mp => `
    <div class="mp-chip"><i class="hgi hgi-stroke hgi-location-01"></i> ${mp}</div><i style="font-size: 1.2rem; margin: auto 2px;" class="hgi hgi-stroke hgi-circle-arrow-right-double"></i>
  `).join('')}
  </div>
  <h3 class="section-title">Cinematic Teaser</h3>
  <div class="video-wrapper">
  <div class="video-overlay" onclick="window.open('${trip.media.video}')">
  <i class="hgi hgi-stroke hgi-play-circle"></i>
  </div>
  <img src="${trip.media.galeri[0]}" style="width:100%; height:100%; object-fit:cover; opacity:0.6;">
  </div>
  <h3 class="section-title" style="margin-top:25px;">Tentang Trip Ini</h3>
  <p class="section-text" style="font-size:0.95rem; opacity:0.8;">${trip.deskripsi}</p>
  <h3 class="section-title">Fasilitas Termasuk</h3>
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:25px;">
  ${trip.inclusions.map(inc => `
    <div style="font-size:0.85rem; display:flex; align-items:center; gap:6px;">
    <i class="hgi hgi-stroke hgi-tick-01" style="color:green; font-weight:bold;"></i> ${inc}
    </div>
  `).join('')}
  </div>
  <h3 class="section-title">Rencana Perjalanan</h3>
  <div style="margin-bottom:30px;">
  ${trip.itinerary.map(item => `
    <div style="display:flex; gap:15px; margin-bottom:15px;">
    <div style="text-align:center;">
    <div style="width:35px; height:35px; background:var(--earth-soil); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold;">${item.hari}</div>
    <div style="width:2px; height:100%; background:var(--earth-mist); margin:4px auto;"></div>
    </div>
    <div style="padding-top:5px;">
    <p style="font-size:0.9rem; line-height:1.4;">${item.kegiatan}</p>
    </div>
    </div>
  `).join('')}
  </div>
  <div class="action-buttons-container">
  <button class="share-btn" onclick="shareTrip('${trip.nama_trip}')">
  <i class="hgi hgi-stroke hgi-share-01"></i> Share
  </button>
  <button class="book-btn" onclick="window.open('https://wa.me/628123456789?text=Halo GasKuy! Saya mau booking trip ${trip.nama_trip}')">
  <i class="hgi hgi-stroke hgi-calendar-lock-01"></i> Booking
  </button>
  </div>
  </div> `;
  overlay.classList.add('active');
  sheet.classList.add('active');
}
const renderGrid = (containerSelector, data) => {
  const container = document.querySelector(containerSelector);
  if (data.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--earth-wood);">Yah, trip belum tersedia...</p>`;
    return;
  }
  container.innerHTML = data.map(trip => createTripCard(trip)).join('');
};
async function initApp() {
  try {
    const response = await fetch('data/trips.json');
    allTrips = await response.json();
    const terbaru = [...allTrips].sort(() => 0.5 - Math.random()).slice(0, 4);
    renderGrid('#grid-terbaru', terbaru);
    renderGrid('#grid-trending', allTrips.filter(t => t.marks.includes('Trending')));
    renderGrid('#grid-murah', allTrips.filter(t => t.marks.includes('Murah')));
    renderGrid('#grid-promo', allTrips.filter(t => t.marks.includes('Promo')));
    const exploreGrid = document.querySelector('#explore-content .trip-grid');
    if(exploreGrid) {
      renderGrid('#explore-content .trip-grid', allTrips);
    }
    setupEventListeners();
    } catch (error) {
    console.error('Error inisialisasi aplikasi:', error);
  }
}
navItems.forEach(item => {
  item.addEventListener('click', function() {
    const target = this.getAttribute('data-target');
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
    Object.values(contents).forEach(div => div.style.display = 'none');
    if (contents[target]) {
      contents[target].style.display = 'block';
      if(target === 'explore' && allTrips.length > 0) {
        renderGrid('#explore-content .trip-grid', allTrips);
      }
    }
    document.querySelector('.app').scrollTop = 0;
  });
});
function setupEventListeners() {
  document.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      const filtered = allTrips.filter(t => t.marks.includes(category));
      openModal(`Trip ${category}`, filtered);
    });
  });
  const tags = document.querySelectorAll('.filter-tags .tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const level = tag.getAttribute('data-level');
      const filtered = (level === 'Semua') ? allTrips : allTrips.filter(t => t.marks.includes(level));
      renderGrid('#explore-content .trip-grid', filtered);
    });
  });
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = allTrips.filter(t =>
    t.nama_trip.toLowerCase().includes(keyword) ||
    t.lokasi.wilayah.toLowerCase().includes(keyword)
    );
    renderGrid('#explore-content .trip-grid', filtered);
  });
}
async function downloadTripImage(tripId) {
  const element = document.querySelector('.detail-container');
  const btnDownload = event.currentTarget;
  const originalText = btnDownload.innerHTML;
  btnDownload.innerHTML = "Processing...";
  btnDownload.disabled = true;
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: "#fdfaf7",
      scrollY: -window.scrollY
    });
    const link = document.createElement('a');
    link.download = `Trip-GasKuy-${tripId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    } catch (err) {
    console.error("Gagal membuat gambar:", err);
    alert("Maaf, gagal membuat gambar. Pastikan koneksi internet stabil.");
    } finally {
    btnDownload.innerHTML = originalText;
    btnDownload.disabled = false;
  }
}
function shareTrip(name) {
  if (navigator.share) {
    navigator.share({
      title: 'GasKuy Adventure',
      text: `Cek petualangan seru ini: ${name}! Yuk muncak bareng GasKuy Adventure.`,
      url: window.location.href
    }).catch(console.error);
    } else {
    alert("Link disalin ke clipboard!");
    navigator.clipboard.writeText(`Cek trip ${name} di GasKuy Adventure: ${window.location.href}`);
  }
}
function logout() {
  localStorage.removeItem('gaskuySession');
  window.location.replace('login.html');
}
initApp();
const mainFab = document.getElementById('mainFab');
const fabMenu = document.getElementById('fabMenu');
mainFab.addEventListener('click', () => {
  fabMenu.classList.toggle('active');  mainFab.classList.toggle('open');
});