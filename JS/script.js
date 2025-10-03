// GERENCIAMENTO DE FOCO DO LEITOR DE TELA

let focusableElements = [];
let currentModal = null;

function trapFocus(modalElement) {
    currentModal = modalElement;
    focusableElements = Array.from(
        modalElement.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => !el.disabled && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Move o foco para o primeiro elemento do modal
    firstElement.focus();

    function handleKeyDown(event) {
        if (event.key === 'Tab') {
            const isShiftPressed = event.shiftKey;

            if (isShiftPressed && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!isShiftPressed && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Guardamos a função para poder removê-la depois
    currentModal.removeFocusTrap = () => {
        document.removeEventListener('keydown', handleKeyDown);
        currentModal = null;
    };
}

function removeTrapFocus() {
    if (currentModal && currentModal.removeFocusTrap) {
        currentModal.removeFocusTrap();
    }
}


// --- NAVBAR ---
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

if (menuButton && sideMenu && closeMenu) {
  menuButton.addEventListener("click", () => {
    sideMenu.classList.remove("-translate-x-full");
    trapFocus(sideMenu);
  });

  closeMenu.addEventListener("click", () => {
    sideMenu.classList.add("-translate-x-full");
    removeTrapFocus();
  });
}

// --- POPUP (Botão flutuante) ---
const openPopup = document.getElementById("openPopup");
const closePopup = document.getElementById("closePopup");
const popupModal = document.getElementById("popupModal");

if (openPopup && closePopup && popupModal) {
  openPopup.addEventListener("click", () => {
    popupModal.classList.remove("hidden");
    trapFocus(popupModal);
  });

  closePopup.addEventListener("click", () => {
    popupModal.classList.add("hidden");
    removeTrapFocus();
  });

  // Fecha ao clicar fora do modal
  popupModal.addEventListener("click", (e) => {
    if (e.target === popupModal) {
      popupModal.classList.add("hidden");
    }
  });
}

// --- LOGIN / LOGOUT ---
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const loginLink = document.querySelector('a[href="login.html"]');

  if (usuarioLogado && usuarioLogado.logado) {
    // Troca "Login" por "Sair"
    if (loginLink) {
      loginLink.textContent = "Sair";
      loginLink.href = "#";

      loginLink.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
      });
    }
  }
});