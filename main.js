const cursor = document.querySelector('.cursor');
const cards = document.querySelectorAll('.card');
const video = document.querySelector('.hero-video');
const heroName = document.querySelector('.hero-name');
const bgPara = document.querySelector('.bg-paragraph');
const nav = document.querySelector('.nav');

if (video) {
  video.addEventListener('loadedmetadata', () => {
    video.playbackRate = 2.0;
  });
  

  const originalText = bgPara ? bgPara.textContent.trim().replace(/\s+/g, ' ') : '';
  if (bgPara) bgPara.textContent = '';

  let hasRevealed = false;
  const revealContent = () => {
    if (hasRevealed) return;
    hasRevealed = true;

    if (heroName) {
      heroName.style.opacity = '1';
    }


    setTimeout(() => {

      if (nav) nav.style.opacity = '1';


      cards.forEach(card => {
        card.style.opacity = '1';
        card.classList.add('animate-in');
      });


      setTimeout(() => {
        if (bgPara && originalText) {
          let i = 0;
          const speed = 40;
          
          function typeWriter() {
            if (i < originalText.length) {
              bgPara.textContent += originalText.charAt(i);
              i++;
              setTimeout(typeWriter, speed);
            }
          }
          typeWriter();
        }
      }, 1000);
    }, 1200);
  };

  video.addEventListener('ended', revealContent);
  

  window.addEventListener('load', () => {
    setTimeout(revealContent, 3000); 
  });
  

  setTimeout(revealContent, 5000);
}

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

let activeCard = null;
let offset = { x: 0, y: 0 };
let zIndexCounter = 100;

cards.forEach(card => {
  card.addEventListener('mousedown', (e) => {
    activeCard = card;
    card.style.zIndex = zIndexCounter++;
    

    const rect = card.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;
    
    card.style.transition = 'none';
    card.style.animation = 'none';
    card.style.opacity = '1';


    if (card.classList.contains('blue')) {
      bgPara.classList.add('dark-mode');
    }
  });
});

document.addEventListener('mousemove', (e) => {
  if (activeCard) {
    activeCard.style.left = (e.clientX - offset.x) + 'px';
    activeCard.style.top = (e.clientY - offset.y) + 'px';
    activeCard.style.transform = activeCard.style.transform.replace(/translateX\(-50%\)/, '');
  }
});

document.addEventListener('mouseup', () => {
  if (activeCard && activeCard.classList.contains('blue')) {
    bgPara.classList.remove('dark-mode');
  }
  activeCard = null;
});


const hoverElements = document.querySelectorAll('.card, .gallery-item img, .gallery-item video');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
});


function toggleIdeation(element) {
  const item = element.parentElement;
  

  if (item.classList.contains('active')) {
    item.classList.remove('active');
  } else {

    document.querySelectorAll('.ideation-item').forEach(otherItem => {
      otherItem.classList.remove('active');
    });

    item.classList.add('active');
  }
}


const ideationObserverOptions = {
  root: null,
  rootMargin: '-25% 0px -25% 0px',
  threshold: 0
};

const ideationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      document.querySelectorAll('.ideation-item').forEach(item => {
        if (item !== entry.target) item.classList.remove('active');
      });

      entry.target.classList.add('active');
    } else {

      entry.target.classList.remove('active');
    }
  });
}, ideationObserverOptions);

document.querySelectorAll('.ideation-item').forEach(item => {
  ideationObserver.observe(item);
});

