(() => {
  const SUPABASE_URL =
    "https://cfqvfiquhtzzzfuubltf.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_q1Ckt9CnEi7cJSzFsHPjug_TLc2kWwX";

  let clienteSupabase = null;
  let inscricaoAuth = null;

  function obterSupabase() {
    if (clienteSupabase) {
      return clienteSupabase;
    }

    /*
     * Aproveita o cliente criado pelo seed.js,
     * caso ele já exista.
     */
    try {
      if (
        typeof supabaseClient !== "undefined" &&
        supabaseClient
      ) {
        clienteSupabase = supabaseClient;

        window.supabaseClient =
          clienteSupabase;

        return clienteSupabase;
      }
    } catch (erro) {
      // Continua para criar o cliente.
    }

    if (window.supabaseClient) {
      clienteSupabase =
        window.supabaseClient;

      return clienteSupabase;
    }

    if (!window.supabase?.createClient) {
      console.error(
        "❌ Biblioteca do Supabase não carregada."
      );

      return null;
    }

    clienteSupabase =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    window.supabaseClient =
      clienteSupabase;

    return clienteSupabase;
  }

  /* =======================================
     DATA DO CABEÇALHO
  ======================================= */

  function atualizarDataCabecalho() {
    const elemento =
      document.getElementById(
        "data-cabecalho"
      );

    if (!elemento) return;

    const texto = new Date()
      .toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });

    elemento.textContent =
      texto.charAt(0).toUpperCase() +
      texto.slice(1);
  }

  /* =======================================
     ROLAGEM DOS CARDS
  ======================================= */

  function rolarContainer(
    containerId,
    seletorCard,
    direcao
  ) {
    const container =
      document.getElementById(
        containerId
      );

    if (!container) return;

    const card =
      container.querySelector(
        seletorCard
      );

    const distancia = card
      ? card.offsetWidth + 20
      : Math.min(
          container.clientWidth * 0.85,
          800
        );

    container.scrollBy({
      left: distancia * direcao,
      behavior: "smooth"
    });
  }

  window.rolarRecomendados =
    function rolarRecomendados(direcao) {
      rolarContainer(
        "cardsRecomendados",
        ".RECO1",
        direcao
      );
    };

  window.rolarPopulares =
    function rolarPopulares(direcao) {
      rolarContainer(
        "cardsPopulares",
        ".POPU1",
        direcao
      );
    };

  window.rolarMaisVisitados =
    function rolarMaisVisitados(direcao) {
      rolarContainer(
        "cardsMaisVisitados",
        ".MAVI1",
        direcao
      );
    };

  /* =======================================
     PESQUISA
  ======================================= */

  function iniciarBusca() {
    const input =
      document.querySelector(
        ".buscBarb"
      );

    const botao =
      document.querySelector(
        ".btnPesquisa"
      );

    if (
      !input ||
      input.dataset.buscaConfigurada ===
        "true"
    ) {
      return;
    }

    input.dataset.buscaConfigurada =
      "true";

    let redirecionando = false;

    function irParaBusca() {
      if (redirecionando) return;

      const termo =
        input.value.trim();

      const url = new URL(
        "./Page/Buscar/buscar.html",
        window.location.href
      );

      if (termo) {
        url.searchParams.set(
          "pesquisa",
          termo
        );
      }

      redirecionando = true;

      window.location.href =
        url.href;
    }

    input.addEventListener(
      "input",
      () => {
        if (input.value.trim()) {
          irParaBusca();
        }
      }
    );

    input.addEventListener(
      "keydown",
      (evento) => {
        if (evento.key === "Enter") {
          evento.preventDefault();
          irParaBusca();
        }
      }
    );

    botao?.addEventListener(
      "click",
      irParaBusca
    );
  }

  /* =======================================
     MODAIS
  ======================================= */

  function mostrar(elemento) {
    if (elemento) {
      elemento.hidden = false;
    }
  }

  function esconder(elemento) {
    if (elemento) {
      elemento.hidden = true;
    }
  }

  function fecharModais() {
    document
      .querySelectorAll(
        ".modal-autenticacao"
      )
      .forEach((modal) => {
        modal.hidden = true;
      });
  }

  function abrirModal(seletor) {
    fecharModais();

    mostrar(
      document.querySelector(seletor)
    );
  }

  /* =======================================
     DROPDOWN
  ======================================= */

  function fecharDropdown() {
    const menu =
      document.getElementById(
        "menu-usuario-dropdown"
      );

    const botao =
      document.getElementById(
        "perfil-logado"
      );

    esconder(menu);

    botao?.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function alternarDropdown() {
    const menu =
      document.getElementById(
        "menu-usuario-dropdown"
      );

    const botao =
      document.getElementById(
        "perfil-logado"
      );

    if (!menu) return;

    const abrir = menu.hidden;

    menu.hidden = !abrir;

    botao?.setAttribute(
      "aria-expanded",
      String(abrir)
    );
  }

  /* =======================================
     PERFIL DO USUÁRIO
  ======================================= */

  function obterInicial(nome) {
    return (
      nome
        ?.trim()
        .charAt(0)
        .toUpperCase() || "U"
    );
  }

  function preencherAvatar(
    elemento,
    perfil
  ) {
    if (!elemento) return;

    elemento.innerHTML = "";

    if (perfil.foto_perfil) {
      const imagem =
        document.createElement("img");

      imagem.src =
        perfil.foto_perfil;

      imagem.alt =
        `Foto de ${perfil.nome}`;

      imagem.addEventListener(
        "error",
        () => {
          elemento.innerHTML = "";
          elemento.textContent =
            obterInicial(perfil.nome);
        },
        { once: true }
      );

      elemento.appendChild(imagem);

      return;
    }

    elemento.textContent =
      obterInicial(perfil.nome);
  }

  async function buscarPerfil(user) {
    const supabase =
      obterSupabase();

    if (!supabase) {
      return {
        nome:
          user.user_metadata?.nome ||
          user.email?.split("@")[0] ||
          "Usuário",

        email:
          user.email || "",

        foto_perfil: null,

        role: "CLIENTE"
      };
    }

    try {
      const { data, error } =
        await supabase
          .from("usuarios")
          .select(
            "nome, email, foto_perfil, role"
          )
          .eq("id", user.id)
          .maybeSingle();

      if (error) {
        console.error(
          "Erro ao buscar perfil:",
          error
        );
      }

      return {
        nome:
          data?.nome ||
          user.user_metadata?.nome ||
          user.email?.split("@")[0] ||
          "Usuário",

        email:
          data?.email ||
          user.email ||
          "",

        foto_perfil:
          data?.foto_perfil ||
          null,

        role:
          data?.role ||
          "CLIENTE"
      };
    } catch (error) {
      console.error(
        "Erro inesperado ao buscar perfil:",
        error
      );

      return {
        nome:
          user.user_metadata?.nome ||
          user.email?.split("@")[0] ||
          "Usuário",

        email:
          user.email || "",

        foto_perfil: null,

        role: "CLIENTE"
      };
    }
  }

  function mostrarDeslogado() {
    const container =
      document.getElementById(
        "container-perfil"
      );

    const agendamentos =
      document.getElementById(
        "agendamentos-link"
      );

    const saudacao =
      document.querySelector(
        ".h2Cabecalho"
      );

    document.body.classList.add(
      "deslogado"
    );

    esconder(agendamentos);
    fecharDropdown();

    if (saudacao) {
      saudacao.textContent =
        "Olá, faça seu login!";
    }

    if (!container) return;

    container.innerHTML = `
      <button
        type="button"
        id="perfil"
      >
        Entrar
      </button>
    `;

    document
      .getElementById("perfil")
      ?.addEventListener(
        "click",
        () => abrirModal(".login")
      );
  }

  function mostrarLogado(perfil) {
    const container =
      document.getElementById(
        "container-perfil"
      );

    const agendamentos =
      document.getElementById(
        "agendamentos-link"
      );

    const menuNome =
      document.getElementById(
        "menu-nome"
      );

    const menuEmail =
      document.getElementById(
        "menu-email"
      );

    const menuAvatar =
      document.getElementById(
        "menu-avatar"
      );

    const saudacao =
      document.querySelector(
        ".h2Cabecalho"
      );

    if (!container) return;

    document.body.classList.remove(
      "deslogado"
    );

    mostrar(agendamentos);

    if (saudacao) {
      saudacao.textContent =
        `Olá, ${perfil.nome}!`;
    }

    container.innerHTML = `
      <button
        type="button"
        id="perfil-logado"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span class="avatar-header"></span>

        <span class="nome-header"></span>

        <span
          class="seta-header"
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
    `;

    const botao =
      document.getElementById(
        "perfil-logado"
      );

    const avatar =
      botao?.querySelector(
        ".avatar-header"
      );

    const nome =
      botao?.querySelector(
        ".nome-header"
      );

    if (nome) {
      nome.textContent =
        perfil.nome;
    }

    if (menuNome) {
      menuNome.textContent =
        perfil.nome;
    }

    if (menuEmail) {
      menuEmail.textContent =
        perfil.email;
    }

    preencherAvatar(
      avatar,
      perfil
    );

    preencherAvatar(
      menuAvatar,
      perfil
    );

    botao?.addEventListener(
      "click",
      (evento) => {
        evento.stopPropagation();

        alternarDropdown();
      }
    );

    fecharModais();
  }

  async function verificarLogin() {
    const supabase =
      obterSupabase();

    if (!supabase) {
      mostrarDeslogado();
      return;
    }

    try {
      const {
        data: { user },
        error
      } =
        await supabase.auth.getUser();

      if (error || !user) {
        mostrarDeslogado();
        return;
      }

      const perfil =
        await buscarPerfil(user);

      mostrarLogado(perfil);
    } catch (error) {
      console.error(
        "Erro ao verificar login:",
        error
      );

      mostrarDeslogado();
    }
  }

  /* =======================================
     ENTRAR
  ======================================= */

  async function entrar() {
    const supabase =
      obterSupabase();

    const emailInput =
      document.querySelector(
        ".Email1"
      );

    const senhaInput =
      document.querySelector(
        ".Senha1"
      );

    const botao =
      document.getElementById(
        "confirmar-login"
      );

    const email =
      emailInput?.value
        .trim()
        .toLowerCase();

    const senha =
      senhaInput?.value;

    if (!supabase) {
      alert(
        "Não foi possível conectar ao Supabase."
      );

      return;
    }

    if (!email || !senha) {
      alert(
        "Preencha o e-mail e a senha."
      );

      return;
    }

    try {
      if (botao) {
        botao.disabled = true;
        botao.textContent =
          "Entrando...";
      }

      const { error } =
        await supabase.auth
          .signInWithPassword({
            email,
            password: senha
          });

      if (error) {
        throw error;
      }

      if (emailInput) {
        emailInput.value = "";
      }

      if (senhaInput) {
        senhaInput.value = "";
      }

      fecharModais();

      await verificarLogin();
    } catch (error) {
      console.error(
        "Erro no login:",
        error
      );

      const mensagem =
        error?.message
          ?.toLowerCase() || "";

      if (
        mensagem.includes(
          "email not confirmed"
        )
      ) {
        alert(
          "Confirme seu e-mail antes de entrar."
        );

        return;
      }

      if (
        mensagem.includes(
          "invalid login credentials"
        )
      ) {
        alert(
          "E-mail ou senha incorretos."
        );

        return;
      }

      alert(
        `Não foi possível entrar: ${
          error.message
        }`
      );
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = "Entrar";
      }
    }
  }

  /* =======================================
     CADASTRAR
  ======================================= */

  async function cadastrar() {
    const supabase =
      obterSupabase();

    const nomeInput =
      document.querySelector(
        ".NomeCadastro"
      );

    const emailInput =
      document.querySelector(
        ".EmailCadastro"
      );

    const senhaInput =
      document.querySelector(
        ".SenhaCadastro"
      );

    const botao =
      document.getElementById(
        "confirmar-cadastro"
      );

    const nome =
      nomeInput?.value.trim();

    const email =
      emailInput?.value
        .trim()
        .toLowerCase();

    const senha =
      senhaInput?.value;

    if (!supabase) {
      alert(
        "Não foi possível conectar ao Supabase."
      );

      return;
    }

    if (!nome || !email || !senha) {
      alert(
        "Preencha nome, e-mail e senha."
      );

      return;
    }

    if (senha.length < 6) {
      alert(
        "A senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }

    try {
      if (botao) {
        botao.disabled = true;

        botao.textContent =
          "Criando conta...";
      }

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password: senha,

          options: {
            data: {
              nome
            }
          }
        });

      if (error) {
        throw error;
      }

      fecharModais();

      if (!data.session) {
        alert(
          "Conta criada! Confirme seu e-mail para entrar."
        );

        return;
      }

      await verificarLogin();
    } catch (error) {
      console.error(
        "Erro no cadastro:",
        error
      );

      const mensagem =
        error?.message
          ?.toLowerCase() || "";

      if (
        mensagem.includes(
          "already registered"
        )
      ) {
        alert(
          "Este e-mail já está cadastrado."
        );

        return;
      }

      alert(
        `Não foi possível cadastrar: ${
          error.message
        }`
      );
    } finally {
      if (botao) {
        botao.disabled = false;

        botao.textContent =
          "Cadastrar";
      }
    }
  }

  /* =======================================
     REENVIAR CONFIRMAÇÃO
  ======================================= */

  async function reenviarConfirmacao() {
    const supabase =
      obterSupabase();

    const email =
      document
        .querySelector(".Email1")
        ?.value.trim()
        .toLowerCase();

    if (!supabase) return;

    if (!email) {
      alert(
        "Digite seu e-mail primeiro."
      );

      return;
    }

    try {
      const { error } =
        await supabase.auth.resend({
          type: "signup",
          email
        });

      if (error) {
        throw error;
      }

      alert(
        "E-mail de confirmação reenviado."
      );
    } catch (error) {
      console.error(
        "Erro ao reenviar confirmação:",
        error
      );

      alert(
        `Não foi possível reenviar: ${
          error.message
        }`
      );
    }
  }

  /* =======================================
     LOGOUT
  ======================================= */

  async function sair() {
    const supabase =
      obterSupabase();

    if (!supabase) return;

    const botao =
      document.getElementById(
        "btn-logout"
      );

    try {
      if (botao) {
        botao.disabled = true;
        botao.textContent = "Saindo...";
      }

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      mostrarDeslogado();
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error
      );

      alert(
        "Não foi possível sair da conta."
      );
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent =
          "Sair da conta";
      }
    }
  }

  /* =======================================
     RESERVAR
  ======================================= */

  window.btnReserva =
    async function btnReserva(
      barbeariaId
    ) {
      const supabase =
        obterSupabase();

      if (!barbeariaId) {
        alert(
          "Barbearia inválida."
        );

        return;
      }

      if (!supabase) {
        alert(
          "Não foi possível verificar sua conta."
        );

        return;
      }

      try {
        const {
          data: { user }
        } =
          await supabase.auth.getUser();

        if (!user) {
          alert(
            "Faça login para reservar."
          );

          abrirModal(".login");

          return;
        }

        window.location.href =
          `/Page/Barbearia/barbearia.html?id=${encodeURIComponent(
            barbeariaId
          )}`;
      } catch (error) {
        console.error(
          "Erro ao iniciar reserva:",
          error
        );
      }
    };

  /* =======================================
     EVENTOS
  ======================================= */

  function registrarEventos() {
    document
      .getElementById("perfil")
      ?.addEventListener(
        "click",
        () => abrirModal(".login")
      );

    document
      .getElementById("abrir-login")
      ?.addEventListener(
        "click",
        () => abrirModal(".Entrar")
      );

    document
      .getElementById(
        "abrir-cadastro"
      )
      ?.addEventListener(
        "click",
        () => abrirModal(".Cadastrar")
      );

    document
      .getElementById(
        "confirmar-login"
      )
      ?.addEventListener(
        "click",
        entrar
      );

    document
      .getElementById(
        "confirmar-cadastro"
      )
      ?.addEventListener(
        "click",
        cadastrar
      );

    document
      .getElementById(
        "reenviar-confirmacao"
      )
      ?.addEventListener(
        "click",
        reenviarConfirmacao
      );

    document
      .getElementById("btn-logout")
      ?.addEventListener(
        "click",
        sair
      );

    document
      .querySelectorAll(
        ".fechar-modal"
      )
      .forEach((botao) => {
        botao.addEventListener(
          "click",
          fecharModais
        );
      });

    document
      .querySelectorAll(
        ".voltar-modal"
      )
      .forEach((botao) => {
        botao.addEventListener(
          "click",
          () => abrirModal(".login")
        );
      });

    document
      .querySelectorAll(
        ".modal-autenticacao"
      )
      .forEach((modal) => {
        modal.addEventListener(
          "click",
          (evento) => {
            if (evento.target === modal) {
              fecharModais();
            }
          }
        );
      });

    document.addEventListener(
      "click",
      (evento) => {
        const menu =
          document.getElementById(
            "menu-usuario-dropdown"
          );

        const perfil =
          document.getElementById(
            "perfil-logado"
          );

        if (
          menu?.contains(evento.target) ||
          perfil?.contains(evento.target)
        ) {
          return;
        }

        fecharDropdown();
      }
    );

    document.addEventListener(
      "keydown",
      (evento) => {
        if (evento.key === "Escape") {
          fecharDropdown();
          fecharModais();
        }

        if (
          evento.key === "Enter" &&
          document.activeElement
            ?.classList.contains(
              "Senha1"
            )
        ) {
          entrar();
        }

        if (
          evento.key === "Enter" &&
          document.activeElement
            ?.classList.contains(
              "SenhaCadastro"
            )
        ) {
          cadastrar();
        }
      }
    );
  }

  /* =======================================
     INICIAR
  ======================================= */

  async function iniciar() {
    atualizarDataCabecalho();
    iniciarBusca();
    registrarEventos();

    await verificarLogin();

    const supabase =
      obterSupabase();

    if (
      supabase &&
      !inscricaoAuth
    ) {
      const resposta =
        supabase.auth
          .onAuthStateChange(() => {
            setTimeout(() => {
              verificarLogin();
            }, 0);
          });

      inscricaoAuth =
        resposta.data.subscription;
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      iniciar,
      { once: true }
    );
  } else {
    iniciar();
  }
})();