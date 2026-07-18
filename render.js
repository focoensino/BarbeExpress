/**
 * Busca e injeta os componentes HTML dinamicamente no navegador.
 */
async function loadComponents() {
  // 1. Procura todos os elementos com o atributo data-component
  const elements = document.querySelectorAll('[data-component]');

  for (const element of elements) {
    const componentName = element.getAttribute('data-component');
    
    // Caminho voltando duas pastas para acessar a raiz e entrar em /Components/
    const componentUrl = `../../Components/${componentName}.html`;

    try {
      // 2. Faz a requisição para pegar o HTML do componente
      const response = await fetch(componentUrl);

      if (!response.ok) {
        throw new Error(`Erro ao carregar o componente: ${response.statusText}`);
      }

      const componentHtml = await response.text();

      // 3. Injeta o HTML recebido dentro da tag original
      element.innerHTML = componentHtml;
      console.log(`✓ Componente [${componentName}] carregado com sucesso.`);

    } catch (error) {
      console.error(`⚠ Não foi possível carregar o componente [${componentName}]:`, error);
    }
  }
}

// Executa a função assim que a página terminar de carregar o HTML estrutural
document.addEventListener('DOMContentLoaded', loadComponents);
