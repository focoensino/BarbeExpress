// Page/Buscar/buscar.js

function iniciarPaginaDeBusca() {
  const inputBusca =
    document.querySelector(".buscBarb");

  const botaoPesquisa =
    document.querySelector(".btnPesquisa");

  const tituloResultados =
    document.getElementById(
      "titulo-resultados"
    );

  const containerResultados =
    document.getElementById(
      "cardsResultadoBusca"
    );

  const mensagemBusca =
    document.getElementById(
      "mensagem-busca"
    );

  /*
   * O input pode ainda não existir caso
   * seja carregado como componente.
   */
  if (!inputBusca || !containerResultados) {
    return;
  }

  if (
    inputBusca.dataset.paginaBuscaInicializada ===
    "true"
  ) {
    return;
  }

  inputBusca.dataset.paginaBuscaInicializada =
    "true";

  let temporizador;
  let numeroDaPesquisa = 0;

  function mostrarMensagem(
    texto,
    erro = false
  ) {
    if (!mensagemBusca) return;

    mensagemBusca.textContent = texto;
    mensagemBusca.hidden = texto === "";
    mensagemBusca.classList.toggle(
      "erro",
      erro
    );
  }

  function limparResultados() {
    containerResultados.innerHTML = "";
  }

  function escaparHTML(valor) {
    const elemento =
      document.createElement("div");

    elemento.textContent = valor ?? "";

    return elemento.innerHTML;
  }

  function montarEndereco(barbearia) {
    const partes = [
      barbearia.endereco,
      barbearia.numero,
      barbearia.bairro,
      barbearia.cidade
    ].filter(Boolean);

    return partes.length
      ? partes.join(", ")
      : "Endereço não informado";
  }

  function renderizarResultados(
    barbearias
  ) {
    limparResultados();

    barbearias.forEach((barbearia) => {
      const card =
        document.createElement("article");

      card.className = "card-resultados";

      const endereco =
        montarEndereco(barbearia);

      const avaliacao = Number(
        barbearia.avaliacao_media || 0
      ).toFixed(1);

      card.innerHTML = `
        <div class="imagem-resultado">
          <img
            class="foto-barbearia-resultado"
            alt=""
          />
        </div>

        <div class="conteudo-resultado">
          <div class="topo-card-resultado">
            <h3 class="nome-do-card">
              ${escaparHTML(
                barbearia.nome || "Barbearia"
              )}
            </h3>

            <span class="avaliacao-card">
              ★ ${escaparHTML(avaliacao)}
            </span>
          </div>

          <p class="informcao-do-card">
            ${escaparHTML(endereco)}
          </p>

          <button
            type="button"
            class="botao-reservar"
          >
            Reservar
          </button>
        </div>
      `;

      const imagem = card.querySelector(
        ".foto-barbearia-resultado"
      );

const fotoUrl = barbearia.foto_perfil?.trim();

if (fotoUrl) {
  imagem.src = fotoUrl;

  imagem.addEventListener(
    "error",
    () => {
      imagem.remove();

      const containerImagem = card.querySelector(
        ".imagem-resultado"
      );

      if (containerImagem) {
        containerImagem.classList.add("sem-foto");
        containerImagem.innerHTML = `
          <span>
            ${escaparHTML(
              barbearia.nome
                ?.charAt(0)
                .toUpperCase() || "B"
            )}
          </span>
        `;
      }
    },
    { once: true }
  );
} else {
  imagem.remove();

  const containerImagem = card.querySelector(
    ".imagem-resultado"
  );

  if (containerImagem) {
    containerImagem.classList.add("sem-foto");

    containerImagem.innerHTML = `
      <span>
        ${escaparHTML(
          barbearia.nome
            ?.charAt(0)
            .toUpperCase() || "B"
        )}
      </span>
    `;
  }
}
      const botaoReservar =
        card.querySelector(
          ".botao-reservar"
        );

      botaoReservar.addEventListener(
        "click",
        () => {
          abrirBarbearia(barbearia);
        }
      );

      containerResultados.appendChild(card);
    });
  }

  function abrirBarbearia(barbearia) {
    if (!barbearia.id) {
      console.error(
        "Essa barbearia não possui ID."
      );
      return;
    }

    localStorage.setItem(
      "barbeariaSelecionada",
      JSON.stringify(barbearia)
    );

    const paginaBarbearia = new URL(
      "../Barbearia/barbearia.html",
      window.location.href
    );

    paginaBarbearia.searchParams.set(
      "id",
      barbearia.id
    );

    window.location.href =
      paginaBarbearia.href;
  }

  function atualizarURL(termo) {
    const url = new URL(
      window.location.href
    );

    if (termo) {
      url.searchParams.set(
        "pesquisa",
        termo
      );
    } else {
      url.searchParams.delete(
        "pesquisa"
      );
    }

    window.history.replaceState(
      {},
      "",
      url
    );
  }

  async function realizarPesquisaNoBanco(
    termo
  ) {
    const termoLimpo = termo.trim();

    atualizarURL(termoLimpo);

    if (!termoLimpo) {
      numeroDaPesquisa++;

      limparResultados();
      mostrarMensagem("");

      if (tituloResultados) {
        tituloResultados.textContent =
          "Digite para buscar barbearias";
      }

      return;
    }

    const supabaseClient =
      window.supabaseClient;

    if (!supabaseClient) {
      console.error(
        "❌ supabaseClient não encontrado."
      );

      if (tituloResultados) {
        tituloResultados.textContent =
          "Não foi possível carregar a pesquisa";
      }

      mostrarMensagem(
        "Erro ao conectar com o banco de dados.",
        true
      );

      return;
    }

    const pesquisaAtual =
      ++numeroDaPesquisa;

    if (tituloResultados) {
      tituloResultados.textContent =
        `Buscando por "${termoLimpo}"...`;
    }

    mostrarMensagem(
      "Buscando barbearias..."
    );

    try {
      /*
       * Evita que % e _ sejam tratados
       * como curingas digitados pelo usuário.
       */
      const termoSeguro =
        termoLimpo.replace(/[%_]/g, "");

      const { data, error } =
        await supabaseClient
          .from("barbearias")
          .select(`
            id,
            nome,
            endereco,
            numero,
            bairro,
            cidade,
            foto_perfil,
            avaliacao_media,
            ativo
          `)
          .eq("ativo", true)
          .ilike(
            "nome",
            `%${termoSeguro}%`
          )
          .order("nome", {
            ascending: true
          })
          .limit(30);

      /*
       * Impede que uma pesquisa antiga
       * substitua uma pesquisa mais recente.
       */
      if (
        pesquisaAtual !== numeroDaPesquisa
      ) {
        return;
      }

      if (error) {
        throw error;
      }

      const barbearias = data || [];

      if (tituloResultados) {
        tituloResultados.textContent =
          `Resultados para "${termoLimpo}"`;
      }

      if (barbearias.length === 0) {
        limparResultados();

        mostrarMensagem(
          `Nenhuma barbearia encontrada para "${termoLimpo}".`
        );

        return;
      }

      mostrarMensagem("");
      renderizarResultados(barbearias);

      console.log(
        `✅ ${barbearias.length} barbearias encontradas.`
      );
    } catch (erro) {
      console.error(
        "Erro na pesquisa:",
        erro
      );

      limparResultados();

      if (tituloResultados) {
        tituloResultados.textContent =
          "Erro ao buscar barbearias";
      }

      mostrarMensagem(
        "Não foi possível realizar a pesquisa.",
        true
      );
    }
  }

  function agendarPesquisa() {
    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      realizarPesquisaNoBanco(
        inputBusca.value
      );
    }, 300);
  }

  const parametros =
    new URLSearchParams(
      window.location.search
    );

  const pesquisaInicial =
    parametros.get("pesquisa") || "";

  inputBusca.value = pesquisaInicial;
  inputBusca.focus();

  const tamanho =
    inputBusca.value.length;

  inputBusca.setSelectionRange(
    tamanho,
    tamanho
  );

  if (pesquisaInicial) {
    realizarPesquisaNoBanco(
      pesquisaInicial
    );
  }

  inputBusca.addEventListener(
    "input",
    agendarPesquisa
  );

  botaoPesquisa?.addEventListener(
    "click",
    () => {
      clearTimeout(temporizador);

      realizarPesquisaNoBanco(
        inputBusca.value
      );
    }
  );

  inputBusca.addEventListener(
    "keydown",
    (evento) => {
      if (evento.key === "Enter") {
        evento.preventDefault();

        clearTimeout(temporizador);

        realizarPesquisaNoBanco(
          inputBusca.value
        );
      }
    }
  );
}

