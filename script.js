const containerPopu = document.getElementById("cardsPopulares");
const btnEsquerdaPopu = document.querySelector(".Populares .btn-scrollEs");
const btnDireitaPopu = document.querySelector(".Populares .btn-scrollDi");
const containerMavi = document.getElementById("cardsMaisVisitados");
const btnEsquerdaMavi = document.querySelector(".MaisVisitados .btn-scrollEs");
const btnDireitaMavi = document.querySelector(".MaisVisitados .btn-scrollDi");
const containerReco = document.getElementById("cardsRecomendados");
const btnEsquerdaReco = document.querySelector(".Recomendados .btn-scrollEs");
const btnDireitaReco = document.querySelector(".Recomendados .btn-scrollDi");




function rolarPopulares(direcao) {
  const distancia = 1120;
  if (containerPopu) {
    containerPopu.scrollBy({ left: direcao * distancia, behavior: "smooth" });
  }
}

function gerenciarSetasPopulares() {
  if (!containerPopu || !btnEsquerdaPopu || !btnDireitaPopu) return;

  if (containerPopu.scrollLeft <= 5) {
    btnEsquerdaPopu.classList.add("escondido");
  } else {
    btnEsquerdaPopu.classList.remove("escondido");
  }

  const limiteMaximo = containerPopu.scrollWidth - containerPopu.clientWidth;
  if (containerPopu.scrollLeft >= limiteMaximo - 5) {
    btnDireitaPopu.classList.add("escondido");
  } else {
    btnDireitaPopu.classList.remove("escondido");
  }
}

if (containerPopu) {
  containerPopu.addEventListener("scroll", gerenciarSetasPopulares);
}

function rolarMaisVisitados(direcao) {
  const distancia = 1120;
  if (containerMavi) {
    containerMavi.scrollBy({ left: direcao * distancia, behavior: "smooth" });
  }
}

function gerenciarSetasMaisVisitados() {
  if (!containerMavi || !btnEsquerdaMavi || !btnDireitaMavi) return;

  if (containerMavi.scrollLeft <= 5) {
    btnEsquerdaMavi.classList.add("escondido");
  } else {
    btnEsquerdaMavi.classList.remove("escondido");
  }

  const limiteMaximo = containerMavi.scrollWidth - containerMavi.clientWidth;
  if (containerMavi.scrollLeft >= limiteMaximo - 5) {
    btnDireitaMavi.classList.add("escondido");
  } else {
    btnDireitaMavi.classList.remove("escondido");
  }
}

if (containerMavi) {
  containerMavi.addEventListener("scroll", gerenciarSetasMaisVisitados);
}

function atualizarTodasAsSetas() {
  gerenciarSetasPopulares();
  gerenciarSetasMaisVisitados();
}

function rolarRecomendados(direcao) {
  const distancia = 1120;
  if (containerReco) {
    containerReco.scrollBy({ left: direcao * distancia, behavior: "smooth" });
  }
}

function gerenciarSetasRecomendados() {
  if (!containerReco || !btnEsquerdaReco || !btnDireitaReco) return;

  if (containerReco.scrollLeft <= 5) {
    btnEsquerdaReco.classList.add("escondido");
  } else {
    btnEsquerdaReco.classList.remove("escondido");
  }

  const limiteMaximo = containerReco.scrollWidth - containerReco.clientWidth;
  if (containerReco.scrollLeft >= limiteMaximo - 5) {
    btnDireitaReco.classList.add("escondido");
  } else {
    btnDireitaReco.classList.remove("escondido");
  }
}

if (containerReco) {
  containerReco.addEventListener("scroll", gerenciarSetasRecomendados);
}

function atualizarDataCabecalho() {
  const elementoData = document.getElementById("data-cabecalho");

  if (!elementoData) return;

  const hoje = new Date();

  const opcoes = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let dataFormatada = hoje.toLocaleDateString("pt-BR", opcoes);

  dataFormatada =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  elementoData.textContent = dataFormatada;
}

