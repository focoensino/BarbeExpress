// ========== LÓGICA DE BUSCA COM SUPABASE (buscar.js) ==========

async function realizarPesquisaNoBanco(termo) {
  if (typeof supabaseClient === 'undefined') {
    console.error('❌ supabaseClient não encontrado! Garanta que o script de configuração do Supabase foi importado antes deste.');
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('barbearias')
      .select('*')
      .eq('ativo', true)
      .ilike('nome', `%${termo}%`); 

    if (error) throw error;

    console.log(`✅ ${data.length} barbearias encontradas para o termo "${termo}"`);

    const titulo = document.getElementById("titulo-resultados");
    if (titulo) {
      titulo.textContent = termo ? `Resultados para "${termo}"` : "Digite para buscar barbearias";
    }

    if (typeof renderizarCards === 'function') {
      renderizarCards(data, 'cardsResultadoBusca', 'RECO1');
    } else {
      console.error('❌ Função renderizarCards não foi encontrada!');
    }

  } catch (error) {
    console.error('Erro ao realizar busca no Supabase:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inputBuscaDestino = document.querySelector(".buscBarb");
  const ehPaginaBusca = window.location.pathname.toLowerCase().includes("buscar.html");

  if (inputBuscaDestino && ehPaginaBusca) {
    const termoSalvo = localStorage.getItem("termoBusca");

    if (termoSalvo) {
      inputBuscaDestino.value = termoSalvo;
      localStorage.removeItem("termoBusca"); // Limpa o cache

      inputBuscaDestino.focus();
      const comprimentoTexto = inputBuscaDestino.value.length;
      inputBuscaDestino.setSelectionRange(comprimentoTexto, comprimentoTexto);

      realizarPesquisaNoBanco(termoSalvo);
    }

    inputBuscaDestino.addEventListener("input", (event) => {
      const novoTermo = event.target.value.trim();
      realizarPesquisaNoBanco(novoTermo);
    });
  }
});