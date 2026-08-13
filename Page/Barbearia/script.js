const containerReserva = document.querySelector('.container-reserva');
const botaoFechar = document.querySelector('.botao-fechar-container-reserva');
const mesAnoTexto = document.getElementById('mes-ano-texto');
const containerDias = document.getElementById('container-dias');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

const mesesDoAno = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

let dataAtual = new Date();
const dataHojeImutavel = new Date();

let horarioSelecionado = null;


// ======================================================
// ABRIR / FECHAR RESERVA
// ======================================================

function Reservar() {
  if (!containerReserva) return;

  containerReserva.classList.add('ativo');
  renderizarCalendario();
}

botaoFechar?.addEventListener('click', () => {
  containerReserva?.classList.remove('ativo');
});


// ======================================================
// HEADER DO USUÁRIO
// ======================================================

async function carregarHeaderUsuario() {

  const supabase =
    window.supabaseClient ||
    (typeof obterSupabase === "function"
      ? obterSupabase()
      : null);

  const nomePerfil =
    document.getElementById("nomeperfil");

  const menuNome =
    document.getElementById("menu-nome-header");

  const menuEmail =
    document.getElementById("menu-email-header");

  const fotoPerfil =
    document.getElementById("foto-perfil-header");

  const botaoAgendamentos =
    document.getElementById("btn-agendamentos-header");

  if (!supabase || !nomePerfil) return;

  try {

    // ==================================================
    // USUÁRIO LOGADO
    // ==================================================

    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    // ==================================================
    // USUÁRIO NÃO LOGADO
    // ==================================================

    if (!user) {

      nomePerfil.textContent = "Entrar";

      if (menuNome) {
        menuNome.textContent = "Visitante";
      }

      if (menuEmail) {
        menuEmail.textContent = "";
      }

      if (botaoAgendamentos) {
        botaoAgendamentos.style.display = "none";
      }

      return;
    }

    // ==================================================
    // BUSCAR PERFIL
    // ==================================================

    const {
      data: perfil,
      error: perfilError
    } = await supabase
      .from("usuarios")
      .select("nome, email, foto_perfil")
      .eq("id", user.id)
      .maybeSingle();

    if (perfilError) {
      console.error(
        "❌ Erro ao buscar perfil:",
        perfilError
      );
    }

    const nomeUsuario =
      perfil?.nome ||
      user.user_metadata?.nome ||
      user.email?.split("@")[0] ||
      "Usuário";

    const emailUsuario =
      perfil?.email ||
      user.email ||
      "";

    nomePerfil.textContent =
      nomeUsuario;

    if (menuNome) {
      menuNome.textContent =
        nomeUsuario;
    }

    if (menuEmail) {
      menuEmail.textContent =
        emailUsuario;
    }

    if (perfil?.foto_perfil && fotoPerfil) {

      fotoPerfil.src =
        perfil.foto_perfil;

      fotoPerfil.onerror = () => {
        fotoPerfil.src =
          "../../img/logo/imagem7.svg";
      };
    }

    if (botaoAgendamentos) {
      botaoAgendamentos.style.display =
        "flex";
    }

  } catch (error) {

    console.error(
      "❌ Erro ao carregar usuário no header:",
      error
    );

    nomePerfil.textContent =
      "Entrar";
  }
}


// ======================================================
// EVENTOS DO HEADER
// ======================================================

