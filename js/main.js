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
function renderSmartMedia(url, poster) {
  // 1. Deteksi YouTube
  const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytRegex);
  
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return `
      <div class="video-container" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:15px; background:#000;">
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
      </div>`;
  }
  
  // 2. Deteksi Direct Video Link (MP4, WebM, dsb)
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const isDirectVideo = videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  if (isDirectVideo) {
    return `
      <video controls poster="${poster}" style="width:100%; border-radius:15px; background:#000; display:block;">
        <source src="${url}" type="video/mp4">
        Browser tidak mendukung video.
      </video>`;
  }
  
  // 3. Fallback: Jika link biasa (misal Google Drive atau Web lain)
  return `
    <div class="video-wrapper" onclick="window.open('${url}')" style="cursor:pointer;">
      <div class="video-overlay">
        <i class="hgi hgi-stroke hgi-play-circle"></i>
        <span style="display:block; font-size:0.8rem; margin-top:5px;">Buka Video Eksternal</span>
      </div>
      <img src="${poster}" style="width:100%; height:180px; object-fit:cover; opacity:0.6; border-radius:15px;">
    </div>`;
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
  ${trip.media.galeri.map((img, index) => 
    `<img src="${img}" class="gallery-img" alt="Gallery" onclick="openLightbox('${id}', ${index})">`
  ).join('')}
</div>
  <h3 class="section-title" style="margin-top:20px;">Titik Kumpul</h3>
  <div class="mp-container">
  ${trip.meeting_points.map(mp => `
    <div class="mp-chip"><i class="hgi hgi-stroke hgi-location-01"></i> ${mp}</div><i style="font-size: 1.2rem; margin: auto 2px;" class="hgi hgi-stroke hgi-circle-arrow-right-double"></i>
  `).join('')}
  </div>
<h3 class="section-title">Cinematic Teaser</h3>
<div class="media-render-area" style="margin-bottom:20px;">
  ${renderSmartMedia(trip.media.video, trip.media.galeri[0])}
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
<button class="share-btn" onclick="shareTrip('${trip.nama_trip}', '${trip.trip_id}')">
  <i class="hgi hgi-stroke hgi-share-01"></i> Share
</button>
<button class="book-btn" onclick="openBookingModal('${trip.trip_id}')" style="width:100%;">
  <i class="hgi hgi-stroke hgi-ticket-01"></i> Pesan Sekarang
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
let currentGallery = [];
let currentIndex = 0;

function openLightbox(tripId, index) {
  const trip = allTrips.find(t => t.trip_id === tripId);
  if (!trip) return;

  currentGallery = trip.media.galeri;
  currentIndex = index;

  updateLightboxSource();
  document.getElementById('lightboxOverlay').classList.add('active');
}

function updateLightboxSource() {
  const imgElement = document.getElementById('lightboxImg');
  imgElement.src = currentGallery[currentIndex];
}

function changeLightboxImage(direction) {
  currentIndex += direction;
  // Loop kembali ke awal jika sudah di akhir, atau sebaliknya
  if (currentIndex >= currentGallery.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = currentGallery.length - 1;
  updateLightboxSource();
}

function closeLightbox() {
  document.getElementById('lightboxOverlay').classList.remove('active');
}

// Tutup dengan tombol Esc
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") closeLightbox();
});

