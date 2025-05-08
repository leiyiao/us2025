document.addEventListener('DOMContentLoaded', function() {
    // Create day navigation
    const dayCards = document.querySelectorAll('.day-card');
    const dayNav = document.createElement('div');
    dayNav.className = 'day-navigation';
    
    dayCards.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'day-nav-button';
        button.textContent = `Day ${index + 1}`;
        button.setAttribute('title', card.querySelector('.day-date').textContent);
        button.setAttribute('data-target', card.id);
        button.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth' });
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
                updateActiveButton(buttons[index]);
            }
        });
    }, { threshold: 0.5 });
    
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
    const zhContents = document.querySelectorAll('.zh-content');
    zhContents.forEach(content => {
        content.style.display = 'block';
    });
    const eventDetails = document.querySelectorAll('.event-details');
    eventDetails.forEach(detail => {
        const paragraphs = detail.querySelectorAll('p:not(.zh-content p)');
        paragraphs.forEach(p => {
            p.style.display = 'none';
        });
    });

    // Language switching functionality
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            document.body.setAttribute('data-lang', lang);
            
            // Show/hide Chinese content
            const zhContents = document.querySelectorAll('.zh-content');
            zhContents.forEach(content => {
                content.style.display = lang === 'zh' ? 'block' : 'none';
            });
            
            // Hide English content when Chinese is selected
            const eventDetails = document.querySelectorAll('.event-details');
            eventDetails.forEach(detail => {
                const paragraphs = detail.querySelectorAll('p:not(.zh-content p)');
                paragraphs.forEach(p => {
                    p.style.display = lang === 'zh' ? 'none' : 'block';
                });
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
            // This could be expanded to include analytics tracking
        });
    });
}); 