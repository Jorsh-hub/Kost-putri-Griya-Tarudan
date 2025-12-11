// DARK MODE LOGIC 
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

document.addEventListener('DOMContentLoaded', () => {
    // UI & Navigation References
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menu-toggle');
    const menuMobile = document.getElementById('menu-mobile');
    const ctaDesktop = document.getElementById('cta-button-desktop');
    const ctaMobile = document.getElementById('cta-button-mobile');
    const header = document.getElementById('main-header');
    
    // Dark Mode Toggle Handler
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    function updateThemeIcons() {
        if (document.documentElement.classList.contains('dark')) {
            iconSun.classList.remove('hidden');
            iconMoon.classList.add('hidden');
        } else {
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
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
    const handleScroll = () => {
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
    };
    window.addEventListener('scroll', handleScroll);

    // Scroll Reveal Animation 
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

    // Navigation Logic (Single Page Application Feel) 
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

        if (menuMobile && !menuMobile.classList.contains('hidden')) {
            menuMobile.classList.add('hidden');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if (targetId) { showPage(targetId); }
        });
    });

    // Mobile Menu Toggle 
    if (menuToggle && menuMobile) {
        menuToggle.addEventListener('click', () => {
            menuMobile.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (e) => {
        if (menuMobile && !menuMobile.classList.contains('hidden')) {
            if (!menuMobile.contains(e.target) && !menuToggle.contains(e.target)) {
                menuMobile.classList.add('hidden');
            }
        }
    });

    // Inisialisasi status tombol CTA
    if (ctaDesktop) ctaDesktop.classList.add('hidden');
    if (ctaMobile) ctaMobile.classList.add('hidden');

    // Form Booking Logic (WhatsApp) 
    const submitButton = document.getElementById('submit-booking-form');
    const formError = document.getElementById('form-error');
    const roomSelect = document.getElementById('room_type');
    const priceContainer = document.getElementById('price-container');
    const priceDisplay = document.getElementById('price-display');
    const dateInput = document.getElementById('checkin_date');
    const adminWA = '6282146152529'; 

    // Set tanggal minimal hari ini
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Tampilkan estimasi harga saat pilih kamar
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

    // Handle Submit Form
    if (submitButton && formError) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            formError.classList.add('hidden');
            formError.textContent = '';

            const name = document.getElementById('name').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const roomType = document.getElementById('room_type').value;
            const checkinDate = document.getElementById('checkin_date').value;
            const message = document.getElementById('message').value.trim();

            // Validasi 
            if (!name) { showError('Form nya belom kakak isi nihh.'); return; }
            if (name.length < 3) { showError('Nama Kakak kependekan nih, minimal 3 huruf ya.'); return; }

            const phoneRegex = /^08[0-9]{8,13}$/;
            if (!whatsapp) { showError('Nomor WA-nya jangan lupa diisi ya Kak.'); return; }
            if (!phoneRegex.test(whatsapp)) { showError('Nomor WA harus diawali 08 dan minimal 10 digit ya Kak.'); return; }

            if (!roomType) { showError('Pilih tipe kamar yang Kakak mau dulu ya.'); return; }
            if (!checkinDate) { showError('Kapan rencana Kakak mau mulai ngekos? Isi tanggalnya ya.'); return; }
            if (!message) { showError('Pesannya diisi dulu ya Kak, misal: mau booking atau tanya info.'); return; }

            // Format Pesan WA
            const dateObj = new Date(checkinDate);
            const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            const nameEnc = encodeURIComponent(name);
            const whatsappEnc = encodeURIComponent(whatsapp);
            const roomTypeEnc = encodeURIComponent(roomType);
            const dateEnc = encodeURIComponent(formattedDate);
            const messageEnc = encodeURIComponent(message);

            const finalMsg = `Halo Kak Admin Griya Tarudan,%0A` +
                             `Aku mau reservasi dongg.%0A%0A` +
                             `Nama: ${nameEnc}%0A` +
                             `No. WA: ${whatsappEnc}%0A` +
                             `Tipe Kamar: ${roomTypeEnc}%0A` +
                             `Rencana Check-in: ${dateEnc}%0A` +
                             `Catatan: ${messageEnc}`;
            
            const waURL = `https://wa.me/${adminWA}?text=${finalMsg}`;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Buka WhatsApp
            if (isMobile) { window.location.href = waURL; } else { window.open(waURL, '_blank'); }
        });
    }

    function showError(msg) {
        formError.textContent = msg;
        formError.classList.remove('hidden');
        // Efek getar tombol
        submitButton.classList.add('translate-x-1');
        setTimeout(() => submitButton.classList.remove('translate-x-1'), 100);
    }

    // FITUR JAM REAL-TIME (WIB)
    function updateRealTimeClock() {
        const desktopClock = document.getElementById('clock-desktop');
        const mobileClock = document.getElementById('clock-mobile');
        
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds} WIB`;
        
        if (desktopClock) desktopClock.innerText = timeString;
        if (mobileClock) mobileClock.innerText = timeString;
    }

    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);
});
