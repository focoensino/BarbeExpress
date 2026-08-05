// ============ BUSCAR DO BANCO ============

async function carregarBarbearias() {
  const cliente = window.supabaseClient;

  if (!cliente) {
    console.error(
      "❌ Supabase não inicializado."
    );
    return;
  }

  try {
    const { data, error } =
      await cliente
        .from("barbearias")
        .select("*")
        .eq("ativo", true);

    if (error) {
      throw error;
    }

    const barbearias =
      Array.isArray(data) ? data : [];

    console.log(
      "✅ Total de barbearias carregadas:",
      barbearias.length
    );

    barbearias.forEach((barbearia) => {
      console.log(
        `📋 ${barbearia.nome}:`,
        {
          recomendada:
            barbearia.recomendada,
          popular:
            barbearia.popular,
          express_ativo:
            barbearia.express_ativo
        }
      );
    });

    const recomendados =
      barbearias.filter(
        (barbearia) =>
          barbearia.recomendada === true
      );

    const populares =
      barbearias.filter(
        (barbearia) =>
          barbearia.popular === true
      );

    const maisVisitados =
      [...barbearias]
        .sort(
          (a, b) =>
            Number(
              b.total_avaliacoes || 0
            ) -
            Number(
              a.total_avaliacoes || 0
            )
        )
        .slice(0, 5);

    console.log(
      "📊 Recomendados:",
      recomendados.length
    );

    console.log(
      "📊 Populares:",
      populares.length
    );

    console.log(
      "📊 Mais visitados:",
      maisVisitados.length
    );

    renderizarCards(
      recomendados,
      "cardsRecomendados",
      "RECO1"
    );

    renderizarCards(
      populares,
      "cardsPopulares",
      "POPU1"
    );

    renderizarCards(
      maisVisitados,
      "cardsMaisVisitados",
      "MAVI1"
    );
  } catch (erro) {
    console.error(
      "❌ Erro ao carregar barbearias:",
      erro
    );
  }
}

function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function criarCard(
  barbearia,
  classeCard
) {
  const nota =
    barbearia.avaliacao_media
      ? Number(
          barbearia.avaliacao_media
        ).toFixed(1)
      : "5.0";

  const fotoUrl =
    barbearia.foto_perfil ||
    "./img/default-barber.jpg";

  const nome =
    escaparHTML(barbearia.nome);

  const endereco =
    escaparHTML(
      barbearia.endereco
    );

  const numero =
    escaparHTML(
      barbearia.numero
    );

  const cidade =
    escaparHTML(
      barbearia.cidade
    );

  const id =
    escaparHTML(barbearia.id);

  return `
    <div class="${classeCard}">
      <div
        class="foto-card"
        style="background-image: url('${fotoUrl}')"
      >
        <div class="nota50">
          <img
            src="./img/icon/estrela.svg"
            alt="Avaliação"
          />

          <h5 class="H5nota">
            ${nota}
          </h5>
        </div>
      </div>

      <div class="info-card">
        <h2 class="POPU01">
          ${nome}
        </h2>

        <h3 class="LOCAL01">
          ${endereco}, ${numero}, ${cidade}
        </h3>

        <button
          type="button"
          class="reservar-btn"
          data-barbearia-id="${id}"
        >
          Reservar
        </button>
      </div>
    </div>
  `;
}

function renderizarCards(
  barbearias,
  containerId,
  classeCard
) {
  const container =
    document.getElementById(
      containerId
    );

  if (!container) {
    console.error(
      `Container #${containerId} não encontrado.`
    );
    return;
  }

  if (!barbearias.length) {
    container.innerHTML = `
      <p class="lista-vazia">
        Nenhuma barbearia encontrada.
      </p>
    `;
    return;
  }

  container.innerHTML =
    barbearias
      .map((barbearia) =>
        criarCard(
          barbearia,
          classeCard
        )
      )
      .join("");
}

document.addEventListener(
  "click",
  (evento) => {
    const botao =
      evento.target.closest(
        ".reservar-btn"
      );

    if (!botao) {
      return;
    }

    const barbeariaId =
      botao.dataset.barbeariaId;

    if (
      typeof window.btnReserva ===
      "function"
    ) {
      window.btnReserva(
        barbeariaId
      );
      return;
    }

    console.error(
      "A função btnReserva não foi encontrada."
    );
  }
);

let carregamentoBarbeariasIniciado = false;

async function iniciarCarregamentoBarbearias() {
  if (carregamentoBarbeariasIniciado) {
    return;
  }

  carregamentoBarbeariasIniciado = true;

  await carregarBarbearias();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    iniciarCarregamentoBarbearias,
    {
      once: true
    }
  );
} else {
  iniciarCarregamentoBarbearias();
}