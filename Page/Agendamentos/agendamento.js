// Oculta/Limpa dados da sidebar caso o usuário não possua agendamentos
function ocultarSidebarBarbearia() {
  const cardReserva = document.getElementById('card-reserva');
  const elNome = document.getElementById('barbearia-nome');
  const elEnd = document.getElementById('barbearia-endereco');
  const elSobre = document.getElementById('barbearia-sobre');
  const elTel1 = document.getElementById('barbearia-tel1');
  const elTel2 = document.getElementById('barbearia-tel2');
  const elLogo = document.getElementById('barbearia-logo');
  const elMapa = document.getElementById('barbearia-mapa');

  if (cardReserva) cardReserva.style.display = 'none';
  if (elNome) elNome.textContent = 'Nenhum agendamento ativo';
  if (elEnd) elEnd.textContent = 'Agende um serviço para ver as informações aqui.';
  if (elSobre) elSobre.textContent = 'Você ainda não possui agendamentos marcados.';
  if (elTel1) elTel1.textContent = '--';
  if (elTel2) elTel2.textContent = '--';
  if (elLogo) elLogo.src = '../../img/logo/imagem7.svg';
  if (elMapa) elMapa.src = '';
}

// Busca os agendamentos cadastrados para o usuário logado
// Oculta/Mostra a sidebar da barbearia
function gerenciarExibicaoSidebar(exibir) {
  const sidebar = document.getElementById('info-barbearia');
  if (!sidebar) return;

  if (exibir) {
    sidebar.classList.remove('oculto');
  } else {
    sidebar.classList.add('oculto');
  }
}

// Busca os agendamentos cadastrados para o usuário logado
async function carregarMeusAgendamentos() {
  const container = document.getElementById("container-agendamentos"); // Ajuste o ID do seu container de agendamentos
  if (!container) return;

  // Estado inicial visual
  container.innerHTML = `<p class="carregando">Carregando seus agendamentos...</p>`;

  const supabase = window.supabaseClient;

  if (!supabase) {
    container.innerHTML = `<p class="erro">Erro ao conectar com o banco de dados.</p>`;
    return;
  }

  try {
    // 1. Obtém o usuário direto da sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      container.innerHTML = `<p class="aviso">Você precisa estar logado para ver seus agendamentos.</p>`;
      return;
    }

    const userId = session.user.id;

    // 2. Tenta buscar os agendamentos com os dados da barbearia
    let { data: agendamentos, error } = await supabase
      .from("agendamentos")
      .select(`
        id,
        servico,
        preco,
        data,
        horario,
        status,
        barbearia:barbearia_id (
          nome,
          logo_url
        )
      `)
      .eq("usuario_id", userId)
      .order("data", { ascending: false });

    // Fallback: Se der erro na busca com join de barbearia, busca apenas os agendamentos simples
    if (error) {
      console.warn("⚠️ Falha ao buscar relacionamentos. Tentando busca simples na tabela agendamentos...", error);
      
      const buscaSimples = await supabase
        .from("agendamentos")
        .select("*")
        .eq("usuario_id", userId)
        .order("data", { ascending: false });

      if (buscaSimples.error) {
        throw buscaSimples.error;
      }
      
      agendamentos = buscaSimples.data;
    }

    // 3. Valida se existem registros
    if (!agendamentos || agendamentos.length === 0) {
      container.innerHTML = `<p class="vazio">Você ainda não tem agendamentos marcados.</p>`;
      return;
    }

    // 4. Renderiza a lista e remove o "Carregando"
    container.innerHTML = agendamentos.map((item) => {
      const barbeariaInfo = Array.isArray(item.barbearia) ? item.barbearia[0] : item.barbearia;
      const nomeBarbearia = barbeariaInfo?.nome || "Barbearia";
      const logoUrl = barbeariaInfo?.logo_url || "./img/logo/imagem7.svg";

      return `
        <div class="card-agendamento-item">
          <div class="info-barbearia">
            <img src="${logoUrl}" alt="${nomeBarbearia}" />
            <div>
              <h3>${nomeBarbearia}</h3>
              <p>${item.servico}</p>
            </div>
          </div>
          <div class="info-data">
            <p><strong>Data:</strong> ${item.data}</p>
            <p><strong>Horário:</strong> ${item.horario ? item.horario.substring(0, 5) : ""}</p>
            <span class="status ${item.status}">${item.status}</span>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("❌ Erro ao carregar a lista de agendamentos:", err);
    container.innerHTML = `
      <p class="erro">Ocorreu um erro ao carregar os agendamentos.</p>
      <button onclick="carregarMeusAgendamentos()">Tentar Novamente</button>
    `;
  }
}

// Inicia o carregamento assim que a página estiver pronta
document.addEventListener("DOMContentLoaded", carregarMeusAgendamentos);
async function carregarListaAgendamentos() {
  const container = document.getElementById("container-agendamentos"); // Ou o id do seu container
  if (!container) return;

  // Estado inicial
  container.innerHTML = `<p class="carregando">Carregando seus agendamentos...</p>`;

  const supabase = window.supabaseClient || (typeof obterSupabase === "function" ? obterSupabase() : null);

  if (!supabase) {
    container.innerHTML = `<p class="erro">Erro de conexão com o banco de dados.</p>`;
    return;
  }

  try {
    // 1. Obter usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      container.innerHTML = `<p class="aviso">Você precisa estar logado para ver seus agendamentos.</p>`;
      return;
    }

    // 2. Buscar agendamentos na tabela
    const { data: agendamentos, error } = await supabase
      .from("agendamentos")
      .select(`
        id,
        servico,
        preco,
        data,
        horario,
        status,
        barbearia:barbearia_id (
          nome,
          logo_url
        )
      `)
      .eq("usuario_id", user.id)
      .order("data", { ascending: false });

    if (error) {
      console.error("❌ Erro retornado pelo Supabase:", error);
      throw error;
    }

    // 3. Caso não haja agendamentos cadastrados
    if (!agendamentos || agendamentos.length === 0) {
      container.innerHTML = `<p class="vazio">Você ainda não possui nenhum agendamento registrado.</p>`;
      return;
    }

    // 4. Renderizar a lista de agendamentos na tela
    container.innerHTML = agendamentos.map((item) => {
      const barbeariaInfo = Array.isArray(item.barbearia) ? item.barbearia[0] : item.barbearia;
      const nomeBarbearia = barbeariaInfo?.nome || "Barbearia";
      const logoUrl = barbeariaInfo?.logo_url || "/img/logo/imagem7.svg";

      return `
        <div class="card-agendamento-item" id="agendamento-${item.id}">
          <div class="info-barbearia">
            <img src="${logoUrl}" alt="${nomeBarbearia}" />
            <div>
              <h3>${nomeBarbearia}</h3>
              <p>${item.servico}</p>
            </div>
          </div>
          <div class="info-data">
            <p><strong>Data:</strong> ${item.data}</p>
            <p><strong>Horário:</strong> ${item.horario ? item.horario.substring(0, 5) : ""}</p>
            <span class="status ${item.status}">${item.status}</span>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("❌ Erro ao carregar agendamentos:", err);
    container.innerHTML = `
      <p class="erro">Não foi possível carregar os agendamentos no momento.</p>
      <button onclick="carregarListaAgendamentos()">Tentar Novamente</button>
    `;
  }
}

// Iniciar ao carregar o documento
document.addEventListener("DOMContentLoaded", carregarListaAgendamentos);