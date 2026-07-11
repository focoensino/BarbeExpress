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

