document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalBarbeiro');
  const btnAbrirModal = document.querySelector('.EntrarBarbei');
  const btnFecharModal = document.getElementById('btnFecharModal');
  const formCadastro = document.getElementById('formCadastroBarbeiro');

  if (btnAbrirModal) {
    btnAbrirModal.addEventListener('click', () => modal.showModal());
  }

  if (btnFecharModal) {
    btnFecharModal.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (event) => {
    const dimensoes = modal.getBoundingClientRect();
    if (
      event.clientX < dimensoes.left ||
      event.clientX > dimensoes.right ||
      event.clientY < dimensoes.top ||
      event.clientY > dimensoes.bottom
    ) {
      modal.close();
    }
  });

  // Envio do formulário de cadastro do usuário
  formCadastro.addEventListener('submit', (event) => {
    event.preventDefault();

    const usuarioBarbeiro = {
      nome: document.getElementById('nomeBarbeiro').value.trim(),
      email: document.getElementById('emailBarbeiro').value.trim(),
      telefone: document.getElementById('telefoneBarbeiro').value.trim(),
      senha: document.getElementById('senhaBarbeiro').value,
    };

    if (usuarioBarbeiro.senha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    // Salva os dados do usuário no localStorage
    localStorage.setItem('barbeiroConta', JSON.stringify(usuarioBarbeiro));

    alert('Conta criada com sucesso! Agora vamos cadastrar a sua barbearia.');

    formCadastro.reset();
    modal.close();

    window.location.href = './BarbeiroJob/barbeirojob.html';
  });
});