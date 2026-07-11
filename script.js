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

// ========== VERIFICAR SE ESTÁ LOGADO ==========

function verificarLogin() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const containerPerfil = document.getElementById("container-perfil");
  const h2Saudacao = document.querySelector(".h2Cabecalho"); 
  const iconAgenda = document.getElementById("icon-agenda");
  const agendamentosTexto = document.getElementById("agendamentos-texto");
  const menuDropdown = document.getElementById("menu-usuario-dropdown");

  const loginPrincipal = document.querySelector('.login');
  const entrarModal = document.querySelector('.Entrar');
  const cadastrarModal = document.querySelector('.Cadastrar');

  if (!containerPerfil) return;

  if (usuarioLogado && usuarioLogado.logado) {
    const nomeParaExibir = usuarioLogado.nome || "Usuário";
    const emailParaExibir = usuarioLogado.email || "email@provedor.com";

    document.body.classList.remove("deslogado");

    if (loginPrincipal) loginPrincipal.style.display = "none";
    if (entrarModal) entrarModal.style.display = "none";
    if (cadastrarModal) cadastrarModal.style.display = "none";

    containerPerfil.innerHTML = `<h2 id="perfil-logado" onclick="toggleMenuPerfil()">${nomeParaExibir}</h2>`;
    
    document.getElementById("menu-nome").textContent = nomeParaExibir;
    document.getElementById("menu-email").textContent = emailParaExibir;

    if (h2Saudacao) h2Saudacao.textContent = `Olá, ${nomeParaExibir}!`;
    if (iconAgenda) iconAgenda.style.display = "block";
    if (agendamentosTexto) agendamentosTexto.style.display = "block";

  } else {
    document.body.classList.add("deslogado");

    if (menuDropdown) menuDropdown.style.display = "none";
    
    containerPerfil.innerHTML = `<button id="perfil" onclick="btnAbalogin()">Entrar</button>`;
    
    if (h2Saudacao) h2Saudacao.textContent = "Olá, Faça seu login!";
    if (iconAgenda) iconAgenda.style.display = "none";
    if (agendamentosTexto) agendamentosTexto.style.display = "none";
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

document.addEventListener("DOMContentLoaded", verificarLogin);

function fazerLogout() {
  localStorage.removeItem("usuarioLogado");

  alert("👋 Você saiu da sua conta com sucesso!");

  verificarLogin();

  const loginPrincipal = document.querySelector('.login');
  if (loginPrincipal) {
    loginPrincipal.style.display = 'flex';
  }
}
// ========== FUNÇÃO DE ENTRAR ==========

function EntrarLogin() {
  const emailInput = document.querySelector(".Email1");
  const senhaInput = document.querySelector(".Senha1");
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const contaValida = usuarios.find(user => user.email === email && user.senha === senha);

  if (!contaValida) {
    alert("❌ Email ou senha incorretos!");
    return;
  }

  const usuarioLogado = { 
    nome: contaValida.nome, 
    email: email, 
    logado: true 
  };
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

  const login = document.querySelector('.login');
  const entrar = document.querySelector('.Entrar');
  if (login) login.style.display = 'none';
  if (entrar) entrar.style.display = 'none';

  verificarLogin();
}

function CriarLogin() {
  const emailInput = document.querySelector(".EmailCadastro"); 
  const senhaInput = document.querySelector(".SenhaCadastro");
  const nomeInput = document.querySelector(".NomeCadastro"); 

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const nome = nomeInput.value.trim();

  if (email === "" || senha === "" || nome === "") {
    alert("⚠️ Preencha todos os campos para criar sua conta!");
    return;
  }

  const usuariosCadastrados = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioExiste = usuariosCadastrados.some(user => user.email === email);
  if (usuarioExiste) {
    alert("❌ Este email já está cadastrado!");
    return;
  }

  const novoUsuario = { email, senha, nome };
  usuariosCadastrados.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuariosCadastrados));

  const usuarioLogado = {
    email: email,
    nome: nome,
    logado: true
  };
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
  
  // Fecha todas as abas de cadastro/login imediatamente
  const login = document.querySelector('.login');
  const cadastrar = document.querySelector(".Cadastrar");
  if (login) login.style.display = "none";
  if (cadastrar) cadastrar.style.display = "none";
  
  alert(`🎉 Bem-vindo, ${nome}!`);
  verificarLogin();
}

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
verificarLogin();

