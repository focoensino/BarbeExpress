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
let perfilHeaderIniciado = false;
let assinaturaAuth = null;

function iniciarPerfilQuandoDisponivel() {
  if (perfilHeaderIniciado) {
    return;
  }

  const areaPerfil =
    document.getElementById(
      "area-perfil"
    );

  const cliente =
    window.supabaseClient;

  if (!areaPerfil) {
    return;
  }

  if (!cliente) {
    console.error(
      "supabaseClient não encontrado no perfil-header.js."
    );

    if (
      typeof mostrarDeslogado ===
      "function"
    ) {
      mostrarDeslogado();
    }

    return;
  }

  perfilHeaderIniciado = true;

  if (
    typeof registrarEventos ===
    "function"
  ) {
    registrarEventos();
  }

  verificarLogin();

  const { data } =
    cliente.auth.onAuthStateChange(
      (_evento, session) => {
        setTimeout(() => {
          if (session?.user) {
            verificarLogin();
          } else if (
            typeof mostrarDeslogado ===
            "function"
          ) {
            mostrarDeslogado();
          }
        }, 0);
      }
    );

  assinaturaAuth =
    data?.subscription ?? null;
}

document.addEventListener(
  "components:loaded",
  iniciarPerfilQuandoDisponivel
);

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    iniciarPerfilQuandoDisponivel,
    {
      once: true
    }
  );
} else {
  iniciarPerfilQuandoDisponivel();
}