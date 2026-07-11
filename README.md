# BarbeExpress
Link do projeto no Figma:
https://www.figma.com/design/Cixv3HCe7j31eMCvvbGz26/barber-jv?node-id=1-8&p=f

## 📌 Boas práticas para programar em equipe

Essas instruções servem para que todos os desenvolvedores consigam entender o projeto facilmente, evitar conflitos no código e manter o sistema organizado.

---

# 🚀 COMO USAR O GIT

## 1. Clonar o projeto

Abra o terminal do VS Code e digite:


```bash
git clone https://github.com/focoensino/BarbeExpress.git
```

---

# ⚠️ ANTES DE COMEÇAR A PROGRAMAR

Sempre atualize o projeto antes de mexer em qualquer arquivo.

No terminal digite:

```bash
git pull
```

Isso baixa as alterações feitas pelos outros desenvolvedores.

---

# ✅ DEPOIS DE TERMINAR SUAS ALTERAÇÕES

## 1. Adicionar arquivos modificados

```bash
git add .
```

---

## 2. Criar um commit

```bash
git commit -m "descrição do que foi alterado"
```

### Exemplos:

```bash
git commit -m "criação da tela de login"
```

```bash
git commit -m "ajuste no responsivo da Home"
```

```bash
git commit -m "correção do menu lateral"
```


---

## 3. Enviar para o GitHub

```bash
git push
```

---

# 📂 ORGANIZAÇÃO DAS PASTAS

A estrutura do projeto deve ser organizada e fácil de entender.

## Exemplo:

```txt
BarbeExpress/
│
├── index.html
├── style.css
├── script.js
│
├── img/
│   ├── logo/
│   ├── icon/
│   └── banner/
│
├── css/
│   ├── home.css
│   ├── login.css
│   └── perfil.css
│
├── js/
│   ├── home.js
│   ├── login.js
│   └── api.js
│
└── pages/
    ├── login.html
    ├── perfil.html
    └── agenda.html
```

---

# 🧠 PADRONIZAÇÃO DO CÓDIGO

Todos devem seguir o mesmo padrão de escrita.

Isso deixa o código bonito, organizado e fácil de entender.

---

# ✍️ COMENTÁRIOS NO CÓDIGO

Todo código importante deve possuir comentários.

## CSS

```css
/* cores do sistema */
:root {
  --primary-purple: #003CFF;
}
```

---

## HTML

```html
<!-- topo do site -->
<header class="topo">
</header>
```

---

## JavaScript

```javascript
// busca dados do usuário
buscarUsuario();
```

---

# 🎨 PADRÃO CSS

## ✅ SEMPRE usar variáveis

Nunca colocar cores ou fontes soltas no código.

❌ ERRADO:

```css
color: blue;
font-size: 14px;
```

✅ CERTO:

```css
color: var(--primary-purple);
font-size: var(--font-size-14);
```

---

# 🧱 ORGANIZAÇÃO DO CSS

## Ordem recomendada:

```css
.elemento {
  /* posicionamento */
  display: flex;
  align-items: center;

  /* tamanho */
  width: 100%;
  height: 50px;

  /* aparência */
  background-color: var(--primary-purple);
  border-radius: 10px;

  /* texto */
  color: var(--white);
  font-size: var(--font-size-14);
}
```

---

# 📱 RESPONSIVIDADE

Todo componente deve funcionar no celular.

Sempre criar media query quando necessário.

## Exemplo:

```css
@media (max-width: 600px) {

}
```

---

# 🏷️ NOMES DE CLASSES E IDS

Os nomes devem fazer sentido.

❌ ERRADO:

```css
.div1
.caixa2
```

✅ CERTO:

```css
.topo
.card_usuario
.botao_login
```

---

# 🧹 CÓDIGO LIMPO

## NÃO FAZER:

* códigos mortos
* funções sem uso
* console.log esquecidos
* arquivos abandonados
* códigos duplicados

---

# 📏 INDENTAÇÃO

Sempre usar indentação correta.

## HTML

```html
<div>
  <h1>Título</h1>
</div>
```

---

## CSS

```css
.topo {
  display: flex;
}
```

---

## JavaScript

```javascript
if (usuario) {
  entrar();
}
```

---

# 🧩 COMPONENTES

Se uma parte do site se repete, ela deve virar componente ou arquivo separado.

## Exemplo:

* header
* menu
* footer
* modal
* card de usuário

---

# 🧠 COMO ESCREVER O CÓDIGO

O objetivo é:

> qualquer pessoa conseguir abrir o projeto e entender o que está acontecendo.

Se precisar explicar muito o código, provavelmente ele está confuso.

---

# 🔥 BOAS PRÁTICAS IMPORTANTES

## ✅ Sempre:

* comentar partes importantes
* usar nomes claros
* organizar pastas
* separar CSS/JS
* manter padrão visual
* atualizar o projeto antes de programar
* testar no celular
* fazer commits organizados

---

# ❌ EVITAR

* arquivos gigantes
* misturar HTML + CSS + JS no mesmo arquivo
* nomes sem sentido
* mexer no código dos outros sem necessidade
* apagar código sem avisar
* subir código quebrado

---

# 📌 EXEMPLO DE ESTRUTURA HTML

```html
<body>

  <!-- topo -->
  <header class="topo">

  </header>

  <!-- conteúdo principal -->
  <main>

  </main>

  <!-- rodapé -->
  <footer>

  </footer>

</body>
```

---

# 📌 EXEMPLO DE ESTRUTURA CSS

```css
/* variáveis */
:root {

}

/* reset */
* {

}

/* body */
body {

}

/* topo */
.topo {

}

/* conteúdo */
main {

}

/* responsividade */
@media (max-width: 600px) {

}
```

---

# 💬 COMUNICAÇÃO ENTRE A EQUIPE

Antes de alterar algo grande:

* avisar no grupo
* explicar o que vai fazer
* evitar duas pessoas mexendo no mesmo arquivo
* combinar padrões

---

# ✅ OBJETIVO FINAL

O projeto deve ser:

* fácil de entender
* fácil de manter
* bonito visualmente
* organizado
* profissional
* escalável

---

# 📌 REGRA MAIS IMPORTANTE

> "Escreva código como se outra pessoa fosse continuar o projeto amanhã."
