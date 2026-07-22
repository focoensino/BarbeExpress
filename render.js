async function carregarComponentes() {
  const componentes =
    document.querySelectorAll(
      "[data-component]"
    );

  if (!componentes.length) {
    document.dispatchEvent(
      new CustomEvent("components:loaded")
    );

    return;
  }

  await Promise.all(
    Array.from(componentes).map(
      async (elemento) => {
        const nomeComponente =
          elemento.dataset.component;

        try {
          const resposta = await fetch(
            `/Components/${nomeComponente}.html`
          );

          if (!resposta.ok) {
            throw new Error(
              `Erro ${resposta.status} ao carregar ${nomeComponente}`
            );
          }

          elemento.innerHTML =
            await resposta.text();
        } catch (erro) {
          console.error(
            `Erro ao carregar o componente ${nomeComponente}:`,
            erro
          );

          elemento.innerHTML = `
            <p style="
              color: white;
              padding: 20px;
            ">
              Não foi possível carregar o componente.
            </p>
          `;
        }
      }
    )
  );

  document.dispatchEvent(
    new CustomEvent("components:loaded")
  );
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    carregarComponentes,
    { once: true }
  );
} else {
  carregarComponentes();
}