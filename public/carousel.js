document.addEventListener('DOMContentLoaded', function() {
  const leftBtn = document.querySelector('.carousel-arrow.left');
  const rightBtn = document.querySelector('.carousel-arrow.right');
  const strip = document.querySelector('.card-strip');
  
  if (!strip || !leftBtn || !rightBtn) return;

  const getScrollAmount = () => {
    const card = strip.querySelector('.character-card');
    if (!card) return 0;
    
    const cardWidth = card.offsetWidth;
    const gap = 24; 
    return (cardWidth + gap) * 2.5;
  };

  leftBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    strip.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });

  rightBtn.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    strip.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });

  const updateArrows = () => {
    const isAtStart = strip.scrollLeft <= 10;
    const isAtEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 10;
    
    leftBtn.style.opacity = isAtStart ? '0.3' : '1';
    leftBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
    
    rightBtn.style.opacity = isAtEnd ? '0.3' : '1';
    rightBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
  };

  strip.addEventListener('scroll', updateArrows);
  
  setTimeout(updateArrows, 100);

  let isDown = false;
  let startX;
  let scrollLeft;

  strip.addEventListener('mousedown', (e) => {
    isDown = true;
    strip.style.cursor = 'grabbing';
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });

  strip.addEventListener('mouseleave', () => {
    isDown = false;
    strip.style.cursor = 'grab';
  });

  strip.addEventListener('mouseup', () => {
    isDown = false;
    strip.style.cursor = 'grab';
  });

  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 2;
    strip.scrollLeft = scrollLeft - walk;
  });

  strip.style.cursor = 'grab';
});