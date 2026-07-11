// ===== MODAL =====
// Seleciona os elementos do DOM
const modal = document.querySelector('.modal-cancelar-agendamento');
const btnCancelarReserva = document.querySelector('.cancelar');
const btnFecharModal = document.querySelector('.fechar-modal');
const btnConfirmar = document.querySelector('.cancelar-agendamento');

// ===== FUNÇÕES =====

// Função para abrir o modal
function abrirModal() {
  modal.style.display = 'flex';
  // Impede o scroll da página enquanto o modal está aberto
  document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function fecharModal() {
  modal.style.display = 'none';
  // Restaura o scroll da página
  document.body.style.overflow = 'auto';
}

// Função para confirmar o cancelamento
function confirmarCancelamento() {
  // Mostra um alerta de confirmação (pode ser substituído por uma ação real)
  alert('Agendamento cancelado com sucesso!');
  fecharModal();
}

// ===== EVENT LISTENERS =====

// Abrir modal ao clicar no botão "Cancelar Reserva"
btnCancelarReserva.addEventListener('click', abrirModal);

// Fechar modal ao clicar no botão "Voltar"
btnFecharModal.addEventListener('click', fecharModal);

// Fechar modal ao clicar no botão "Confirma"
btnConfirmar.addEventListener('click', confirmarCancelamento);

// Fechar modal ao clicar fora do modal (no overlay)
modal.addEventListener('click', function(event) {
  // Verifica se o clique foi diretamente no modal (não em um filho)
  if (event.target === modal) {
    fecharModal();
  }
});

// Fechar modal ao pressionar a tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal.style.display === 'flex') {
    fecharModal();
  }
});

// ===== INICIALIZAÇÃO =====
// Garante que o modal comece oculto
modal.style.display = 'none';

// ===== COPIAR TELEFONE =====

const botoesCopiar = document.querySelectorAll('.btn-copiar');

botoesCopiar.forEach((botao) => {
  botao.addEventListener('click', () => {

    const numero = botao.parentElement.querySelector('span').textContent;

    navigator.clipboard.writeText(numero);

  });
});