window.addEventListener("DOMContentLoaded", atualizarDataCabecalho);
window.addEventListener("load", atualizarTodasAsSetas);
window.addEventListener("resize", atualizarTodasAsSetas);

function perfilLogin() {}
async function btnReserva(barbeariaId) {
  if (!barbeariaId) {
    alert("Barbearia inválida.");
    return;
  }

  try {
    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      alert("Faça login para reservar um horário.");
      btnAbalogin();
      return;
    }

    window.location.href =
      `/Page/Barbearia/barbearia.html?id=${encodeURIComponent(barbeariaId)}`;
  } catch (error) {
    console.error("Erro ao iniciar reserva:", error);
    alert("Não foi possível iniciar a reserva.");
  }
}

function rolarRecomendados(direcao) {
  const container = document.getElementById("cardsRecomendados");
  const card = container.querySelector(".RECO1");

  if (!card) return;

  const scrollAmount = (card.offsetWidth + 20) * direcao;

  container.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
}

function rolarMaisVisitados(direcao) {
  const container = document.getElementById("cardsMaisVisitados");
  const card = container.querySelector(".MAVI1");

  if (!card) return;

  const scrollAmount = (card.offsetWidth + 20) * direcao;

  container.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
}

function rolarPopulares(direcao) {
  const container = document.getElementById("cardsPopulares");
  const card = container.querySelector(".POPU1");

  if (!card) return;

  const scrollAmount = (card.offsetWidth + 20) * direcao;

  container.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
}

async function verificarLogin() {
  const containerPerfil =
    document.getElementById("container-perfil");

  const h2Saudacao =
    document.querySelector(".h2Cabecalho");

  const iconAgenda =
    document.getElementById("icon-agenda");

  const agendamentosTexto =
    document.getElementById("agendamentos-texto");

  const menuDropdown =
    document.getElementById("menu-usuario-dropdown");

  if (!containerPerfil) return;

  try {
    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();

    if (error) {
      console.error("Erro ao verificar login:", error);
    }

    if (user) {
      const perfil = await buscarPerfilUsuario(user);

      document.body.classList.remove("deslogado");

      fecharModaisLogin();

      containerPerfil.innerHTML = `
        <button
          type="button"
          id="perfil-logado"
          onclick="toggleMenuPerfil()"
          style="
            border: none;
            background: transparent;
            cursor: pointer;
            font-family: 'Sora', sans-serif;
          "
        >
          ${perfil.nome}
        </button>
      `;

      const menuNome =
        document.getElementById("menu-nome");

      const menuEmail =
        document.getElementById("menu-email");

      if (menuNome) {
        menuNome.textContent = perfil.nome;
      }

      if (menuEmail) {
        menuEmail.textContent = perfil.email;
      }

      if (h2Saudacao) {
        h2Saudacao.textContent = `Olá, ${perfil.nome}!`;
      }

      if (iconAgenda) {
        iconAgenda.style.display = "block";
      }

      if (agendamentosTexto) {
        agendamentosTexto.style.display = "block";
      }

      return;
    }

    document.body.classList.add("deslogado");

    containerPerfil.innerHTML = `
      <button
        type="button"
        id="perfil"
        onclick="btnAbalogin()"
      >
        Entrar
      </button>
    `;

    if (menuDropdown) {
      menuDropdown.style.display = "none";
    }

    if (h2Saudacao) {
      h2Saudacao.textContent = "Olá, Faça seu login!";
    }

    if (iconAgenda) {
      iconAgenda.style.display = "none";
    }

    if (agendamentosTexto) {
      agendamentosTexto.style.display = "none";
    }
  } catch (error) {
    console.error("Erro inesperado ao verificar login:", error);
  }
}

function toggleMenuPerfil() {
  const menu = document.getElementById("menu-usuario-dropdown");
  if (menu) {
    menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
  }
}

