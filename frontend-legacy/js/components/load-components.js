function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) {
        return Promise.resolve();
    }

    return fetch(filePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            return response.text();
        })
        .then((html) => {
            element.innerHTML = html;
            initializeComponent(elementId);
        })
        .catch((error) => {
            console.error('Component load error:', error);
            element.innerHTML = `<div style="padding: 20px; color: red;">Không thể tải ${elementId}</div>`;
        });
}

function initializeHeader() {
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        let directionStart = lastScrollY;
        let lastDirection = '';

        window.addEventListener('scroll', () => {
            const currentScrollY = Math.max(window.scrollY, 0);
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';

            if (currentScrollY <= 0) {
                header.classList.remove('header-hidden');
                directionStart = 0;
            } else {
                if (direction !== lastDirection) {
                    directionStart = lastScrollY;
                    lastDirection = direction;
                }

                if (Math.abs(currentScrollY - directionStart) >= 12) {
                    header.classList.toggle('header-hidden', direction === 'down' && currentScrollY > header.offsetHeight);
                    directionStart = currentScrollY;
                }
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    if (typeof window.updateHeaderAuth === 'function') {
        window.updateHeaderAuth();
    }

    if (typeof window.updateCartBadge === 'function') {
        window.updateCartBadge();
    }

    if (typeof window.updateWishlistBadge === 'function') {
        window.updateWishlistBadge();
    }
}

function initializeComponent(componentId) {
    if (componentId === 'header') {
        initializeHeader();
    }
}

function getComponentPath(componentName) {
    return new URL(`../../components/${componentName}.html`, window.location.href).href;
}

function loadCommonComponents() {
    const tasks = [];

    if (document.getElementById('header')) {
        tasks.push(loadComponent('header', getComponentPath('header')));
    }

    if (document.getElementById('footer')) {
        tasks.push(loadComponent('footer', getComponentPath('footer')));
    }

    return Promise.all(tasks);
}

window.loadCommonComponents = loadCommonComponents;
