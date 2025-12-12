// DARK MODE LOGIC 
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. UI & NAVIGATION (Supaya Layout Rapi)
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menu-toggle');
    const menuMobile = document.getElementById('menu-mobile');
    const ctaDesktop = document.getElementById('cta-button-desktop');
    const ctaMobile = document.getElementById('cta-button-mobile');
    const header = document.getElementById('main-header');
    
    // Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    function updateThemeIcons() {
        if (document.documentElement.classList.contains('dark')) {
            if(iconSun) iconSun.classList.remove('hidden');
            if(iconMoon) iconMoon.classList.add('hidden');
        } else {
            if(iconSun) iconSun.classList.add('hidden');
            if(iconMoon) iconMoon.classList.remove('hidden');
        }
    }
    updateThemeIcons();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
            updateThemeIcons();
        });
    }

    // Navbar Scroll Effect 
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll Reveal Animation (Ini yang bikin elemen muncul pelan-pelan)
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-in').forEach(el => {
        revealOnScroll.observe(el);
    });

    // Navigation Logic 
    function showPage(targetId) {
        pages.forEach(page => { page.classList.remove('active'); });
        window.scrollTo(0, 0);
        
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
            setTimeout(() => {
                targetPage.querySelectorAll('.reveal-up, .reveal-in').forEach(el => {
                    revealOnScroll.observe(el);
                });
            }, 50);
        }

        if (ctaDesktop && ctaMobile) {
            if (targetId === 'page-home') {
                ctaDesktop.classList.add('hidden');
                ctaMobile.classList.add('hidden');
            } else {
                ctaDesktop.classList.remove('hidden');
                ctaMobile.classList.remove('hidden');
            }
        }
        if (menuMobile) menuMobile.classList.add('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) { showPage(targetId); }
        });
    });

    if (menuToggle && menuMobile) {
        menuToggle.addEventListener('click', () => {
            menuMobile.classList.toggle('hidden');
        });
    }

    // ==========================================
    // 2. FORM WA & JAM
    // ==========================================
    const submitButton = document.getElementById('submit-booking-form');
    const formError = document.getElementById('form-error');
    const roomSelect = document.getElementById('room_type');
    const priceContainer = document.getElementById('price-container');
    const priceDisplay = document.getElementById('price-display');
    const dateInput = document.getElementById('checkin_date');
    const adminWA = '6282146152529'; 

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (roomSelect) {
        roomSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            if (price) {
                priceDisplay.textContent = price;
                priceContainer.classList.remove('hidden');
                priceContainer.classList.add('flex');
            } else {
                priceContainer.classList.add('hidden');
            }
        });
    }

    if (submitButton && formError) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            formError.classList.add('hidden');
            const name = document.getElementById('name').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const roomType = document.getElementById('room_type').value;
            const checkinDate = document.getElementById('checkin_date').value;
            const message = document.getElementById('message').value.trim();

            if (!name || name.length < 3) { showError('Nama wajib diisi minimal 3 huruf.'); return; }
            if (!whatsapp || !/^08[0-9]{8,13}$/.test(whatsapp)) { showError('Nomor WA tidak valid.'); return; }
            if (!roomType) { showError('Pilih tipe kamar dulu.'); return; }
            if (!checkinDate) { showError('Pilih tanggal check-in.'); return; }

            const dateObj = new Date(checkinDate);
            const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            const finalMsg = `Halo Kak Admin Griya Tarudan,%0A` +
                             `Aku mau reservasi dongg.%0A%0A` +
                             `Nama: ${encodeURIComponent(name)}%0A` +
                             `No. WA: ${encodeURIComponent(whatsapp)}%0A` +
                             `Tipe Kamar: ${encodeURIComponent(roomType)}%0A` +
                             `Rencana Check-in: ${encodeURIComponent(formattedDate)}%0A` +
                             `Catatan: ${encodeURIComponent(message)}`;
            
            const waURL = `https://wa.me/${adminWA}?text=${finalMsg}`;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) { window.location.href = waURL; } else { window.open(waURL, '_blank'); }
        });
    }

    function showError(msg) {
        if(formError) {
            formError.textContent = msg;
            formError.classList.remove('hidden');
        }
    }

    function updateRealTimeClock() {
        const desktopClock = document.getElementById('clock-desktop');
        const mobileClock = document.getElementById('clock-mobile');
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        
        if (desktopClock) desktopClock.innerText = timeString;
        if (mobileClock) mobileClock.innerText = timeString;
    }
    setInterval(updateRealTimeClock, 1000);
    updateRealTimeClock();

    // ==========================================
    // 3. FITUR GOOGLE SHEET (JURUS PAMUNGKAS)
    // ==========================================
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTa1DSfok0DIkrJrlIBolUJPhhwgJeUbTYL9aennzzWlKYYGLp8uaOSfuyEhcUbmoAEQyDsnI3tDDbi/pub?output=csv'; 

    function updateRoomStatus() {
        console.log("Mengambil data status kamar...");
        
        // Pakai timestamp (&t=...) biar tidak kena cache browser
        fetch(sheetURL + '&t=' + new Date().getTime())
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.split('\n').map(row => row.split(','));
                
                rows.slice(1).forEach(row => {
                    if(row.length < 2) return;

                    // Ambil Data
                    let idKamar = row[0]?.trim(); 
                    let status = row[1]?.trim();  

                    if(!idKamar || !status) return;

                    // --- JURUS PAMUNGKAS ---
                    // 1. Ubah _ jadi - (tipe_a -> tipe-a)
                    // 2. Ubah jadi huruf kecil semua
                    idKamar = idKamar.replace(/_/g, '-').toLowerCase(); 
                    
                    const element = document.getElementById(`status-${idKamar}`);

                    if (element) {
                        // Reset Warna
                        element.classList.remove('bg-green-500/90', 'bg-red-600/90');

                        // Cek Status (Huruf besar/kecil tidak masalah)
                        if (status.toLowerCase() === 'full') {
                            element.classList.add('bg-red-600/90');
                            element.innerText = 'Sudah Penuh';
                        } else {
                            element.classList.add('bg-green-500/90');
                            element.innerText = 'Available';
                        }
                        console.log(`Update Sukses: ${idKamar} -> ${status}`);
                    }
                });
            })
            .catch(error => console.error('Gagal mengambil data status:', error));
    }

    // Jalankan
    updateRoomStatus();
});
