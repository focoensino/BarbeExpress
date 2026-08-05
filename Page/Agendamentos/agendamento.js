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

async function carregarUsuarioLogado() {
  const cliente = window.supabaseClient;

  const nomeElemento =
    document.getElementById(
      "nome-do-perfil"
    );

  const fotoElemento =
    document.getElementById(
      "foto-do-perfil"
    );

  if (!cliente) {
    console.error(
      "Supabase não foi inicializado."
    );

    return;
  }

  try {
    const {
      data: { session },
      error: sessionError
    } =
      await cliente.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    /*
     * Caso não exista sessão, volta para
     * a página inicial.
     */
    if (!session?.user) {
      window.location.href =
        "../../index.html";

      return;
    }

    const usuario = session.user;

    /*
     * Dados padrão vindos da autenticação.
     */
    let nome =
      usuario.user_metadata?.nome ||
      usuario.email?.split("@")[0] ||
      "Usuário";

    let foto =
      usuario.user_metadata?.foto_perfil ||
      "../../img/logo/perfil.svg";

    /*
     * Busca dados atualizados na tabela
     * usuarios.
     */
    const {
      data: perfil,
      error: perfilError
    } =
      await cliente
        .from("usuarios")
        .select(
          "nome, foto_perfil"
        )
        .eq("id", usuario.id)
        .maybeSingle();

    if (perfilError) {
      console.warn(
        "Não foi possível buscar os dados do perfil:",
        perfilError
      );
    }

    if (perfil?.nome) {
      nome = perfil.nome;
    }

    if (perfil?.foto_perfil) {
      foto = perfil.foto_perfil;
    }

    if (nomeElemento) {
      nomeElemento.textContent =
        nome;
    }

    if (fotoElemento) {
      fotoElemento.src = foto;

      fotoElemento.alt =
        `Foto de ${nome}`;

      fotoElemento.addEventListener(
        "error",
        () => {
          fotoElemento.src =
            "../../img/logo/perfil.svg";
        },
        {
          once: true
        }
      );
    }
  } catch (erro) {
    console.error(
      "Erro ao recuperar usuário logado:",
      erro
    );

    window.location.href =
      "../../index.html";
  }
}

function observarSessao() {
  const cliente =
    window.supabaseClient;

  if (!cliente) {
    return;
  }

  cliente.auth.onAuthStateChange(
    (evento, session) => {
      if (
        evento === "SIGNED_OUT" ||
        !session
      ) {
        window.location.href =
          "../../index.html";
      }
    }
  );
}

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    async () => {
      await carregarUsuarioLogado();
      observarSessao();
    },
    {
      once: true
    }
  );
} else {
  carregarUsuarioLogado();
  observarSessao();
}