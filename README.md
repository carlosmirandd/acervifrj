# Portal Acadêmico IFRJ - Campus Niterói

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

> Portal acadêmico moderno e responsivo para o curso de Engenharia da Computação do IFRJ Campus Niterói, desenvolvido com HTML, CSS, JavaScript puro e Firebase.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração e Instalação](#configuração-e-instalação)
- [Deploy no Vercel](#deploy-no-vercel)
- [Uso do Painel Admin](#uso-do-painel-admin)
- [Estrutura do Firestore](#estrutura-do-firestore)
- [Customização](#customização)
- [Suporte](#suporte)

---

## 🎯 Sobre o Projeto

Este portal foi desenvolvido para centralizar informações essenciais do curso de Engenharia da Computação, facilitando o acesso a:

- Documentos institucionais (PPC, estrutura curricular)
- Notícias e avisos importantes
- Editais de estágio e processos seletivos
- Materiais acadêmicos organizados por categoria

### Diferenciais

✅ Design moderno e responsivo (2025)  
✅ Dark mode com detecção automática  
✅ Busca dinâmica em tempo real  
✅ Painel administrativo completo  
✅ Editor de texto rico integrado  
✅ 100% gratuito (Firebase + Vercel)  

---

## ⚡ Funcionalidades

### Portal Principal (`index.html`)

- **Hero Section** com busca e navegação rápida
- **Barra de Categorias** dinâmica
- **Posts Importantes** destacados
- **Posts Recentes** (últimos 4)
- **Busca em tempo real** por título e categoria
- **Dark mode** com persistência
- **Navegação suave** entre seções
- **Mobile-first** design responsivo

### Painel Administrativo (`admin.html`)

- **Autenticação** com Firebase Authentication
- **CRUD completo** de Posts
  - Editor de texto rico (Quill.js)
  - Upload de imagem (URL)
  - Categorização e autoria
  - Marcar como importante
  - Preview em tempo real
- **CRUD completo** de Categorias
- **CRUD completo** de Autores
- **Interface multi-abas** intuitiva
- **Proteção de rotas** (apenas autenticados)

---

## 🛠️ Tecnologias

### Frontend
- HTML5 (Semantic)
- CSS3 (Flexbox, Grid, Variáveis CSS)
- JavaScript ES6+ (puro, sem frameworks)
- Google Fonts (Poppins)

### Backend/Database
- Firebase Firestore (NoSQL Database)
- Firebase Authentication (Email/Password)

### Ferramentas
- Quill.js (Editor de texto rico)
- Git & GitHub (Versionamento)
- Vercel (Deploy e Hospedagem)

---

## 📁 Estrutura do Projeto

```
portal-academico-ifrj/
│
├── index.html          # Página principal do portal
├── style.css           # Estilos globais e responsivos
├── script.js           # Lógica do portal e Firebase
│
├── admin.html          # Painel administrativo
├── admin.js            # Lógica do admin e CRUD
│
├── README.md           # Este arquivo
├── FIREBASE-SETUP.md   # Guia de configuração Firebase
├── .gitignore          # Arquivos ignorados pelo Git
│
└── assets/             # (Opcional) Imagens locais
    └── logo.png
```

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- Conta no [Firebase](https://firebase.google.com/) (gratuita)
- Conta no [GitHub](https://github.com/) (gratuita)
- Conta no [Vercel](https://vercel.com/) (gratuita)
- Editor de código (VS Code recomendado)

### Passo 1: Clonar/Baixar o Projeto

```bash
# Opção 1: Clonar via Git
git clone https://github.com/seu-usuario/portal-academico-ifrj.git
cd portal-academico-ifrj

# Opção 2: Baixar ZIP e extrair
```

### Passo 2: Configurar Firebase

Consulte o arquivo **[FIREBASE-SETUP.md](./FIREBASE-SETUP.md)** para instruções detalhadas.

**Resumo:**

1. Criar projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ativar **Firestore Database**
3. Ativar **Authentication** (Email/Password)
4. Copiar credenciais do projeto
5. Colar em `script.js` e `admin.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

6. **Descomentar** as linhas de importação do Firebase nos arquivos JS

### Passo 3: Criar Usuário Admin

No Firebase Console:
1. Vá em **Authentication** > **Users**
2. Clique em **Add user**
3. Crie com email e senha (ex: `admin@ifrj.edu.br`)

### Passo 4: Testar Localmente

```bash
# Opção 1: Servidor local simples (Python)
python -m http.server 8000

# Opção 2: Live Server (VS Code Extension)
# Clique direito no index.html > "Open with Live Server"

# Acesse: http://localhost:8000
```

---

## 🌐 Deploy no Vercel

### Método 1: Via GitHub (Recomendado)

1. **Criar repositório no GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/portal-academico-ifrj.git
git push -u origin main
```

2. **Conectar no Vercel:**
   - Acesse [vercel.com](https://vercel.com/)
   - Clique em **New Project**
   - Importe seu repositório GitHub
   - Configure (deixe padrão para sites estáticos)
   - Clique em **Deploy**

3. **Pronto!** Seu site estará em: `https://seu-projeto.vercel.app`

### Método 2: Via CLI do Vercel

```bash
npm i -g vercel
vercel login
vercel
# Siga as instruções
```

### Configurações Adicionais no Vercel

- **Custom Domain:** Configure domínio próprio (opcional)
- **Environment Variables:** Não necessário (Firebase config está no código)
- **Build Settings:** Não necessário (site estático)

---

## 👨‍💼 Uso do Painel Admin

### Acesso

1. Acesse: `https://seu-site.vercel.app/admin.html`
2. Faça login com credenciais criadas no Firebase

### Modo Simulação (Teste sem Firebase)

**Credenciais temporárias:**
- Email: `admin@ifrj.edu.br`
- Senha: `admin123`

> ⚠️ **IMPORTANTE:** Remova o modo simulação ao conectar Firebase real!

### Gerenciar Posts

1. Clique na aba **Posts**
2. Clique em **+ Novo Post**
3. Preencha todos os campos:
   - Título
   - Categoria
   - Autor
   - Data de publicação
   - URL da imagem de capa
   - Conteúdo (use o editor rico)
   - Marque como "Importante" se necessário
4. Clique em **Salvar Post**

### Gerenciar Categorias

1. Clique na aba **Categorias**
2. Clique em **+ Nova Categoria**
3. Digite o nome
4. Salve

### Gerenciar Autores

Similar ao gerenciamento de categorias.

---

## 🗄️ Estrutura do Firestore

### Collections

#### `posts`
```javascript
{
  id: "auto-generated",
  title: "Título do Post",
  coverImageUrl: "https://...",
  publishedAt: Timestamp,
  isImportant: Boolean,
  categoryId: "ref-to-category",
  authorId: "ref-to-author",
  body: "<p>Conteúdo HTML...</p>"
}
```

#### `categories`
```javascript
{
  id: "auto-generated",
  name: "Nome da Categoria"
}
```

#### `authors`
```javascript
{
  id: "auto-generated",
  name: "Nome do Autor"
}
```

### Regras de Segurança (Firebase)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leitura pública
    match /{document=**} {
      allow read: if true;
    }
    
    // Escrita apenas autenticados
    match /posts/{postId} {
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow write: if request.auth != null;
    }
    match /authors/{authorId} {
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🎨 Customização

### Cores

Edite as variáveis CSS em `style.css`:

```css
:root {
  --primary-color: #0055aa;      /* Azul IFRJ */
  --secondary-color: #2062af;    /* Azul secundário */
  --accent-color: #f8ba23;       /* Amarelo destaque */
  /* ... */
}
```

### Fontes

Altere no `<head>` dos arquivos HTML:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte:wght@400;600;700&display=swap" rel="stylesheet">
```

E atualize em `style.css`:

```css
:root {
  --font-family: 'SuaFonte', sans-serif;
}
```

### Logo

Substitua o texto no `index.html`:

```html
<div class="logo">
  <h1><span class="logo-highlight">IFRJ</span> Portal</h1>
  <!-- OU use imagem: -->
  <!-- <img src="assets/logo.png" alt="Logo IFRJ"> -->
</div>
```

---

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1440px+)

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ Autenticação Firebase  
✅ Regras de segurança Firestore  
✅ Validação de formulários (frontend)  
✅ Proteção de rotas admin  
✅ HTTPS obrigatório (Vercel)  
✅ No-index para admin (`robots.txt`)  

### Recomendações Adicionais

- Use senhas fortes para contas admin
- Ative 2FA no Firebase Console
- Monitore logs de acesso
- Atualize dependências regularmente

---

## 🐛 Solução de Problemas

### Erro: "Firebase não inicializado"

**Solução:** Verifique se descomentou as linhas de importação e configuração do Firebase em `script.js` e `admin.js`.

### Posts não aparecem

**Solução:** 
1. Verifique conexão com Firebase no console (F12)
2. Confirme que há posts cadastrados no Firestore
3. Verifique regras de segurança do Firestore

### Dark mode não funciona

**Solução:** Limpe o cache do navegador ou teste em modo anônimo.

### Erro de CORS

**Solução:** Use um servidor local (não abra arquivos diretamente pelo navegador).

---

## 📚 Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Quill.js Docs](https://quilljs.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

- **Portal Original:** [acervif.webflow.io](https://acervif.webflow.io)
- **Redesign Moderno:** Desenvolvido para a comunidade IFRJ

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/portal-academico-ifrj/issues)
- **Email:** contato@exemplo.com
- **Campus:** IFRJ Campus Niterói

---

## ✨ Próximas Funcionalidades

- [ ] Sistema de comentários
- [ ] Busca avançada com filtros
- [ ] Notificações push
- [ ] Export de relatórios
- [ ] API REST para integrações
- [ ] PWA (Progressive Web App)

---

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

---

Feito com ❤️ para a comunidade acadêmica do IFRJ Campus Niterói