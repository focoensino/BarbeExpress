(() => {
  "use strict";

  const STORAGE_AGENDAMENTOS =
    "barberexpress_agendamentos_barbearia";

  const VALORES_SERVICOS = {
    "Corte tradicional": 45,
    "Corte + Barba": 75,
    Barba: 35,
    "Corte degradê": 55
  };

  const agendamentosPadrao = [
    {
      id: gerarId(),
      cliente: "Rafael Silva",
      servico: "Corte tradicional",
      horario: "09:00",
      status: "confirmado"
    },
    {
      id: gerarId(),
      cliente: "Camila Souza",
      servico: "Corte + Barba",
      horario: "10:30",
      status: "pendente"
    },
    {
      id: gerarId(),
      cliente: "João Santos",
      servico: "Barba",
      horario: "13:00",
      status: "confirmado"
    },
    {
      id: gerarId(),
      cliente: "Carlos Lima",
      servico: "Corte degradê",
      horario: "15:30",
      status: "confirmado"
    }
  ];

  let agendamentos = [];
  let ultimoElementoFocado = null;

  function selecionar(seletor, elemento = document) {
    return elemento.querySelector(seletor);
  }

  function selecionarTodos(
    seletor,
    elemento = document
  ) {
    return Array.from(
      elemento.querySelectorAll(seletor)
    );
  }

  function gerarId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

    return (
      "agendamento-" +
      Date.now() +
      "-" +
      Math.random()
        .toString(16)
        .slice(2)
    );
  }

  function escaparHTML(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function obterIniciais(nome) {
    const partes = String(
      nome || "Usuário"
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return (
      partes
        .map((parte) =>
          parte.charAt(0).toUpperCase()
        )
        .join("") || "U"
    );
  }

  function formatarMoeda(valor) {
    return new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    ).format(Number(valor) || 0);
  }

  function carregarAgendamentos() {
    try {
      const dados =
        localStorage.getItem(
          STORAGE_AGENDAMENTOS
        );

      if (dados) {
        const lista = JSON.parse(dados);

        if (Array.isArray(lista)) {
          agendamentos = lista;
          return;
        }
      }
    } catch (erro) {
      console.warn(
        "Não foi possível recuperar os agendamentos:",
        erro
      );
    }

    agendamentos = [
      ...agendamentosPadrao
    ];

    salvarAgendamentos();
  }

  function salvarAgendamentos() {
    try {
      localStorage.setItem(
        STORAGE_AGENDAMENTOS,
        JSON.stringify(
          agendamentos
        )
      );
    } catch (erro) {
      console.warn(
        "Não foi possível salvar os agendamentos:",
        erro
      );
    }
  }

  function ordenarAgendamentos() {
    return [...agendamentos].sort(
      (a, b) =>
        String(a.horario)
          .localeCompare(
            String(b.horario)
          )
    );
  }

  function traduzirStatus(status) {
    const nomes = {
      confirmado: "Confirmado",
      pendente: "Pendente",
      concluido: "Concluído"
    };

    return nomes[status] || "Pendente";
  }

  function criarAgendamentoHTML(
    agendamento
  ) {
    const id =
      escaparHTML(
        agendamento.id
      );

    const cliente =
      escaparHTML(
        agendamento.cliente
      );

    const servico =
      escaparHTML(
        agendamento.servico
      );

    const horario =
      escaparHTML(
        agendamento.horario
      );

    const status =
      escaparHTML(
        agendamento.status
      );

    return `
      <article
        class="agendamento-item"
        data-agendamento-id="${id}"
      >
        <div class="agendamento-horario">
          <strong>${horario}</strong>
          <small>Hoje</small>
        </div>

        <span
          class="agendamento-avatar"
          aria-hidden="true"
        >
          ${obterIniciais(cliente)}
        </span>

        <div class="agendamento-dados">
          <strong>${cliente}</strong>
          <small>${servico}</small>
        </div>

        <button
          type="button"
          class="
            agendamento-status
            status-${status}
          "
          data-alterar-status
          title="Clique para alterar o status"
        >
          ${traduzirStatus(status)}
        </button>

        <button
          type="button"
          class="agendamento-remover"
          data-remover-agendamento
          title="Excluir agendamento"
          aria-label="Excluir agendamento de ${cliente}"
        >
          <i
            class="fa-solid fa-trash-can"
          ></i>
        </button>
      </article>
    `;
  }

  function renderizarAgendamentos() {
    const lista =
      selecionar(
        "#listaAgendamentos"
      );

    if (!lista) {
      return;
    }

    const agendamentosOrdenados =
      ordenarAgendamentos();

    if (
      agendamentosOrdenados.length === 0
    ) {
      lista.innerHTML = `
        <div class="estado-vazio">
          <i
            class="fa-regular fa-calendar-xmark"
          ></i>

          <strong>
            Nenhum agendamento para hoje
          </strong>

          <span>
            Crie um novo agendamento
            para começar.
          </span>
        </div>
      `;
    } else {
      lista.innerHTML =
        agendamentosOrdenados
          .slice(0, 6)
          .map(
            criarAgendamentoHTML
          )
          .join("");
    }

    atualizarMetricas();
    atualizarProximoAgendamento();
  }

  function atualizarMetricas() {
    const totalElemento =
      selecionar(
        "#totalAgendamentos"
      );

    const faturamentoElemento =
      selecionar(
        "#faturamentoHoje"
      );

    if (totalElemento) {
      totalElemento.textContent =
        String(
          agendamentos.length
        );
    }

    const faturamento =
      agendamentos
        .filter(
          (agendamento) =>
            agendamento.status !==
            "pendente"
        )
        .reduce(
          (
            total,
            agendamento
          ) => {
            return (
              total +
              (VALORES_SERVICOS[
                agendamento.servico
              ] || 0)
            );
          },
          0
        );

    if (faturamentoElemento) {
      faturamentoElemento.textContent =
        formatarMoeda(
          faturamento
        );
    }
  }

  function atualizarProximoAgendamento() {
    const card =
      selecionar(
        ".proximo-agendamento"
      );

    if (!card) {
      return;
    }

    const agora = new Date();

    const minutosAtuais =
      agora.getHours() * 60 +
      agora.getMinutes();

    const proximos =
      ordenarAgendamentos()
        .filter(
          (agendamento) => {
            if (
              agendamento.status ===
              "concluido"
            ) {
              return false;
            }

            const [
              hora,
              minuto
            ] =
              agendamento.horario
                .split(":")
                .map(Number);

            const minutos =
              hora * 60 + minuto;

            return (
              minutos >=
              minutosAtuais
            );
          }
        );

    const proximo =
      proximos[0] ||
      ordenarAgendamentos()
        .find(
          (agendamento) =>
            agendamento.status !==
            "concluido"
        );

    const dataElemento =
      selecionar(
        ".data-proximo",
        card
      );

    const horarioElemento =
      selecionar(
        ".proximo-detalhes > span",
        card
      );

    const clienteElemento =
      selecionar(
        ".proximo-detalhes div strong",
        card
      );

    const servicoElemento =
      selecionar(
        ".proximo-detalhes div small",
        card
      );

    if (!proximo) {
      if (dataElemento) {
        dataElemento.textContent =
          "Nenhum agendamento próximo";
      }

      if (horarioElemento) {
        horarioElemento.innerHTML = `
          <i
            class="fa-regular fa-clock"
          ></i>
          --:--
        `;
      }

      if (clienteElemento) {
        clienteElemento.textContent =
          "Agenda livre";
      }

      if (servicoElemento) {
        servicoElemento.textContent =
          "Cadastre um novo horário";
      }

      return;
    }

    if (dataElemento) {
      dataElemento.textContent =
        "Hoje";
    }

    if (horarioElemento) {
      horarioElemento.innerHTML = `
        <i
          class="fa-regular fa-clock"
        ></i>

        ${escaparHTML(
          proximo.horario
        )}
      `;
    }

    if (clienteElemento) {
      clienteElemento.textContent =
        proximo.cliente;
    }

    if (servicoElemento) {
      servicoElemento.textContent =
        proximo.servico;
    }
  }

  function abrirModalAgendamento() {
    const modal =
      selecionar(
        "#modalAgendamento"
      );

    if (!modal) {
      return;
    }

    ultimoElementoFocado =
      document.activeElement;

    modal.classList.add(
      "aberto"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    modal.style.display =
      "flex";

    document.body.classList.add(
      "modal-aberto"
    );

    definirHorarioInicial();

    window.setTimeout(
      () => {
        selecionar(
          "#clienteAgendamento"
        )?.focus();
      },
      50
    );
  }

  function fecharModalAgendamento() {
    const modal =
      selecionar(
        "#modalAgendamento"
      );

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "aberto"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    modal.style.display =
      "none";

    document.body.classList.remove(
      "modal-aberto"
    );

    ultimoElementoFocado
      ?.focus?.();
  }

  function definirHorarioInicial() {
    const campo =
      selecionar(
        "#horarioAgendamento"
      );

    if (
      !campo ||
      campo.value
    ) {
      return;
    }

    const agora = new Date();

    const minutos =
      agora.getMinutes();

    const minutosArredondados =
      Math.ceil(
        minutos / 30
      ) * 30;

    agora.setMinutes(
      minutosArredondados,
      0,
      0
    );

    campo.value = [
      String(
        agora.getHours()
      ).padStart(2, "0"),

      String(
        agora.getMinutes()
      ).padStart(2, "0")
    ].join(":");
  }

  function salvarNovoAgendamento(
    evento
  ) {
    evento.preventDefault();

    const cliente =
      selecionar(
        "#clienteAgendamento"
      )?.value.trim();

    const servico =
      selecionar(
        "#servicoAgendamento"
      )?.value;

    const horario =
      selecionar(
        "#horarioAgendamento"
      )?.value;

    const status =
      selecionar(
        "#statusAgendamento"
      )?.value;

    if (
      !cliente ||
      !servico ||
      !horario ||
      !status
    ) {
      mostrarToast(
        "Preencha todos os campos.",
        "erro"
      );

      return;
    }

    const horarioOcupado =
      agendamentos.some(
        (agendamento) =>
          agendamento.horario ===
            horario &&
          agendamento.status !==
            "concluido"
      );

    if (horarioOcupado) {
      mostrarToast(
        "Já existe um agendamento nesse horário.",
        "erro"
      );

      return;
    }

    agendamentos.push({
      id: gerarId(),
      cliente,
      servico,
      horario,
      status
    });

    salvarAgendamentos();
    renderizarAgendamentos();

    evento.currentTarget.reset();

    fecharModalAgendamento();

    mostrarToast(
      "Agendamento salvo com sucesso."
    );
  }

  function alterarStatusAgendamento(
    id
  ) {
    const agendamento =
      agendamentos.find(
        (item) =>
          item.id === id
      );

    if (!agendamento) {
      return;
    }

    const ordemStatus = [
      "pendente",
      "confirmado",
      "concluido"
    ];

    const indiceAtual =
      ordemStatus.indexOf(
        agendamento.status
      );

    const proximoIndice =
      (indiceAtual + 1) %
      ordemStatus.length;

    agendamento.status =
      ordemStatus[
        proximoIndice
      ];

    salvarAgendamentos();
    renderizarAgendamentos();

    mostrarToast(
      `Status alterado para ${
        traduzirStatus(
          agendamento.status
        )
      }.`
    );
  }

  function removerAgendamento(id) {
    const agendamento =
      agendamentos.find(
        (item) =>
          item.id === id
      );

    if (!agendamento) {
      return;
    }

    const confirmou =
      window.confirm(
        `Excluir o agendamento de ${agendamento.cliente} às ${agendamento.horario}?`
      );

    if (!confirmou) {
      return;
    }

    agendamentos =
      agendamentos.filter(
        (item) =>
          item.id !== id
      );

    salvarAgendamentos();
    renderizarAgendamentos();

    mostrarToast(
      "Agendamento excluído."
    );
  }

  function tratarCliqueAgendamento(
    evento
  ) {
    const item =
      evento.target.closest(
        "[data-agendamento-id]"
      );

    if (!item) {
      return;
    }

    const id =
      item.dataset
        .agendamentoId;

    const botaoStatus =
      evento.target.closest(
        "[data-alterar-status]"
      );

    const botaoRemover =
      evento.target.closest(
        "[data-remover-agendamento]"
      );

    if (botaoStatus) {
      alterarStatusAgendamento(
        id
      );

      return;
    }

    if (botaoRemover) {
      removerAgendamento(id);
    }
  }

  function mostrarToast(
    mensagem,
    tipo = "sucesso"
  ) {
    const toast =
      selecionar("#toast");

    if (!toast) {
      return;
    }

    window.clearTimeout(
      mostrarToast.timeout
    );

    toast.textContent =
      mensagem;

    toast.dataset.tipo =
      tipo;

    toast.classList.add(
      "visivel"
    );

    toast.style.opacity = "1";
    toast.style.visibility =
      "visible";

    toast.style.transform =
      "translateY(0)";

    mostrarToast.timeout =
      window.setTimeout(
        () => {
          toast.classList.remove(
            "visivel"
          );

          toast.style.opacity =
            "";

          toast.style.visibility =
            "";

          toast.style.transform =
            "";
        },
        3000
      );
  }

  function configurarModal() {
    const modal =
      selecionar(
        "#modalAgendamento"
      );

    if (!modal) {
      return;
    }

    modal.style.display =
      "none";

    selecionarTodos(
      "[data-fechar-modal]",
      modal
    ).forEach(
      (elemento) => {
        elemento.addEventListener(
          "click",
          fecharModalAgendamento
        );
      }
    );

    selecionar(
      "#formNovoAgendamento"
    )?.addEventListener(
      "submit",
      salvarNovoAgendamento
    );

    document.addEventListener(
      "keydown",
      (evento) => {
        if (
          evento.key ===
          "Escape"
        ) {
          fecharModalAgendamento();
          fecharMenusTopo();
        }
      }
    );
  }

  function criarMenusTopo() {
    const topoAcoes =
      selecionar(
        ".topo-acoes"
      );

    if (!topoAcoes) {
      return;
    }

    topoAcoes.style.position =
      "relative";

    if (
      !selecionar(
        "#menuNotificacoes"
      )
    ) {
      topoAcoes.insertAdjacentHTML(
        "beforeend",
        `
          <div
            class="menu-topo-flutuante"
            id="menuNotificacoes"
            hidden
          >
            <div class="menu-topo-titulo">
              <strong>
                Notificações
              </strong>

              <button
                type="button"
                id="marcarNotificacoesLidas"
              >
                Marcar como lidas
              </button>
            </div>

            <button
              class="notificacao-item"
              type="button"
            >
              <i
                class="fa-regular fa-calendar-check"
              ></i>

              <span>
                <strong>
                  Novo agendamento
                </strong>

                <small>
                  Há poucos minutos
                </small>
              </span>
            </button>

            <button
              class="notificacao-item"
              type="button"
            >
              <i
                class="fa-regular fa-star"
              ></i>

              <span>
                <strong>
                  Nova avaliação recebida
                </strong>

                <small>
                  Hoje
                </small>
              </span>
            </button>

            <button
              class="notificacao-item"
              type="button"
            >
              <i
                class="fa-solid fa-dollar-sign"
              ></i>

              <span>
                <strong>
                  Pagamento confirmado
                </strong>

                <small>
                  Hoje
                </small>
              </span>
            </button>
          </div>
        `
      );
    }

    if (
      !selecionar(
        "#menuPerfil"
      )
    ) {
      topoAcoes.insertAdjacentHTML(
        "beforeend",
        `
          <div
            class="
              menu-topo-flutuante
              menu-perfil-flutuante
            "
            id="menuPerfil"
            hidden
          >
            <button
              type="button"
              data-menu-perfil="conta"
            >
              <i
                class="fa-regular fa-user"
              ></i>

              Minha conta
            </button>

            <button
              type="button"
              data-menu-perfil="configuracoes"
            >
              <i
                class="fa-solid fa-gear"
              ></i>

              Configurações
            </button>

            <button
              type="button"
              class="botao-sair"
              data-menu-perfil="sair"
            >
              <i
                class="fa-solid fa-arrow-right-from-bracket"
              ></i>

              Sair
            </button>
          </div>
        `
      );
    }
  }

  function fecharMenusTopo() {
    const menuNotificacoes =
      selecionar(
        "#menuNotificacoes"
      );

    const menuPerfil =
      selecionar(
        "#menuPerfil"
      );

    if (menuNotificacoes) {
      menuNotificacoes.hidden =
        true;
    }

    if (menuPerfil) {
      menuPerfil.hidden =
        true;
    }

    selecionar(
      ".perfil"
    )?.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function alternarNotificacoes(
    evento
  ) {
    evento.stopPropagation();

    const menuNotificacoes =
      selecionar(
        "#menuNotificacoes"
      );

    const menuPerfil =
      selecionar(
        "#menuPerfil"
      );

    if (!menuNotificacoes) {
      return;
    }

    const abrir =
      menuNotificacoes.hidden;

    menuNotificacoes.hidden =
      !abrir;

    if (menuPerfil) {
      menuPerfil.hidden = true;
    }
  }

  function alternarMenuPerfil(
    evento
  ) {
    evento.stopPropagation();

    const menuPerfil =
      selecionar(
        "#menuPerfil"
      );

    const menuNotificacoes =
      selecionar(
        "#menuNotificacoes"
      );

    const botaoPerfil =
      selecionar(".perfil");

    if (!menuPerfil) {
      return;
    }

    const abrir =
      menuPerfil.hidden;

    menuPerfil.hidden =
      !abrir;

    if (menuNotificacoes) {
      menuNotificacoes.hidden =
        true;
    }

    botaoPerfil?.setAttribute(
      "aria-expanded",
      String(abrir)
    );
  }

  async function tratarMenuPerfil(
    evento
  ) {
    evento.stopPropagation();

    const botao =
      evento.target.closest(
        "[data-menu-perfil]"
      );

    if (!botao) {
      return;
    }

    const acao =
      botao.dataset
        .menuPerfil;

    if (acao === "sair") {
      try {
        if (
          window.supabaseClient
        ) {
          await window
            .supabaseClient
            .auth
            .signOut();
        }
      } catch (erro) {
        console.error(
          "Erro ao sair:",
          erro
        );
      }

      mostrarToast(
        "Sessão encerrada."
      );

      window.setTimeout(
        () => {
          window.location.href =
            "../../index.html";
        },
        600
      );

      return;
    }

    if (
      acao ===
      "configuracoes"
    ) {
      selecionarTodos(
        ".menu-item"
      ).forEach(
        (item) =>
          item.classList.remove(
            "ativo"
          )
      );

      const configuracoes =
        selecionarTodos(
          ".menu-item"
        ).find(
          (item) =>
            item.textContent
              .trim()
              .includes(
                "Configurações"
              )
        );

      configuracoes
        ?.classList.add(
          "ativo"
        );

      mostrarToast(
        "Configurações selecionadas.",
        "info"
      );
    } else {
      mostrarToast(
        "Minha conta será aberta aqui.",
        "info"
      );
    }

    fecharMenusTopo();
  }

  function marcarNotificacoesLidas() {
    const contador =
      selecionar(
        ".notificacao-contador"
      );

    if (contador) {
      contador.textContent =
        "0";

      contador.hidden = true;
    }

    mostrarToast(
      "Notificações marcadas como lidas."
    );

    fecharMenusTopo();
  }

  function configurarTopo() {
    criarMenusTopo();

    const botaoNotificacoes =
      selecionar(
        '.botao-icone[aria-label="Notificações"]'
      );

    const botaoPerfil =
      selecionar(".perfil");

    botaoNotificacoes
      ?.addEventListener(
        "click",
        alternarNotificacoes
      );

    botaoPerfil?.setAttribute(
      "aria-expanded",
      "false"
    );

    botaoPerfil
      ?.addEventListener(
        "click",
        alternarMenuPerfil
      );

    selecionar(
      "#menuNotificacoes"
    )?.addEventListener(
      "click",
      (evento) =>
        evento.stopPropagation()
    );

    selecionar(
      "#menuPerfil"
    )?.addEventListener(
      "click",
      tratarMenuPerfil
    );

    selecionar(
      "#marcarNotificacoesLidas"
    )?.addEventListener(
      "click",
      marcarNotificacoesLidas
    );

    document.addEventListener(
      "click",
      fecharMenusTopo
    );
  }

  function configurarMenuLateral() {
    selecionarTodos(
      ".menu-item"
    ).forEach(
      (item) => {
        item.addEventListener(
          "click",
          (evento) => {
            evento.preventDefault();

            selecionarTodos(
              ".menu-item"
            ).forEach(
              (link) => {
                link.classList.remove(
                  "ativo"
                );
              }
            );

            item.classList.add(
              "ativo"
            );

            const nome =
              selecionar(
                "span",
                item
              )?.textContent
                .trim();

            if (
              nome !== "Resumo"
            ) {
              mostrarToast(
                `${nome}: conecte aqui a página correspondente.`,
                "info"
              );
            }
          }
        );
      }
    );
  }

  function configurarAcoesRapidas() {
    selecionar(
      "#btnNovoAgendamento"
    )?.addEventListener(
      "click",
      abrirModalAgendamento
    );

    selecionarTodos(
      "[data-acao]"
    ).forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          () => {
            const acao =
              botao.dataset.acao;

            if (
              acao ===
              "agendamento"
            ) {
              abrirModalAgendamento();
              return;
            }

            if (
              acao === "cliente"
            ) {
              mostrarToast(
                "Cadastro de cliente será aberto aqui.",
                "info"
              );

              return;
            }

            if (
              acao === "servico"
            ) {
              mostrarToast(
                "Cadastro de serviço será aberto aqui.",
                "info"
              );
            }
          }
        );
      }
    );
  }

  function configurarBotoesCards() {
    selecionarTodos(
      ".painel-titulo button, .link-card"
    ).forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          () => {
            const texto =
              botao.textContent
                .trim()
                .toLowerCase();

            if (
              texto.includes(
                "agendamento"
              ) ||
              texto === "ver todos"
            ) {
              mostrarToast(
                `Existem ${agendamentos.length} agendamento(s) cadastrado(s).`,
                "info"
              );

              return;
            }

            if (
              texto.includes(
                "relatório"
              )
            ) {
              mostrarToast(
                "O relatório financeiro será aberto aqui.",
                "info"
              );

              return;
            }

            if (
              texto.includes(
                "avalia"
              )
            ) {
              mostrarToast(
                "As avaliações serão abertas aqui.",
                "info"
              );

              return;
            }

            mostrarToast(
              "Esta função será conectada aqui.",
              "info"
            );
          }
        );
      }
    );

    selecionar(
      ".plano-card button"
    )?.addEventListener(
      "click",
      () => {
        mostrarToast(
          "A página de planos será aberta aqui.",
          "info"
        );
      }
    );

    selecionar(
      ".marca"
    )?.addEventListener(
      "click",
      (evento) => {
        evento.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  function animarGrafico() {
    const linha =
      selecionar(
        ".grafico-linha"
      );

    if (
      !linha ||
      typeof linha
        .getTotalLength !==
        "function"
    ) {
      return;
    }

    const tamanho =
      linha.getTotalLength();

    linha.style.strokeDasharray =
      String(tamanho);

    linha.style.strokeDashoffset =
      String(tamanho);

    window.requestAnimationFrame(
      () => {
        linha.style.transition =
          "stroke-dashoffset 1.2s ease";

        linha.style.strokeDashoffset =
          "0";
      }
    );
  }

  async function carregarPerfilSupabase() {
    const cliente =
      window.supabaseClient;

    if (!cliente) {
      return;
    }

    try {
      const {
        data: { session }
      } =
        await cliente.auth
          .getSession();

      const usuario =
        session?.user;

      if (!usuario) {
        return;
      }

      const nomePadrao =
        usuario.user_metadata
          ?.nome ||
        usuario.email
          ?.split("@")[0] ||
        "Usuário";

      const nomeProprietario =
        selecionar(
          "#nomeProprietario"
        );

      const avatar =
        selecionar(
          ".perfil-avatar"
        );

      const saudacao =
        selecionar(
          ".cabecalho-pagina h1"
        );

      if (nomeProprietario) {
        nomeProprietario.textContent =
          nomePadrao;
      }

      if (avatar) {
        avatar.textContent =
          obterIniciais(
            nomePadrao
          );
      }

      if (saudacao) {
        const primeiroNome =
          nomePadrao
            .trim()
            .split(/\s+/)[0];

        saudacao.innerHTML = `
          Olá, ${escaparHTML(
            primeiroNome
          )}!

          <span>👋</span>
        `;
      }

      const {
        data: barbearia,
        error
      } =
        await cliente
          .from("barbearias")
          .select("nome")
          .eq(
            "proprietario_id",
            usuario.id
          )
          .maybeSingle();

      if (
        !error &&
        barbearia?.nome
      ) {
        const nomeBarbearia =
          selecionar(
            "#nomeBarbearia"
          );

        const marca =
          selecionar(
            ".marca-texto"
          );

        if (nomeBarbearia) {
          nomeBarbearia.textContent =
            barbearia.nome;
        }

        if (marca) {
          marca.textContent =
            barbearia.nome;
        }
      }
    } catch (erro) {
      console.warn(
        "Não foi possível carregar o perfil do Supabase:",
        erro
      );
    }
  }

  function adicionarEstilosFuncionais() {
    if (
      selecionar(
        "#estilos-barbeiro-js"
      )
    ) {
      return;
    }

    const estilo =
      document.createElement(
        "style"
      );

    estilo.id =
      "estilos-barbeiro-js";

    estilo.textContent = `
      body.modal-aberto {
        overflow: hidden;
      }

      .agendamento-item {
        display: grid;
        grid-template-columns:
          64px
          42px
          minmax(0, 1fr)
          auto
          34px;

        align-items: center;
        gap: 14px;

        padding: 15px 0;

        border-bottom:
          1px solid
          var(--border, #292b32);
      }

      .agendamento-item:last-child {
        border-bottom: none;
      }

      .agendamento-horario {
        display: flex;
        flex-direction: column;

        gap: 3px;
      }

      .agendamento-horario strong {
        color:
          var(
            --text-primary,
            #ffffff
          );

        font-size: 14px;
      }

      .agendamento-horario small,
      .agendamento-dados small {
        color:
          var(
            --text-muted,
            #676b76
          );

        font-size: 10px;
      }

      .agendamento-avatar {
        width: 38px;
        height: 38px;

        display: grid;
        place-items: center;

        color: #ffffff;
        background:
          rgba(
            0,
            60,
            255,
            0.14
          );

        border:
          1px solid
          rgba(
            0,
            60,
            255,
            0.28
          );

        border-radius: 50%;

        font-size: 10px;
        font-weight: 700;
      }

      .agendamento-dados {
        min-width: 0;

        display: flex;
        flex-direction: column;

        gap: 4px;
      }

      .agendamento-dados strong {
        overflow: hidden;

        color:
          var(
            --text-primary,
            #ffffff
          );

        font-size: 13px;

        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .agendamento-status {
        padding: 7px 10px;

        border: none;
        border-radius: 999px;

        font-size: 10px;
        font-weight: 600;

        cursor: pointer;
      }

      .status-confirmado {
        color: #55df99;
        background:
          rgba(
            85,
            223,
            153,
            0.1
          );
      }

      .status-pendente {
        color: #f4b85c;
        background:
          rgba(
            244,
            184,
            92,
            0.1
          );
      }

      .status-concluido {
        color: #8ca8ff;
        background:
          rgba(
            0,
            60,
            255,
            0.12
          );
      }

      .agendamento-remover {
        width: 32px;
        height: 32px;

        display: grid;
        place-items: center;

        color:
          var(
            --text-secondary,
            #a1a5b0
          );

        background: transparent;

        border: none;
        border-radius: 8px;

        cursor: pointer;
      }

      .agendamento-remover:hover {
        color: #ff6b78;

        background:
          rgba(
            255,
            107,
            120,
            0.08
          );
      }

      .estado-vazio {
        min-height: 220px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        gap: 9px;

        color:
          var(
            --text-muted,
            #676b76
          );

        text-align: center;
      }

      .estado-vazio i {
        margin-bottom: 6px;

        font-size: 28px;
      }

      .estado-vazio strong {
        color:
          var(
            --text-secondary,
            #a1a5b0
          );
      }

      .menu-topo-flutuante {
        position: absolute;
        top: calc(100% + 14px);
        right: 75px;
        z-index: 3000;

        width: min(
          340px,
          calc(100vw - 24px)
        );

        padding: 12px;

        background:
          var(
            --surface,
            #18191e
          );

        border:
          1px solid
          var(
            --border,
            #292b32
          );

        border-radius:
          var(
            --radius-medium,
            12px
          );

        box-shadow:
          0 20px 50px
          rgba(
            0,
            0,
            0,
            0.45
          );
      }

      .menu-topo-flutuante[hidden] {
        display: none !important;
      }

      .menu-topo-titulo {
        display: flex;
        align-items: center;
        justify-content:
          space-between;

        gap: 12px;

        padding:
          6px
          6px
          12px;
      }

      .menu-topo-titulo button {
        color:
          var(
            --primary-blue,
            #003cff
          );

        background: transparent;

        border: none;

        font-size: 10px;

        cursor: pointer;
      }

      .notificacao-item,
      .menu-perfil-flutuante
        > button {
        width: 100%;

        display: flex;
        align-items: center;

        gap: 12px;

        padding: 12px;

        color:
          var(
            --text-primary,
            #ffffff
          );

        background: transparent;

        border: none;
        border-radius: 10px;

        text-align: left;

        cursor: pointer;
      }

      .notificacao-item:hover,
      .menu-perfil-flutuante
        > button:hover {
        background:
          var(
            --surface-hover,
            #1d1f25
          );
      }

      .notificacao-item > i {
        width: 34px;
        height: 34px;

        display: grid;
        place-items: center;

        color:
          var(
            --primary-blue,
            #003cff
          );

        background:
          rgba(
            0,
            60,
            255,
            0.1
          );

        border-radius: 9px;
      }

      .notificacao-item span {
        display: flex;
        flex-direction: column;

        gap: 4px;
      }

      .notificacao-item strong {
        font-size: 11px;
      }

      .notificacao-item small {
        color:
          var(
            --text-muted,
            #676b76
          );

        font-size: 9px;
      }

      .menu-perfil-flutuante {
        right: 0;
        width: 230px;
      }

      .menu-perfil-flutuante
        > button {
        font-size: 12px;
      }

      .menu-perfil-flutuante
        > button i {
        width: 20px;
      }

      .menu-perfil-flutuante
        .botao-sair {
        color: #ff6b78;
      }

      #toast {
        pointer-events: none;
      }

      #toast.visivel {
        opacity: 1 !important;
        visibility:
          visible !important;

        transform:
          translateY(0) !important;
      }

      #toast[data-tipo="erro"] {
        border-color:
          rgba(
            255,
            107,
            120,
            0.5
          );
      }

      #toast[data-tipo="info"] {
        border-color:
          rgba(
            0,
            60,
            255,
            0.5
          );
      }

      @media (
        max-width: 620px
      ) {
        .agendamento-item {
          grid-template-columns:
            52px
            36px
            minmax(0, 1fr)
            30px;
        }

        .agendamento-status {
          grid-column: 3 / 5;
          justify-self: start;
        }

        .menu-topo-flutuante {
          position: fixed;

          top: 72px;
          right: 12px;
          left: 12px;

          width: auto;
        }
      }
    `;

    document.head.appendChild(
      estilo
    );
  }

  async function iniciarPainel() {
    adicionarEstilosFuncionais();

    carregarAgendamentos();
    renderizarAgendamentos();

    configurarModal();
    configurarTopo();
    configurarMenuLateral();
    configurarAcoesRapidas();
    configurarBotoesCards();

    selecionar(
      "#listaAgendamentos"
    )?.addEventListener(
      "click",
      tratarCliqueAgendamento
    );

    animarGrafico();

    await carregarPerfilSupabase();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      iniciarPainel,
      {
        once: true
      }
    );
  } else {
    iniciarPainel();
  }
})();