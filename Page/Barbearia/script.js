const containerReserva = document.querySelector('.container-reserva');
const botaoFechar = document.querySelector('.botao-fechar-container-reserva');
const mesAnoTexto = document.getElementById('mes-ano-texto');
const containerDias = document.getElementById('container-dias');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

const mesesDoAno = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let dataAtual = new Date(); 
const dataHojeImutavel = new Date(); 

function Reservar() {
  containerReserva.classList.add('ativo');
  renderizarCalendario();
}

botaoFechar.addEventListener('click', () => {
  containerReserva.classList.remove('ativo');
});
// ======================================================
// HEADER DO USUÁRIO
// ======================================================

async function carregarHeaderUsuario() {
  const nomePerfil =
    document.getElementById("nomeperfil");

  const menuNome =
    document.getElementById("menu-nome-header");

  const menuEmail =
    document.getElementById("menu-email-header");

  const fotoPerfil =
    document.getElementById("foto-perfil-header");

  const botaoPerfil =
    document.getElementById("botao-perfil-header");

  const botaoAgendamentos =
    document.getElementById("btn-agendamentos-header");

  if (!nomePerfil || !botaoPerfil) {
    return;
  }

  try {
    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();

    if (error) {
      throw error;
    }

    // Usuário não está logado
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

    // Busca o perfil salvo na tabela usuarios
    const { data: perfil, error: perfilError } =
      await supabaseClient
        .from("usuarios")
        .select("nome, email, foto_perfil")
        .eq("id", user.id)
        .maybeSingle();

    if (perfilError) {
      console.error(
        "Erro ao buscar perfil:",
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

    nomePerfil.textContent = nomeUsuario;

    if (menuNome) {
      menuNome.textContent = nomeUsuario;
    }

    if (menuEmail) {
      menuEmail.textContent = emailUsuario;
    }

    if (perfil?.foto_perfil && fotoPerfil) {
      fotoPerfil.src = perfil.foto_perfil;
    }

    if (botaoAgendamentos) {
      botaoAgendamentos.style.display = "flex";
    }
  } catch (error) {
    console.error(
      "Erro ao carregar usuário no header:",
      error
    );

    nomePerfil.textContent = "Entrar";
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

  botaoAgendamentos?.addEventListener(
    "click",
    () => {
      window.location.href =
        "/Page/Agendamentos/agendamentos.html";
    }
  );

  botaoPerfil?.addEventListener(
    "click",
    async (event) => {
      event.stopPropagation();

      const {
        data: { user }
      } = await supabaseClient.auth.getUser();

      // Caso não esteja logado, volta para a página de login
      if (!user) {
        window.location.href = "/index.html";
        return;
      }

      if (menu) {
        menu.hidden = !menu.hidden;
      }
    }
  );

  botaoSair?.addEventListener(
    "click",
    async () => {
      try {
        const { error } =
          await supabaseClient.auth.signOut();

        if (error) {
          throw error;
        }

        window.location.href = "/index.html";
      } catch (error) {
        console.error(
          "Erro ao sair:",
          error
        );

        alert(
          "Não foi possível sair da conta."
        );
      }
    }
  );

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


// Atualiza o header automaticamente após login ou logout
supabaseClient.auth.onAuthStateChange(
  () => {
    setTimeout(() => {
      carregarHeaderUsuario();
    }, 0);
  }
);

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  mesAnoTexto.textContent = `${mesesDoAno[mes]} ${ano}`;

  const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay();

  const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

  containerDias.innerHTML = "";

  if (ano === dataHojeImutavel.getFullYear() && mes === dataHojeImutavel.getMonth()) {
    btnPrev.disabled = true;
    btnPrev.style.opacity = "0.3";
    btnPrev.style.cursor = "not-allowed";
  } else {
    btnPrev.disabled = false;
    btnPrev.style.opacity = "1";
    btnPrev.style.cursor = "pointer";
  }

  for (let i = 0; i < primeiroDiaDaSemana; i++) {
    const spanVazio = document.createElement('span');
    containerDias.appendChild(spanVazio);
  }

  for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
    const spanDia = document.createElement('span');
    spanDia.textContent = dia;

    const dataVerificacao = new Date(ano, mes, dia);

    dataVerificacao.setHours(0,0,0,0);
    const hojeComparacao = new Date(dataHojeImutavel.getFullYear(), dataHojeImutavel.getMonth(), dataHojeImutavel.getDate());


    if (dataVerificacao < hojeComparacao) {
      spanDia.classList.add('dia-clicavel', 'desabilitado');
    } else {
      spanDia.classList.add('dia-clicavel');

      if (dataVerificacao.getTime() === hojeComparacao.getTime()) {
        spanDia.classList.add('hoje');
      }

      spanDia.addEventListener('click', () => {
        document.querySelector('.dia-clicavel.selecionado')?.classList.remove('selecionado');
        
        if (dataVerificacao.getTime() !== hojeComparacao.getTime()) {
          spanDia.classList.add('selecionado');
        }

        console.log(`Dia selecionado para o agendamento: ${dia}/${mes + 1}/${ano}`);
      });
    }

    containerDias.appendChild(spanDia);
  }
}

btnPrev.addEventListener('click', () => {
  if (dataAtual.getFullYear() > dataHojeImutavel.getFullYear() || dataAtual.getMonth() > dataHojeImutavel.getMonth()) {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizarCalendario();
  }
});

btnNext.addEventListener('click', () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderizarCalendario();
});

const wrapperHorarios = document.getElementById('wrapper-horarios');
const containerListaHorarios = document.getElementById('container-lista-horarios');

let horarioSelecionado = null;

function renderizarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  mesAnoTexto.textContent = `${mesesDoAno[mes]} ${ano}`;

  const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay();
  const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

  containerDias.innerHTML = "";

  wrapperHorarios.style.display = "none";

  if (ano === dataHojeImutavel.getFullYear() && mes === dataHojeImutavel.getMonth()) {
    btnPrev.disabled = true;
    btnPrev.style.opacity = "0.3";
    btnPrev.style.cursor = "not-allowed";
  } else {
    btnPrev.disabled = false;
    btnPrev.style.opacity = "1";
    btnPrev.style.cursor = "pointer";
  }

  for (let i = 0; i < primeiroDiaDaSemana; i++) {
    const spanVazio = document.createElement('span');
    containerDias.appendChild(spanVazio);
  }

  for (let dia = 1; dia <= ultimoDiaDoMes; dia++) {
    const spanDia = document.createElement('span');
    spanDia.textContent = dia;

    const dataVerificacao = new Date(ano, mes, dia);
    const diaDaSemana = dataVerificacao.getDay();

    dataVerificacao.setHours(0,0,0,0);
    const hojeComparacao = new Date(dataHojeImutavel.getFullYear(), dataHojeImutavel.getMonth(), dataHojeImutavel.getDate());

    if (dataVerificacao < hojeComparacao || diaDaSemana === 0) {
      spanDia.classList.add('dia-clicavel', 'desabilitado');
    } else {
      spanDia.classList.add('dia-clicavel');

      if (dataVerificacao.getTime() === hojeComparacao.getTime()) {
        spanDia.classList.add('hoje');
      }

      spanDia.addEventListener('click', () => {
        document.querySelector('.dia-clicavel.selecionado')?.classList.remove('selecionado');
        
        if (dataVerificacao.getTime() !== hojeComparacao.getTime()) {
          spanDia.classList.add('selecionado');
        }

        gerarHorariosDisponiveis(diaDaSemana);
        console.log(`Dia selecionado: ${dia}/${mes + 1}/${ano} (Dia da semana: ${diaDaSemana})`);
      });
    }

    containerDias.appendChild(spanDia);
  }
}