function iniciarEventosHeader() {

  const botaoAgendamentos =
    document.getElementById(
      "btn-agendamentos-header"
    );

  const botaoPerfil =
    document.getElementById(
      "botao-perfil-header"
    );

  const menu =
    document.getElementById(
      "menu-usuario-dropdown"
    );

  const botaoSair =
    document.getElementById(
      "btn-sair-header"
    );


  // ====================================================
  // AGENDAMENTOS
  // ====================================================

  botaoAgendamentos?.addEventListener(
    "click",
    () => {

      window.location.href =
        "/Page/Agendamentos/agendamentos.html";

    }
  );


  // ====================================================
  // PERFIL
  // ====================================================

  botaoPerfil?.addEventListener(
    "click",
    async (event) => {

      event.stopPropagation();

      const supabase =
        window.supabaseClient ||
        (typeof obterSupabase === "function"
          ? obterSupabase()
          : null);

      if (!supabase) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {

        window.location.href =
          "/index.html";

        return;
      }

      if (menu) {

        menu.hidden =
          !menu.hidden;
      }
    }
  );


  // ====================================================
  // SAIR
  // ====================================================

  botaoSair?.addEventListener(
    "click",
    async () => {

      const supabase =
        window.supabaseClient ||
        (typeof obterSupabase === "function"
          ? obterSupabase()
          : null);

      if (!supabase) return;

      try {

        const {
          error
        } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        window.location.href =
          "/index.html";

      } catch (error) {

        console.error(
          "❌ Erro ao sair:",
          error
        );

        alert(
          "Não foi possível sair da conta."
        );
      }
    }
  );


  // ====================================================
  // FECHAR MENU CLICANDO FORA
  // ====================================================

  document.addEventListener(
    "click",
    (event) => {

      if (
        menu &&
        botaoPerfil &&
        !menu.contains(event.target) &&
        !botaoPerfil.contains(event.target)
      ) {

        menu.hidden = true;
      }
    }
  );
}


// ======================================================
// INICIAR HEADER
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    iniciarEventosHeader();

    await carregarHeaderUsuario();

  }
);


// ======================================================
// ATUALIZAR HEADER APÓS LOGIN / LOGOUT
// ======================================================

const supabaseAtual =
  window.supabaseClient ||
  (typeof obterSupabase === "function"
    ? obterSupabase()
    : null);

if (supabaseAtual) {

  supabaseAtual.auth.onAuthStateChange(
    () => {

      setTimeout(() => {

        carregarHeaderUsuario();

      }, 0);

    }
  );
}


// ======================================================
// CALENDÁRIO
// ======================================================

function renderizarCalendario() {

  if (
    !mesAnoTexto ||
    !containerDias ||
    !btnPrev ||
    !btnNext
  ) {
    return;
  }

  const ano =
    dataAtual.getFullYear();

  const mes =
    dataAtual.getMonth();

  mesAnoTexto.textContent =
    `${mesesDoAno[mes]} ${ano}`;

  const primeiroDiaDaSemana =
    new Date(
      ano,
      mes,
      1
    ).getDay();

  const ultimoDiaDoMes =
    new Date(
      ano,
      mes + 1,
      0
    ).getDate();

  containerDias.innerHTML = "";

  // ====================================================
  // BOTÃO ANTERIOR
  // ====================================================

  if (
    ano === dataHojeImutavel.getFullYear() &&
    mes === dataHojeImutavel.getMonth()
  ) {

    btnPrev.disabled = true;
    btnPrev.style.opacity = "0.3";
    btnPrev.style.cursor = "not-allowed";

  } else {

    btnPrev.disabled = false;
    btnPrev.style.opacity = "1";
    btnPrev.style.cursor = "pointer";
  }


  // ====================================================
  // ESPAÇOS ANTES DO PRIMEIRO DIA
  // ====================================================

  for (
    let i = 0;
    i < primeiroDiaDaSemana;
    i++
  ) {

    const spanVazio =
      document.createElement("span");

    containerDias.appendChild(
      spanVazio
    );
  }


  // ====================================================
  // DIAS DO MÊS
  // ====================================================

  for (
    let dia = 1;
    dia <= ultimoDiaDoMes;
    dia++
  ) {

    const spanDia =
      document.createElement("span");

    spanDia.textContent =
      dia;


    const dataVerificacao =
      new Date(
        ano,
        mes,
        dia
      );

    const diaDaSemana =
      dataVerificacao.getDay();

    dataVerificacao.setHours(
      0,
      0,
      0,
      0
    );


    const hojeComparacao =
      new Date(
        dataHojeImutavel.getFullYear(),
        dataHojeImutavel.getMonth(),
        dataHojeImutavel.getDate()
      );


    // ==================================================
    // DIAS DESABILITADOS
    // ==================================================

    if (
      dataVerificacao < hojeComparacao ||
      diaDaSemana === 0
    ) {

      spanDia.classList.add(
        "dia-clicavel",
        "desabilitado"
      );

    } else {

      spanDia.classList.add(
        "dia-clicavel"
      );


      // ================================================
      // HOJE
      // ================================================

      if (
        dataVerificacao.getTime() ===
        hojeComparacao.getTime()
      ) {

        spanDia.classList.add(
          "hoje"
        );
      }


      // ================================================
      // SELECIONAR DIA
      // ================================================

      spanDia.addEventListener(
        "click",
        () => {

          document
            .querySelector(
              ".dia-clicavel.selecionado"
            )
            ?.classList.remove(
              "selecionado"
            );


          // Hoje não pode ser selecionado
          if (
            dataVerificacao.getTime() !==
            hojeComparacao.getTime()
          ) {

            spanDia.classList.add(
              "selecionado"
            );

            gerarHorariosDisponiveis(
              diaDaSemana
            );

          } else {

            wrapperHorarios.style.display =
              "none";

            horarioSelecionado =
              null;
          }


          console.log(
            `Dia selecionado: ${dia}/${mes + 1}/${ano}`
          );

        }
      );
    }

    containerDias.appendChild(
      spanDia
    );
  }
}