window.addEventListener("click", function(e) {
  const menu = document.getElementById("menu-usuario-dropdown");
  const perfilLogado = document.getElementById("perfil-logado");
  if (menu && menu.style.display === "block" && e.target !== perfilLogado && !menu.contains(e.target)) {
    menu.style.display = "none";
  }
});

async function fazerLogout() {
  try {
    const { error } =
      await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    const menu =
      document.getElementById("menu-usuario-dropdown");

    if (menu) {
      menu.style.display = "none";
    }

    await verificarLogin();
  } catch (error) {
    console.error("Erro ao sair:", error);
    alert("Não foi possível sair da conta.");
  }
}

// ========== FUNÇÃO DE ENTRAR ==========

async function EntrarLogin() {
  const emailInput = document.querySelector(".Email1");
  const senhaInput = document.querySelector(".Senha1");
  const botao = document.querySelector(".bntEntrar");

  const email = emailInput?.value.trim().toLowerCase();
  const senha = senhaInput?.value;

  if (!email || !senha) {
    alert("Preencha o e-mail e a senha.");
    return;
  }

  try {
    if (botao) {
      botao.disabled = true;
      botao.textContent = "Entrando...";
    }

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password: senha
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Usuário não encontrado.");
    }

    fecharModaisLogin();

    await verificarLogin();

    if (emailInput) emailInput.value = "";
    if (senhaInput) senhaInput.value = "";
  } catch (error) {
    console.error("Erro no login:", error);

    const mensagem =
      error?.message?.toLowerCase() || "";

    if (mensagem.includes("email not confirmed")) {
      alert(
        "Seu cadastro foi realizado, mas o e-mail ainda não foi confirmado. Verifique sua caixa de entrada e a pasta de spam."
      );
      return;
    }

    if (mensagem.includes("invalid login credentials")) {
      alert(
        "E-mail ou senha incorretos. Confira os dados informados."
      );
      return;
    }

    if (mensagem.includes("rate limit")) {
      alert(
        "Muitas tentativas seguidas. Aguarde alguns segundos e tente novamente."
      );
      return;
    }

    alert(
      `Não foi possível entrar: ${error.message}`
    );
  } finally {
    if (botao) {
      botao.disabled = false;
      botao.textContent = "Entrar";
    }
  }
}


