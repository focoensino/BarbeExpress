async function verificarLogin() {
  const cliente =
    window.supabaseClient;

  if (!cliente) {
    console.error(
      "supabaseClient não encontrado."
    );

    mostrarDeslogado();
    return;
  }

  try {
    const {
      data: { session },
      error
    } =
      await cliente.auth.getSession();

    if (error) {
      console.error(
        "Erro ao recuperar sessão:",
        error
      );
    }

    if (!session?.user) {
      mostrarDeslogado();
      return;
    }

    const perfil =
      await buscarPerfil(
        session.user
      );

    mostrarLogado(perfil);
  } catch (erro) {
    console.error(
      "Erro ao verificar login:",
      erro
    );

    mostrarDeslogado();
  }
}

function iniciarPerfilQuandoDisponivel() {
  const areaPerfil =
    document.getElementById(
      "area-perfil"
    );

  if (!areaPerfil) {
    return;
  }

  registrarEventos();
  verificarLogin();

  window.supabaseClient.auth
    .onAuthStateChange(
      (_evento, session) => {
        setTimeout(() => {
          if (session?.user) {
            verificarLogin();
          } else {
            mostrarDeslogado();
          }
        }, 0);
      }
    );
}

document.addEventListener(
  "components:loaded",
  iniciarPerfilQuandoDisponivel
);

if (
  document.getElementById(
    "area-perfil"
  )
) {
  iniciarPerfilQuandoDisponivel();
}