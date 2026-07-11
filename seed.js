// ============ CONFIGURAÇÃO SUPABASE ============
const SUPABASE_URL = 'https://cfqvfiquhtzzzfuubltf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_q1Ckt9CnEi7cJSzFsHPjug_TLc2kWwX';

// Verifica se o Supabase está disponível
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase não carregado! Adicione: <script src="https://unpkg.com/@supabase/supabase-js@2"></script>');
        return null;
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

const supabaseClient = initSupabase(); // Nome diferente: supabaseClient

// ============ BUSCAR DO BANCO ============
async function carregarBarbearias() {
    if (!supabaseClient) {
        console.error('❌ Supabase não inicializado');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('barbearias')
            .select('*')
            .eq('ativo', true);

        if (error) throw error;

        console.log('✅ TOTAL de barbearias carregadas:', data.length);
        
        // Log de cada barbearia com seus campos
        data.forEach(b => {
            console.log(`📋 ${b.nome}:`, {
                recomendada: b.recomendada,
                popular: b.popular,
                express_ativo: b.express_ativo
            });
        });

        const recomendados = data.filter(b => b.recomendada === true);
        const populares = data.filter(b => b.popular === true);
        const maisVisitados = [...data]
            .sort((a, b) => (b.total_avaliacoes || 0) - (a.total_avaliacoes || 0))
            .slice(5, 10)
            
        console.log('📊 Recomendados:', recomendados.length, recomendados.map(b => b.nome));
        console.log('📊 Populares:', populares.length, populares.map(b => b.nome));
        console.log('📊 Mais Visitados:', maisVisitados.length, maisVisitados.map(b => b.nome));

        renderizarCards(recomendados, 'cardsRecomendados', 'RECO1');
        renderizarCards(populares, 'cardsPopulares', 'POPU1');
        renderizarCards(maisVisitados, 'cardsMaisVisitados', 'MAVI1');

    } catch (error) {
        console.error('Erro:', error);
    }
}

function criarCard(barbearia, classeCard) {
    const nota = barbearia.avaliacao_media 
        ? parseFloat(barbearia.avaliacao_media).toFixed(1) 
        : '5.0';
    
    const fotoUrl = barbearia.foto_perfil || './img/default-barber.jpg';
    
    return `
        <div class="${classeCard}">
            <div class="foto-card" style="background-image: url('${fotoUrl}')">
                <div class="nota50">
                    <img src="./img/icon/estrela.svg">
                    <h5 class="H5nota">${nota}</h5>
                </div>
            </div>
            <div class="info-card">
                <h2 class="POPU01">${barbearia.nome}</h2>
                <h3 class="LOCAL01">${barbearia.endereco}, ${barbearia.numero}, ${barbearia.cidade}</h3>
                <button class="reservar-btn" onclick="btnReserva('${barbearia.id}')">Reservar</button>
            </div>
        </div>
    `;
}

function renderizarCards(barbearias, containerId, classeCard) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container #${containerId} não encontrado`);
        return;
    }
    
    if (barbearias.length === 0) {
        container.innerHTML = '<p style="color: white;">Nenhuma barbearia encontrada</p>';
        return;
    }
    
    container.innerHTML = barbearias
        .map(b => criarCard(b, classeCard))
        .join('');
}

// ============ INICIAR ============
document.addEventListener('DOMContentLoaded', carregarBarbearias);