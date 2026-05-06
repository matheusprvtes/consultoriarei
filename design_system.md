# Design System: LP Assessoria - Agência REI

Este documento descreve o Design System e os Design Tokens utilizados no projeto da Landing Page de Assessoria "O Olhar do Furo".

## 🎨 Design Tokens (Variáveis CSS)

Todas as cores, tipografias e animações base estão definidas na raiz (`:root`) no arquivo `style.css`.

### Cores

*   **Background Principal (`--bg-primary`):** `#014CA7` (Azul Rei)
*   **Background Secundário/Alternativo (`--bg-alt`):** `#122865` (Azul Marinho Escuro)
*   **Texto Base (`--text-base`):** `#FFFFFF` (Branco)
*   **Cor de Destaque (`--color-accent`):** `#FFBC42` (Amarelo Dourado/Mostarda)
*   **Destaque Hover (`--color-accent-hover`):** `#e5a432` (Amarelo Escurecido)

### Tipografia

A fonte principal de todo o projeto é a **Poppins** (importada via Google Fonts).

*   **Família (`--font-regular`):** `'Poppins', sans-serif`
*   **Peso Regular (`--fw-regular`):** `400`
*   **Peso Bold (`--fw-bold`):** `700`
*   **Peso Black (`--fw-black`):** `900`

### Úteis

*   **Transição Padrão (`--transition`):** `all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

---

## 🅰️ Tipografia (Classes Utilitárias)

Utilize as seguintes classes para padronizar os títulos e textos ao longo da página:

*   `.headline-black`: Títulos hero e principais. Fonte `3.5rem` com peso `900`.
*   `.headline-bold`: Títulos de seções secundárias e formulário. Fonte `2.5rem` com peso `700`.
*   `.sub-headline`: Subtítulos ou textos de apoio com opacidade reduzida (`0.9`). Fonte `1.25rem`.
*   `.text-accent`: Aplica a cor amarela de destaque (`--color-accent`).
*   `.text-center`: Centraliza o texto.

---

## 📦 Layout e Containers

*   `.container`: Limitador máximo de largura da página (`1440px`), centralizado com padding nas laterais.
*   `.section-primary`: Fundo utilizando o background principal (`--bg-primary`).
*   `.section-alt`: Fundo utilizando o background secundário/escuro (`--bg-alt`).

---

## 🖱️ Botões

Os botões possuem transição suave, border-radius e efeitos de 'hover' que movimentam levemente no eixo Y.

*   `.btn`: Classe base universal para os botões.
*   `.btn-primary`: Botão principal com fundo amarelo (`--color-accent`) e texto escuro (`--bg-alt`). Inclui sombra.
*   `.btn-outline`: Botão transparente apenas com borda e texto amarelo (`--color-accent`).
*   `.btn-block`: Torna o botão largura total (`100%`).

---

## 💎 Componentes de UI

### Glassmorphism Card (`.glass-card`)

Utilizado para criar layouts com efeito de "vidro fosco", excelente para destacar blocos em cima de fundos gradientes ou cores primárias.
*   **Estilo Base:** Fundo translúcido branco com backdrop-filter (`blur(10px)`).
*   **Hover:** O card levanta ligeiramente e a borda recebe a cor de destaque (amarela).

### Inputs / Selects / Formulários

*   `.input-group`: Espaçamento em volta e agrupamento das labels e inputs.
*   **Inputs Text, Select, Textarea:** Fundo translúcido (`rgba(255, 255, 255, 0.05)`), bordas semitransparentes brancas e cantos arredondados (`8px`). Quando focados, a borda recebe a cor `--color-accent`.

### Efeito de Reveal (Animações de Scroll)

Existem classes que preparam os elementos para aparecerem gradualmente durante o scroll (ativado por JavaScript):
*   `.reveal`: Aparece de baixo para cima.
*   `.reveal-left`: Aparece vindo da esquerda para a direita.
*   `.reveal-right`: Aparece vindo da direita para a esquerda.
*   `.active`: Para ativar a visibilidade do elemento (adicionado por JS).
