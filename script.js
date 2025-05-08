document.addEventListener('DOMContentLoaded', function() {
    // Initialize the scroll indicator
    const scrollIndicator = document.getElementById('scrollIndicator');
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        // Throttle scroll updates for better performance
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                // Update scroll indicator width
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                scrollIndicator.style.width = scrolled + '%';
                
                // Add shadow to header on scroll
                const header = document.querySelector('header');
                if (winScroll > 10) {
                    header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                }
                
                scrollTimeout = null;
            }, 16); // Approximately 60fps
        }
    });

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

    // Add day selector navigation with improved UI
    const createDaySelector = () => {
        const dayCards = document.querySelectorAll('.day-card');
        if (dayCards.length <= 1) return;

        const navContainer = document.createElement('div');
        navContainer.className = 'day-navigation';
        
        dayCards.forEach((card, index) => {
            const dayNum = index + 1;
            const dayHeader = card.querySelector('.day-header');
            const dayTitle = dayHeader.querySelector('.day-date').textContent;
            
            const button = document.createElement('button');
            button.innerText = `Day ${dayNum}`;
            button.setAttribute('title', dayTitle);
            button.className = 'day-nav-button';
            button.setAttribute('data-target', card.id);
            
            button.addEventListener('click', () => {
                // Scroll to the day card
                window.scrollTo({
                    top: card.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active button
                document.querySelectorAll('.day-nav-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Add animation to highlight the card
                card.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 500);
            });
            
            navContainer.appendChild(button);
        });
        
        // Add sticky navigation to header
        const header = document.querySelector('header .container');
        header.appendChild(navContainer);
        
        // Set first day as active by default
        const firstButton = navContainer.querySelector('.day-nav-button');
        if (firstButton) firstButton.classList.add('active');
        
        // Implement scroll spy with improved performance
        let scrollSpyTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollSpyTimeout) {
                scrollSpyTimeout = setTimeout(() => {
                    let currentDay = '';
                    const scrollPosition = window.scrollY + 150; // Offset for header
                    
                    dayCards.forEach(card => {
                        if (card.offsetTop <= scrollPosition) {
                            currentDay = card.id;
                        }
                    });
                    
                    if (currentDay) {
                        document.querySelectorAll('.day-nav-button').forEach(btn => {
                            btn.classList.remove('active');
                            if (btn.getAttribute('data-target') === currentDay) {
                                btn.classList.add('active');
                            }
                        });
                    }
                    
                    scrollSpyTimeout = null;
                }, 100);
            }
        });
    };
    
    // Call the day selector function
    createDaySelector();

    // Add current day highlight if applicable
    const highlightCurrentDay = () => {
        const today = new Date();
        const month = today.getMonth() + 1; // JS months are 0-indexed
        const day = today.getDate();
        
        // Only run during May 9-14, 2025
        if (today.getFullYear() === 2025 && month === 5 && day >= 9 && day <= 14) {
            const dayIndex = day - 9; // Convert to 0-based index
            const dayCards = document.querySelectorAll('.day-card');
            
            if (dayCards[dayIndex]) {
                dayCards[dayIndex].classList.add('current-day');
                
                // Also highlight the navigation button
                const navButtons = document.querySelectorAll('.day-nav-button');
                if (navButtons[dayIndex]) {
                    navButtons[dayIndex].classList.add('current');
                }
                
                // Auto-scroll to current day
                setTimeout(() => {
                    window.scrollTo({
                        top: dayCards[dayIndex].offsetTop - 100,
                        behavior: 'smooth'
                    });
                }, 500);
            }
        }
    };
    
    // Add event listeners for better mobile experience
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
    
    // Call the highlight function
    highlightCurrentDay();
}); 