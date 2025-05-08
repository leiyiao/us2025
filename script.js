document.addEventListener('DOMContentLoaded', function() {
    // Create day navigation
    const dayCards = document.querySelectorAll('.day-card');
    const dayNav = document.createElement('div');
    dayNav.className = 'day-navigation';
    
    const dayDates = [
        { en: 'May 15', zh: '5月15日' },
        { en: 'May 16', zh: '5月16日' },
        { en: 'May 17', zh: '5月17日' },
        { en: 'May 18', zh: '5月18日' },
        { en: 'May 19', zh: '5月19日' },
        { en: 'May 20', zh: '5月20日' },
        { en: 'May 21', zh: '5月21日' }
    ];
    
    dayCards.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'day-nav-button';
        button.setAttribute('data-en', dayDates[index].en);
        button.setAttribute('data-zh', dayDates[index].zh);
        button.textContent = dayDates[index].zh; // Default to Chinese
        button.setAttribute('data-target', card.id);
        button.addEventListener('click', () => {
            const headerHeight = document.querySelector('header').offsetHeight;
            const cardPosition = card.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: cardPosition - headerHeight,
                behavior: 'smooth'
            });
            updateActiveButton(button);
        });
        dayNav.appendChild(button);
    });
    
    document.querySelector('header .container').appendChild(dayNav);
    
    // Update active button on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(dayCards).indexOf(entry.target);
                const buttons = document.querySelectorAll('.day-nav-button');
                if (buttons[index]) {
                    updateActiveButton(buttons[index]);
                }
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '-80px 0px 0px 0px' // Offset for header height
    });
    
    dayCards.forEach(card => observer.observe(card));
    
    // Update scroll indicator
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.width = `${scrollPercent}%`;
    });
    
    // Helper function to update active button
    function updateActiveButton(activeButton) {
        document.querySelectorAll('.day-nav-button').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    // Add current day highlighting
    const today = new Date();
    const startDate = new Date('2024-05-15');
    const endDate = new Date('2024-05-22');
    
    if (today >= startDate && today <= endDate) {
        const dayDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < dayCards.length) {
            dayCards[dayDiff].classList.add('current-day');
            document.querySelectorAll('.day-nav-button')[dayDiff].classList.add('current');
        }
    }

    // Add language switcher
    const languageSwitcher = document.createElement('div');
    languageSwitcher.className = 'language-switcher';
    languageSwitcher.innerHTML = `
        <button class="lang-btn" data-lang="en">English</button>
        <button class="lang-btn active" data-lang="zh">中文</button>
    `;
    document.querySelector('header .container').appendChild(languageSwitcher);

    // Set initial language state
    document.body.setAttribute('data-lang', 'zh');
    
    // Language switching functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            document.body.setAttribute('data-lang', lang);
            
            // Update day navigation buttons
            document.querySelectorAll('.day-nav-button').forEach(button => {
                button.textContent = button.getAttribute(`data-${lang}`);
            });
            
            // Update title
            document.querySelector('.en-title').style.display = lang === 'en' ? 'block' : 'none';
            document.querySelector('.zh-title').style.display = lang === 'zh' ? 'block' : 'none';
            
            // Update celebration badge text
            document.querySelector('.celebration-badge .en-text').style.display = lang === 'en' ? 'inline' : 'none';
            document.querySelector('.celebration-badge .zh-text').style.display = lang === 'zh' ? 'inline' : 'none';
                
            // Update day headers and dates
            document.querySelectorAll('.day-card').forEach(card => {
                card.querySelector('.en-title').style.display = lang === 'en' ? 'block' : 'none';
                card.querySelector('.zh-title').style.display = lang === 'zh' ? 'block' : 'none';
                card.querySelector('.en-date').style.display = lang === 'en' ? 'block' : 'none';
                card.querySelector('.zh-date').style.display = lang === 'zh' ? 'block' : 'none';
            });
            
            // Update event times
            document.querySelectorAll('.event').forEach(event => {
                event.querySelector('.en-time').style.display = lang === 'en' ? 'block' : 'none';
                event.querySelector('.zh-time').style.display = lang === 'zh' ? 'block' : 'none';
            });
            
            // Update event titles and content
            document.querySelectorAll('.event-details').forEach(detail => {
                // Update titles
                detail.querySelector('.en-title').style.display = lang === 'en' ? 'inline' : 'none';
                detail.querySelector('.zh-title').style.display = lang === 'zh' ? 'inline' : 'none';
                
                // Update content
                const enContent = detail.querySelectorAll('p:not(.zh-content p)');
                const zhContent = detail.querySelector('.zh-content');
                
                enContent.forEach(p => {
                    p.style.display = lang === 'en' ? 'block' : 'none';
                });
                
                if (zhContent) {
                    zhContent.style.display = lang === 'zh' ? 'block' : 'none';
                }
            });
        });
    });

    // Add touch event listeners for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.event-details').forEach(detail => {
            detail.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            detail.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click event for direction buttons with visual feedback
    const directionButtons = document.querySelectorAll('.maps-button');
    
    directionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            const destination = button.getAttribute('href').split('daddr=')[1].split('&')[0];
            console.log(`Navigation requested to: ${decodeURIComponent(destination)}`);
        });
    });

    // Add fireworks functionality
    const celebrationBadge = document.querySelector('.celebration-badge');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    function createFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = 3 + Math.random() * 4;
        firework.style.width = size + 'px';
        firework.style.height = size + 'px';
        
        return firework;
    }
    
    function showFireworks() {
        // Create multiple fireworks across the screen
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const firework = createFirework(x, y);
            document.body.appendChild(firework);
                
            // Remove firework after animation
                setTimeout(() => {
                firework.remove();
            }, 1500);
            }
        }
    
    celebrationBadge.addEventListener('click', showFireworks);

    // Add Maps links to all locations
    document.querySelectorAll('.event-details').forEach(detail => {
        const locationTitle = detail.querySelector('h3').textContent.trim();
        const mapsButtons = document.createElement('div');
        mapsButtons.className = 'maps-buttons';
        
        // Get the English location name based on the location title
        let locationName;
        if (locationTitle.includes('Drive from JFK to Hanover')) {
            locationName = 'Hanover, NH';
        } else if (locationTitle.includes('Hampton Inn White River Junction')) {
            locationName = 'Hampton Inn White River Junction, White River Junction, VT';
        } else if (locationTitle.includes('Dartmouth College')) {
            locationName = 'Dartmouth College, Hanover, NH';
        } else if (locationTitle.includes('Connecticut River')) {
            locationName = 'Connecticut River, White River Junction, VT';
        } else if (locationTitle.includes('Merrimack Premium Outlets')) {
            locationName = 'Merrimack Premium Outlets, Merrimack, NH';
        } else if (locationTitle.includes('Boston Red Roof Plus Logan')) {
            locationName = 'Red Roof Plus Boston Logan, Boston, MA';
        } else if (locationTitle.includes('MIT')) {
            locationName = 'Massachusetts Institute of Technology, Cambridge, MA';
        } else if (locationTitle.includes('Yale University Graduation')) {
            locationName = 'Yale University, New Haven, CT';
        } else if (locationTitle.includes('New Haven Exploration')) {
            locationName = 'Yale University Art Gallery, New Haven, CT';
        } else if (locationTitle.includes('The Stamford Hotel')) {
            locationName = 'The Stamford Hotel, Stamford, CT';
        } else if (locationTitle.includes('Amtrak to NYC')) {
            locationName = 'Stamford Transportation Center, Stamford, CT';
        } else if (locationTitle.includes('New York City Exploration')) {
            locationName = 'Times Square, New York, NY';
        } else if (locationTitle.includes('Drive to JFK')) {
            locationName = 'John F. Kennedy International Airport, Queens, NY';
        } else if (locationTitle.includes('Depart JFK')) {
            locationName = 'John F. Kennedy International Airport, Queens, NY';
        } else {
            locationName = locationTitle; // Fallback to the original title
        }
        
        // Create Apple Maps button
        const appleMapsBtn = document.createElement('a');
        appleMapsBtn.className = 'maps-button apple-maps';
        appleMapsBtn.href = `maps://maps.apple.com/?q=${encodeURIComponent(locationName)}`;
        appleMapsBtn.innerHTML = `
            <svg class="apple-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.07 2.7.61 3.44 1.57-3.14 1.88-2.29 5.74.64 6.81-.75 2.21-1.67 4.4-3.57 6.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple Maps
        `;
        
        // Create Waze button
        const wazeBtn = document.createElement('a');
        wazeBtn.className = 'maps-button waze';
        wazeBtn.href = `https://waze.com/ul?q=${encodeURIComponent(locationName)}&navigate=yes`;
        wazeBtn.target = '_blank';
        wazeBtn.innerHTML = '<span class="material-icons">navigation</span>Waze';
        
        // Add click handler for Apple Maps
        appleMapsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.href;
            
            // Try to open Apple Maps
            window.location.href = url;
            
            // Fallback to web version after a short delay
            setTimeout(() => {
                window.location.href = `https://maps.apple.com/?q=${encodeURIComponent(locationName)}`;
            }, 1000);
        });
        
        // Add click handler for Waze
        wazeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.href;
            
            // Try to open Waze app
            window.location.href = `waze://?q=${encodeURIComponent(locationName)}&navigate=yes`;
            
            // Fallback to web version after a short delay
            setTimeout(() => {
                window.location.href = url;
            }, 1000);
        });
        
        mapsButtons.appendChild(appleMapsBtn);
        mapsButtons.appendChild(wazeBtn);
        detail.appendChild(mapsButtons);
    });
}); 