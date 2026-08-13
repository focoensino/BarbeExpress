// ==========================================
// AGENDAMENTOS DO USUÁRIO
// ==========================================

async function carregarMeusAgendamentos() {
  const container = document.getElementById(
    "container-agendamentos"
  );

  if (!container) return;

  container.innerHTML = `
    <p class="carregando">
      Carregando seus agendamentos...
    </p>
  `;

  const supabase =
    window.supabaseClient ||
    (typeof obterSupabase === "function"
      ? obterSupabase()
      : null);

  if (!supabase) {
    container.innerHTML = `
      <p class="erro">
        Erro ao conectar com o banco de dados.
      </p>
    `;
    return;
  }

  try {

    // ==========================================
    // 1. USUÁRIO LOGADO
    // ==========================================

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {

      container.innerHTML = `
        <p class="aviso">
          Você precisa estar logado para ver seus agendamentos.
        </p>
      `;

      return;
    }

    // ==========================================
    // 2. BUSCAR AGENDAMENTOS
    // ==========================================

    const {
      data: agendamentos,
      error
    } = await supabase
      .from("agendamentos")
      .select(`
        id,
        servico,
        preco,
        data,
        horario,
        status,

        barbearias!agendamentos_barbearia_id_fkey (
          id,
          nome,
          logo_url
        )
      `)
      .eq("usuario_id", user.id)
      .order("data", { ascending: false })
      .order("horario", { ascending: false });

    if (error) {

      console.error(
        "❌ Erro retornado pelo Supabase:",
        error
      );

      throw error;
    }

    console.log(
      "📅 Agendamentos encontrados:",
      agendamentos
    );

    // ==========================================
    // 3. NENHUM AGENDAMENTO
    // ==========================================

    if (!agendamentos || agendamentos.length === 0) {

      container.innerHTML = `
        <p class="vazio">
          Você ainda não possui nenhum agendamento registrado.
        </p>
      `;

      return;
    }

    // ==========================================
    // 4. RENDERIZAR
    // ==========================================

    container.innerHTML = agendamentos
      .map((item) => {

        const barbeariaInfo =
          Array.isArray(item.barbearias)
            ? item.barbearias[0]
            : item.barbearias;

        const nomeBarbearia =
          barbeariaInfo?.nome ||
          "Barbearia";

        const logoUrl =
          barbeariaInfo?.logo_url ||
          "../../img/logo/imagem7.svg";

        const horario =
          item.horario
            ? item.horario.substring(0, 5)
            : "--:--";

        const dataFormatada =
          item.data
            ? item.data.split("-").reverse().join("/")
            : "--/--/----";

        return `
          <div
            class="card-agendamento-item"
            id="agendamento-${item.id}"
          >

            <div class="info-barbearia">

              <img
                src="${logoUrl}"
                alt="${nomeBarbearia}"
                onerror="this.onerror=null; this.src='../../img/logo/imagem7.svg';"
              />

              <div>

                <h3>
                  ${nomeBarbearia}
                </h3>

                <p>
                  ${item.servico || "Serviço"}
                </p>

              </div>

            </div>

            <div class="info-data">

              <p>
                <strong>Data:</strong>
                ${dataFormatada}
              </p>

              <p>
                <strong>Horário:</strong>
                ${horario}
              </p>

              <span class="status ${item.status}">
                ${item.status}
              </span>

            </div>

          </div>
        `;
      })
      .join("");

  } catch (err) {

    console.error(
      "❌ Erro ao carregar a lista de agendamentos:",
      err
    );

    container.innerHTML = `
      <p class="erro">
        Ocorreu um erro ao carregar os agendamentos.
      </p>

      <button
        type="button"
        onclick="carregarMeusAgendamentos()"
      >
        Tentar Novamente
      </button>
    `;
  }
}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  carregarMeusAgendamentos
);