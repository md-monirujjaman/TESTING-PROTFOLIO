// Typing Animation
const typed = new Typed('.text-animate', {
    strings: ['React Developer', 'Full-Stack Developer', 'MERN Specialist'],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

// Mobile Navbar Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
}

// Fixed Header and Active Scroll Links
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });
    
    // Header shadow on scroll
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Close menu on scroll
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
};