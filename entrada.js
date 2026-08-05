const ROTAS = {
  portalCliente: "./index.html",

  /*
   * Troque esta rota pelo caminho real
   * do painel da barbearia.
   */
  painelBarbearia:
    "./Page/Barbeiro/barbeiro.html"
};

function redirecionarPara(rota) {
  if (!rota) {
    console.error(
      "Rota não configurada."
    );

    return;
  }

  window.location.href = rota;
}

function configurarBotoes() {
  const botaoAcessar =
    document.getElementById(
      "access-button"
    );

  const botaoCliente =
    document.getElementById(
      "client-portal-button"
    );

  const botaoBarbearia =
    document.getElementById(
      "barbershop-panel-button"
    );

  const botaoSecaoCliente =
    document.getElementById(
      "client-section-button"
    );

  const botaoSecaoBarbearia =
    document.getElementById(
      "barbershop-section-button"
    );

  botaoAcessar?.addEventListener(
    "click",
    () => {
      document
        .getElementById("cliente")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }
  );

  botaoCliente?.addEventListener(
    "click",
    () => {
      redirecionarPara(
        ROTAS.portalCliente
      );
    }
  );

  botaoSecaoCliente?.addEventListener(
    "click",
    () => {
      redirecionarPara(
        ROTAS.portalCliente
      );
    }
  );

  botaoBarbearia?.addEventListener(
    "click",
    () => {
      redirecionarPara(
        ROTAS.painelBarbearia
      );
    }
  );

  botaoSecaoBarbearia?.addEventListener(
    "click",
    () => {
      redirecionarPara(
        ROTAS.painelBarbearia
      );
    }
  );
}

function configurarMenuMobile() {
  const botao =
    document.getElementById(
      "mobile-menu-button"
    );

  const menu =
    document.querySelector(
      ".navigation"
    );

  if (!botao || !menu) {
    return;
  }

  botao.addEventListener(
    "click",
    () => {
      const aberto =
        menu.classList.toggle(
          "active"
        );

      botao.setAttribute(
        "aria-expanded",
        String(aberto)
      );
    }
  );

  menu
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener(
        "click",
        () => {
          menu.classList.remove(
            "active"
          );

          botao.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    });

  document.addEventListener(
    "click",
    (evento) => {
      if (
        menu.contains(evento.target) ||
        botao.contains(evento.target)
      ) {
        return;
      }

      menu.classList.remove("active");

      botao.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  );
}

function configurarParallax() {
  const elementos =
    document.querySelectorAll(
      "[data-parallax]"
    );

  if (
    !elementos.length ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  window.addEventListener(
    "mousemove",
    (evento) => {
      const centroX =
        window.innerWidth / 2;

      const centroY =
        window.innerHeight / 2;

      const movimentoX =
        (evento.clientX - centroX) /
        centroX;

      const movimentoY =
        (evento.clientY - centroY) /
        centroY;

      elementos.forEach(
        (elemento) => {
          const intensidade =
            Number(
              elemento.dataset
                .parallax || 0
            );

          const deslocamentoX =
            movimentoX *
            12 *
            intensidade;

          const deslocamentoY =
            movimentoY *
            12 *
            intensidade;

          elemento.style.transform = `
            translate3d(
              ${deslocamentoX}px,
              ${deslocamentoY}px,
              0
            )
          `;
        }
      );
    },
    {
      passive: true
    }
  );
}

function configurarAno() {
  const elemento =
    document.getElementById(
      "current-year"
    );

  if (elemento) {
    elemento.textContent =
      new Date().getFullYear();
  }
}

function iniciar() {
  configurarBotoes();
  configurarMenuMobile();
  configurarParallax();
  configurarAno();
}

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    iniciar,
    {
      once: true
    }
  );
} else {
  iniciar();
}