function gerarHorariosDisponiveis(diaDaSemana) {
  containerListaHorarios.innerHTML = ""; 
  wrapperHorarios.style.display = "block"; 

  let horaInicio, horaFim;

  if (diaDaSemana === 6) {
    horaInicio = 8;
    horaFim = 17;
  } 
  else {
    horaInicio = 9;
    horaFim = 21;
  }

  for (let hora = horaInicio; hora < horaFim; hora++) {
    for (let minutos = 0; minutos < 60; minutos += 45) {
      
      if (hora === horaFim - 1 && minutos > 0 && diaDaSemana === 6) continue;

      const textoHora = String(hora).padStart(2, '0');
      const textoMinutos = String(minutos).padStart(2, '0');
      const horarioFormatado = `${textoHora}:${textoMinutos}`;

      const botaoHorario = document.createElement('button');
      botaoHorario.classList.add('btn-horario');
      botaoHorario.textContent = horarioFormatado;

      botaoHorario.addEventListener('click', () => {
        document.querySelector('.btn-horario.selecionado')?.classList.remove('selecionado');
        botaoHorario.classList.add('selecionado');
        horarioSelecionado = horarioFormatado;
        console.log(`Horário selecionado: ${horarioSelecionado}`);
      });

      containerListaHorarios.appendChild(botaoHorario);
    }
  }
}
