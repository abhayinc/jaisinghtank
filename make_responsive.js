const fs = require('fs');
const cheerio = require('cheerio');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const burgerStyles = `
        /* Burger Menu Styles */
        .burger {
            display: none;
            cursor: pointer;
            flex-direction: column;
            gap: 5px;
            z-index: 1001;
        }

        .burger div {
            width: 25px;
            height: 2px;
            background-color: var(--white);
            transition: all 0.3s ease;
        }

        @media (max-width: 680px) {
            .burger {
                display: flex;
            }

            .nav-links {
                position: fixed;
                right: -100%;
                top: 72px; 
                height: calc(100vh - 72px);
                background: var(--black);
                display: flex !important;
                flex-direction: column;
                align-items: center;
                width: 80%;
                transition: right 0.5s ease;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                padding-top: 40px;
                border-left: var(--border);
                overflow-y: auto;
            }

            .nav-links.open {
                right: 0;
            }

            .nav-links li {
                margin: 15px 0;
                width: 100%;
                text-align: center;
            }

            .nav-links li.dropdown .dropdown-content {
                position: static;
                display: block;
                box-shadow: none;
                border: none;
                text-align: center;
                padding: 0;
                margin-top: 10px;
                background: rgba(0,0,0,0.05);
            }
            
            .nav-links li.dropdown .dropdown-content li a {
                padding: 10px;
                font-size: 12px;
            }

            /* Burger Animation */
            .burger.toggle .line1 {
                transform: rotate(-45deg) translate(-5px, 5px);
            }
            .burger.toggle .line2 {
                opacity: 0;
            }
            .burger.toggle .line3 {
                transform: rotate(45deg) translate(-5px, -5px);
            }
        }
`;

const burgerHtml = `
            <div class="burger" id="burger">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
            </div>
`;

const burgerJs = `
        const burger = document.getElementById('burger');
        const navLinks = document.querySelector('.nav-links');

        if (burger) {
            burger.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                burger.classList.toggle('toggle');
            });
        }
`;

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });
    
    // Add CSS
    $('head style').first().append(burgerStyles);
    
    // Add Burger HTML
    $('.nav-logo').after(burgerHtml);
    
    // Add JS
    $('script').last().append(burgerJs);
    
    // Clean up existing mobile display: none if any
    let result = $.html();
    result = result.replace(/.nav-links\s*{\s*display:\s*none;\s*}/g, '');
    
    fs.writeFileSync(file, result, 'utf8');
});

console.log('Made all pages responsive with burger menu.');