// ======================================================
// NAVEGAÇÃO DO CALENDÁRIO
// ======================================================

btnPrev?.addEventListener(
  "click",
  () => {

    if (
      dataAtual.getFullYear() >
        dataHojeImutavel.getFullYear() ||

      (
        dataAtual.getFullYear() ===
          dataHojeImutavel.getFullYear() &&

        dataAtual.getMonth() >
          dataHojeImutavel.getMonth()
      )
    ) {

      dataAtual.setMonth(
        dataAtual.getMonth() - 1
      );

      renderizarCalendario();
    }
  }
);


btnNext?.addEventListener(
  "click",
  () => {

    dataAtual.setMonth(
      dataAtual.getMonth() + 1
    );

    renderizarCalendario();
  }
);


// ======================================================
// HORÁRIOS
// ======================================================

const wrapperHorarios =
  document.getElementById(
    "wrapper-horarios"
  );

const containerListaHorarios =
  document.getElementById(
    "container-lista-horarios"
  );


// ======================================================
// GERAR HORÁRIOS
// ======================================================

function gerarHorariosDisponiveis(
  diaDaSemana
) {

  if (
    !containerListaHorarios ||
    !wrapperHorarios
  ) {
    return;
  }

  containerListaHorarios.innerHTML =
    "";

  wrapperHorarios.style.display =
    "block";

  horarioSelecionado =
    null;


  let horaInicio;
  let horaFim;


  // Sábado
  if (
    diaDaSemana === 6
  ) {

    horaInicio = 8;
    horaFim = 17;

  } else {

    horaInicio = 9;
    horaFim = 21;
  }


  // ====================================================
  // CRIAR HORÁRIOS
  // ====================================================

  for (
    let hora = horaInicio;
    hora < horaFim;
    hora++
  ) {

    for (
      let minutos = 0;
      minutos < 60;
      minutos += 45
    ) {

      // No sábado não cria horários após 16:00
      if (
        hora === horaFim - 1 &&
        minutos > 0 &&
        diaDaSemana === 6
      ) {
        continue;
      }


      const textoHora =
        String(hora).padStart(
          2,
          "0"
        );

      const textoMinutos =
        String(minutos).padStart(
          2,
          "0"
        );

      const horarioFormatado =
        `${textoHora}:${textoMinutos}`;


      const botaoHorario =
        document.createElement(
          "button"
        );

      botaoHorario.type =
        "button";

      botaoHorario.classList.add(
        "btn-horario"
      );

      botaoHorario.textContent =
        horarioFormatado;


      botaoHorario.addEventListener(
        "click",
        () => {

          document
            .querySelector(
              ".btn-horario.selecionado"
            )
            ?.classList.remove(
              "selecionado"
            );


          botaoHorario.classList.add(
            "selecionado"
          );

          horarioSelecionado =
            horarioFormatado;


          console.log(
            `Horário selecionado: ${horarioSelecionado}`
          );

        }
      );


      containerListaHorarios.appendChild(
        botaoHorario
      );
    }
  }
}