// Data Perlengkapan Sewa
const equipmentData = [
  { id: 'tenda', name: 'Tenda Kap. 4', price: 'Rp 50k' },
  { id: 'carrier', name: 'Carrier 60L', price: 'Rp 35k' },
  { id: 'sleeping_bag', name: 'Sleeping Bag', price: 'Rp 15k' },
  { id: 'matras', name: 'Matras Angin', price: 'Rp 15k' },
  { id: 'headlamp', name: 'Headlamp', price: 'Rp 10k' },
  { id: 'trekking_pole', name: 'Trekking Pole', price: 'Rp 15k' }
];
// State untuk menyimpan jumlah sewa (ID: Jumlah)
let selectedRentals = {};
// Fungsi untuk membuka modal booking
async function openBookingModal(tripId) {
    const trip = allTrips.find(t => t.trip_id === tripId);
    const overlay = document.getElementById('bookingOverlay');
    const modal = document.getElementById('bookingModal');
    const body = document.getElementById('bookingModalBody');

    overlay.classList.add('active');
    modal.classList.add('active');

    try {
        // Ambil konten dari booking.html
        const response = await fetch('./booking.html');
        const html = await response.text();
        
        // Masukkan konten ke modal
        body.innerHTML = html;

        // Otomatis isi nama trip (jika ada input dengan id 'input_trip_name')
        const tripInput = document.getElementById('input_trip_name');
        if(tripInput) tripInput.value = trip.nama_trip;

    } catch (err) {
        body.innerHTML = "<p style='padding:20px;'>Gagal memuat form booking. Coba lagi nanti.</p>";
    }
    
    // Inisialisasi ulang state sewa
    selectedRentals = {};
    equipmentData.forEach(item => selectedRentals[item.id] = 0);
    
    // Render list sewa ke dalam modal
const rentalContainer = document.getElementById('rental-list');
if (rentalContainer) {
  rentalContainer.innerHTML = equipmentData.map(item => `
            <div class="rental-item">
                <div>
                    <div style="font-weight:500; font-size:0.9rem;">${item.name}</div>
                    <small style="color:var(--earth-wood);">${item.price}</small>
                </div>
                <div class="counter-group">
                    <button class="btn-counter" onclick="updateRental('${item.id}', -1)">-</button>
                    <span class="count-value" id="count-${item.id}">0</span>
                    <button class="btn-counter" onclick="updateRental('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
}
}
// Fungsi Tambah/Kurang
function updateRental(id, change) {
  const newValue = Math.max(0, (selectedRentals[id] || 0) + change);
  selectedRentals[id] = newValue;
  document.getElementById(`count-${id}`).innerText = newValue;
}
function closeBookingModal() {
    document.getElementById('bookingOverlay').classList.remove('active');
    document.getElementById('bookingModal').classList.remove('active');
}

// Fungsi yang dipanggil saat tombol di dalam booking.html diklik
function sendBookingToWA() {
    const name = document.getElementById('customer_name').value;
    const phone = document.getElementById('customer_phone').value;
    const date = document.getElementById('trip_date').value;
    const tripName = document.getElementById('input_trip_name').value;
    const participants = document.getElementById('participants').value;

    if(!name || !phone || !date) {
        alert("Mohon lengkapi data pemesanan!");
        return;
    }

    // Susun daftar sewa yang jumlahnya > 0
let rentalText = "";
equipmentData.forEach(item => {
  if (selectedRentals[item.id] > 0) {
    rentalText += `- ${item.name} (${selectedRentals[item.id]}x)%0A`;
  }
});

if (rentalText !== "") {
  rentalText = `%0A📦 *Tambahan Sewa:*%0A${rentalText}`;
}

const message = `Halo GasKuy Adventure!%0A%0A` +
  `Saya ingin booking trip:%0A` +
  `🏔️ *Trip:* ${tripName}%0A` +
  `👤 *Nama:* ${name}%0A` +
  `📅 *Tanggal:* ${date}%0A` +
  `👥 *Peserta:* ${participants} Orang%0A` +
  `${rentalText}%0A` +
  `Mohon total biayanya ya!`;

window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
}
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
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');
    if (tripId) {
      // Tunggu sebentar agar data siap, lalu tampilkan detail
      setTimeout(() => showDetail(tripId), 500);
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
function shareTrip(name, tripId) {
  // Membuat URL khusus dengan parameter ID trip
  const shareUrl = `${window.location.origin}${window.location.pathname}?id=${tripId}`;
  const shareText = `Cek petualangan seru ini: ${name}! Yuk muncak bareng GasKuy Adventure.`;

  if (navigator.share) {
    navigator.share({
      title: 'GasKuy Adventure',
      text: shareText,
      url: shareUrl
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(`${shareText} Klik di sini: ${shareUrl}`);
    alert("Link khusus trip disalin ke clipboard!");
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