function renderizarResultados(barbearias) {
  limparResultados();

  barbearias.forEach((barbearia) => {
    const card = document.createElement("article");
    card.className = "card-resultados";

    const endereco = montarEndereco(barbearia);
    const avaliacao = Number(
      barbearia.avaliacao_media || 5
    ).toFixed(1).replace(".", ",");

    const fotoUrl = barbearia.foto_perfil?.trim();
    const inicial = (barbearia.nome || "B")
      .charAt(0)
      .toUpperCase();

    card.innerHTML = `
      <div class="imagem-resultado ${fotoUrl ? "" : "sem-foto"}">
        ${
          fotoUrl
            ? `
              <img
                class="foto-barbearia-resultado"
                src="${escaparHTML(fotoUrl)}"
                alt="Foto da ${escaparHTML(barbearia.nome || "barbearia")}"
              />
            `
            : `
              <span>${escaparHTML(inicial)}</span>
            `
        }

        <div class="avaliacao-card">
          ★ ${escaparHTML(avaliacao)}
        </div>
      </div>

      <div class="conteudo-resultado">
        <h3 class="nome-do-card">
          ${escaparHTML(barbearia.nome || "Barbearia")}
        </h3>

        <p class="informcao-do-card">
          ${escaparHTML(endereco)}
        </p>

        <button
          type="button"
          class="botao-reservar"
        >
          Reservar
        </button>
      </div>
    `;

    const imagem = card.querySelector(".foto-barbearia-resultado");

    imagem?.addEventListener(
      "error",
      () => {
        const containerImagem = card.querySelector(".imagem-resultado");
        if (!containerImagem) return;

        containerImagem.classList.add("sem-foto");
        containerImagem.innerHTML = `
          <span>${escaparHTML(inicial)}</span>
          <div class="avaliacao-card">★ ${escaparHTML(avaliacao)}</div>
        `;
      },
      { once: true }
    );

    const botaoReservar = card.querySelector(".botao-reservar");
    botaoReservar?.addEventListener("click", () => abrirBarbearia(barbearia));

    containerResultados.appendChild(card);
  });
}

document.addEventListener(
  "DOMContentLoaded",
  iniciarPaginaDeBusca
);

document.addEventListener(
  "components:loaded",
  iniciarPaginaDeBusca
);

if (document.readyState !== "loading") {
  iniciarPaginaDeBusca();
}