async function CriarLogin() {
  const emailInput =
    document.querySelector(".EmailCadastro");

  const senhaInput =
    document.querySelector(".SenhaCadastro");

  const nomeInput =
    document.querySelector(".NomeCadastro");

  const botaoCadastro =
    document.querySelector(
      ".Cadastrar .bntEntrar"
    );

  const email =
    emailInput?.value.trim().toLowerCase();

  const senha =
    senhaInput?.value;

  const nome =
    nomeInput?.value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha nome, e-mail e senha.");
    return;
  }

  if (senha.length < 6) {
    alert(
      "A senha precisa ter pelo menos 6 caracteres."
    );
    return;
  }

  try {
    if (botaoCadastro) {
      botaoCadastro.disabled = true;
      botaoCadastro.textContent =
        "Criando conta...";
    }

    const { data, error } =
      await supabaseClient.auth.signUp({
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

    if (!data.session) {
      fecharModaisLogin();

      alert(
        "Conta criada! Enviamos um link de confirmação para seu e-mail. Verifique também a pasta de spam."
      );

      return;
    }

    fecharModaisLogin();
    await verificarLogin();

    alert(`Bem-vindo, ${nome}!`);
  } catch (error) {
    console.error(
      "Erro ao criar conta:",
      error
    );

    const mensagem =
      error?.message?.toLowerCase() || "";

    if (
      mensagem.includes(
        "only request this after"
      )
    ) {
      alert(
        "Aguarde alguns segundos antes de tentar criar a conta novamente."
      );
      return;
    }

    if (
      mensagem.includes(
        "already registered"
      )
    ) {
      alert(
        "Este e-mail já está cadastrado. Tente entrar em vez de criar outra conta."
      );
      return;
    }

    alert(
      `Não foi possível criar a conta: ${error.message}`
    );
  } finally {
    if (botaoCadastro) {
      botaoCadastro.disabled = false;
      botaoCadastro.textContent =
        "Cadastrar";
    }
  }
}

async function reenviarConfirmacao() {
  const emailInput =
    document.querySelector(".Email1");

  const email =
    emailInput?.value.trim().toLowerCase();

  if (!email) {
    alert(
      "Digite seu e-mail primeiro."
    );
    return;
  }

  try {
    const { error } =
      await supabaseClient.auth.resend({
        type: "signup",
        email
      });

    if (error) {
      throw error;
    }

    alert(
      "E-mail de confirmação reenviado. Verifique sua caixa de entrada e a pasta de spam."
    );
  } catch (error) {
    console.error(
      "Erro ao reenviar confirmação:",
      error
    );

    const mensagem =
      error?.message?.toLowerCase() || "";

    if (
      mensagem.includes(
        "only request this after"
      )
    ) {
      alert(
        "Aguarde alguns segundos antes de solicitar outro e-mail."
      );
      return;
    }

    alert(
      `Não foi possível reenviar: ${error.message}`
    );
  }
}

function fecharModaisLogin() {
  const login = document.querySelector(".login");
  const entrar = document.querySelector(".Entrar");
  const cadastros = document.querySelectorAll(".Cadastrar");

  if (login) {
    login.style.display = "none";
  }

  if (entrar) {
    entrar.style.display = "none";
  }

  cadastros.forEach((cadastro) => {
    cadastro.style.display = "none";
  });
}

async function buscarPerfilUsuario(user) {
  try {
    const { data, error } = await supabaseClient
      .from("usuarios")
      .select("id, nome, email, foto_perfil, role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
    }

    return {
      id: user.id,

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
    console.error("Erro inesperado ao buscar perfil:", error);

    return {
      id: user.id,
      nome:
        user.user_metadata?.nome ||
        user.email?.split("@")[0] ||
        "Usuário",
      email: user.email || "",
      foto_perfil: null,
      role: "CLIENTE"
    };
  }
}
// ========== CAPTURAR DIGITAÇÃO NA INDEX E REDIRECIONAR ==========
document.addEventListener("DOMContentLoaded", async () => {
  await verificarLogin();
});


supabaseClient.auth.onAuthStateChange((evento, sessao) => {
  console.log("Estado da autenticação:", evento);

  setTimeout(() => {
    verificarLogin();
  }, 0);
});

// ========== Outras funções ==========


function btnAbalogin() {
    const login = document.querySelector('.login');
    const entrar = document.querySelector('.Entrar');
    const cadastrar = document.querySelector('.Cadastrar');

    if (login.style.display === 'flex' || entrar.style.display === 'flex' || cadastrar.style.display === 'flex') {
        login.style.display = 'none';
        entrar.style.display = 'none';
        cadastrar.style.display = 'none';
    } else {
        login.style.display = 'flex'; 
    }
}

function btnIrParaEntrar() {
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.Entrar').style.display = 'flex';
}

function btnIrParaCadastrar() {
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.Cadastrar').style.display = 'flex';
}

function btnVoltarParaMenu() {
    document.querySelector('.Entrar').style.display = 'none';
    document.querySelector('.Cadastrar').style.display = 'none';
    document.querySelector('.login').style.display = 'flex';
}

// ========== INICIAR ==========
document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await verificarLogin();
  }
);

supabaseClient.auth.onAuthStateChange(
  (evento, sessao) => {
    console.log(
      "Estado da autenticação:",
      evento
    );

    setTimeout(() => {
      verificarLogin();
    }, 0);
  }
);