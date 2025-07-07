// Esperar a que la página cargue completamente
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const bienvenida = document.getElementById("bienvenida");

  // Ocultar loader después de 2 segundos
  setTimeout(() => {
    loader.style.display = "none";

    // Mostrar mensaje de bienvenida con animación
    bienvenida.classList.add("visible");

    // Ocultar mensaje de bienvenida después de 4 segundos
    setTimeout(() => {
      bienvenida.classList.remove("visible");
    }, 4000);
  }, 2000);

  // Aplicar modo oscuro si está guardado en localStorage
  const darkModePref = localStorage.getItem("modo-oscuro") === "true";
  if (darkModePref) {
    document.body.classList.add("dark-mode");
    toggleDarkBtn.textContent = "☀️";
    toggleDarkBtn.setAttribute("aria-pressed", "true");
  } else {
    toggleDarkBtn.textContent = "🌙";
    toggleDarkBtn.setAttribute("aria-pressed", "false");
  }

  // Activar animaciones al cargar
  revealOnScroll();

  // Activar funcionalidad del lightbox
  iniciarLightbox();

  // Activar carrusel
  inicializarCarrusel();
});

// -------------------------
// Toggle menú hamburguesa
// -------------------------
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// -------------------------
// Toggle modo oscuro
// -------------------------
const toggleDarkBtn = document.getElementById("toggle-dark");

toggleDarkBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");

  if (isDark) {
    toggleDarkBtn.textContent = "☀️";
    toggleDarkBtn.setAttribute("aria-pressed", "true");
  } else {
    toggleDarkBtn.textContent = "🌙";
    toggleDarkBtn.setAttribute("aria-pressed", "false");
  }

  localStorage.setItem("modo-oscuro", isDark);
});

// -------------------------
// Animaciones con Scroll Reveal
// -------------------------
const scrollRevealElements = document.querySelectorAll(".proyecto, section, article");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  scrollRevealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add("reveal-visible");
    } else {
      el.classList.remove("reveal-visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// -------------------------
// Validación formulario de contacto
// -------------------------
const form = document.getElementById("contact-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const mensaje = form.mensaje.value.trim();

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    form.nombre.focus();
    return;
  }

  if (!email || !validateEmail(email)) {
    alert("Por favor, ingresa un correo válido.");
    form.email.focus();
    return;
  }

  if (!mensaje) {
    alert("Por favor, escribe un mensaje.");
    form.mensaje.focus();
    return;
  }

  // Aquí podrías agregar verificación de captcha si lo usas

  // Envío con EmailJS (descomenta si configuras)
  /*
  emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', form)
    .then(() => {
      alert("Mensaje enviado correctamente. ¡Gracias!");
      form.reset();
    }, (error) => {
      alert("Hubo un error al enviar el mensaje. Intenta nuevamente.");
      console.error(error);
    });
  */

  alert("Formulario válido. Aquí iría el envío real.");
  form.reset();
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// -------------------------
// Lightbox para galería
// -------------------------
function iniciarLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("closeBtn");

  if (!lightbox || !lightboxImg || !closeBtn) return;

  document.querySelectorAll(".grid-galeria img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
      lightboxImg.src = "";
    }
  });
}

// -------------------------
// Carrusel diplomas
// -------------------------
function inicializarCarrusel() {
  const track = document.querySelector('.carrusel-track');
  const prevButton = document.querySelector('.carrusel-btn.prev');
  const nextButton = document.querySelector('.carrusel-btn.next');

  if (!track || !prevButton || !nextButton) return;

  const items = Array.from(track.children);
  let currentIndex = 0;

  function getItemWidth() {
    return items[0].getBoundingClientRect().width + 20; // 20px de margen
  }

  function moveToIndex(index) {
    if (index < 0) index = 0;
    if (index > items.length - 1) index = items.length - 1;
    currentIndex = index;
    track.style.transform = `translateX(${-getItemWidth() * currentIndex}px)`;
    updateButtons();
  }

  function updateButtons() {
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === items.length - 1;
    prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';
    nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
  }

  prevButton.addEventListener('click', () => {
    moveToIndex(currentIndex - 1);
    resetAutoSlide();
  });

  nextButton.addEventListener('click', () => {
    moveToIndex(currentIndex + 1);
    resetAutoSlide();
  });

  window.addEventListener('resize', () => moveToIndex(currentIndex));
  moveToIndex(0);

  // ----- Auto-slide -----
  let autoSlideInterval = setInterval(nextSlide, 5000);

  function nextSlide() {
    if (currentIndex < items.length - 1) {
      moveToIndex(currentIndex + 1);
    } else {
      moveToIndex(0);
    }
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  // Pausar al pasar el mouse
  track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  track.addEventListener('mouseleave', () => resetAutoSlide());

    // ----- Swipe táctil -----
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;

    // Evita scroll lateral en móviles
    if (Math.abs(deltaX) > 10) e.preventDefault();
  }, { passive: false });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (deltaX > 50) {
      moveToIndex(currentIndex - 1); // Swipe derecha
    } else if (deltaX < -50) {
      moveToIndex(currentIndex + 1); // Swipe izquierda
    }

    resetAutoSlide();
    isDragging = false;
  });


  // Hacer clic en imágenes del carrusel para abrir en lightbox
  document.querySelectorAll('.carrusel-item img').forEach((img) => {
    img.addEventListener('click', () => {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightboxImg");
      if (!lightbox || !lightboxImg) return;

      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });


}

inicializarCarrusel();

