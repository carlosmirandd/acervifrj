// script.js - Portal Acadêmico IFRJ Campus Niterói
// Firebase + JavaScript puro para renderização dinâmica

// ========================================
// CONFIGURAÇÃO DO FIREBASE
// ========================================
// IMPORTANTE: Substitua as credenciais abaixo pelas do seu projeto Firebase
// Acesse: https://console.firebase.google.com/
// Vá em: Project Settings > Your apps > Firebase SDK snippet > Config

const firebaseConfig = {
  apiKey: "AIzaSyB1sxAAtkZGIRRMI5wMhZXvNZsNF9yoH1c",
  authDomain: "acervifrj.firebaseapp.com",
  projectId: "acervifrj",
  storageBucket: "acervifrj.firebasestorage.app",
  messagingSenderId: "552950386573",
  appId: "1:552950386573:web:2761de2e72e40ae84fb7c4",
  measurementId: "G-SRCDMC1VKQ"
};

// Inicializar Firebase (descomente após adicionar suas credenciais)
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
// import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
// import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let allPosts = [];
let allCategories = [];
let allAuthors = [];

// ========================================
// ELEMENTOS DO DOM
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const categoriesList = document.getElementById('categories-list');
const importantPostsGrid = document.getElementById('important-posts-grid');
const recentPostsGrid = document.getElementById('recent-posts-grid');
const loadingOverlay = document.getElementById('loading-overlay');
const adminLink = document.getElementById('admin-link');

// ========================================
// DARK MODE
// ========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('.theme-icon').textContent = '☀️';
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ========================================
// MENU MOBILE
// ========================================
mobileMenuToggle.addEventListener('click', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('active');
  mobileMenuToggle.classList.toggle('active');
});

// ========================================
// LOADING OVERLAY
// ========================================
function showLoading() {
  loadingOverlay.style.display = 'flex';
}

function hideLoading() {
  loadingOverlay.style.display = 'none';
}

// ========================================
// FUNÇÕES DE BUSCA NO FIRESTORE
// ========================================

// Buscar Posts Recentes (últimos 4)
async function fetchRecentPosts() {
  try {
    // DESCOMENTAR APÓS CONFIGURAR FIREBASE:
    // const q = query(
    //   collection(db, 'posts'),
    //   orderBy('publishedAt', 'desc'),
    //   limit(4)
    // );
    // const querySnapshot = await getDocs(q);
    // const posts = [];
    // querySnapshot.forEach((doc) => {
    //   posts.push({ id: doc.id, ...doc.data() });
    // });
    // return posts;

    // DADOS DE EXEMPLO (remover após conectar Firebase):
    return [
      {
        id: '1',
        title: '💼 PROCESSO SELETIVO PARA O PROGRAMA DE ESTÁGIO DO CAMPUS NITERÓI',
        coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
        publishedAt: new Date('2025-06-28'),
        categoryId: 'cat1',
        authorId: 'author1',
        isImportant: false
      },
      {
        id: '2',
        title: 'Comunicação e Informação - Material de Apoio',
        coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
        publishedAt: new Date('2025-06-05'),
        categoryId: 'cat2',
        authorId: 'author1',
        isImportant: false
      },
      {
        id: '3',
        title: 'Horário das Aulas - 2025.2',
        coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
        publishedAt: new Date('2025-08-15'),
        categoryId: 'cat3',
        authorId: 'author1',
        isImportant: false
      },
      {
        id: '4',
        title: 'Calendário Acadêmico 2025',
        coverImageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80',
        publishedAt: new Date('2025-01-20'),
        categoryId: 'cat3',
        authorId: 'author1',
        isImportant: false
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar posts recentes:', error);
    return [];
  }
}

// Buscar Posts Importantes
async function fetchImportantPosts() {
  try {
    // DESCOMENTAR APÓS CONFIGURAR FIREBASE:
    // const q = query(
    //   collection(db, 'posts'),
    //   where('isImportant', '==', true),
    //   orderBy('publishedAt', 'desc')
    // );
    // const querySnapshot = await getDocs(q);
    // const posts = [];
    // querySnapshot.forEach((doc) => {
    //   posts.push({ id: doc.id, ...doc.data() });
    // });
    // return posts;

    // DADOS DE EXEMPLO (remover após conectar Firebase):
    return [
      {
        id: 'imp1',
        title: 'Computação - PPC e Documentos Importantes',
        coverImageUrl: 'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=400&q=80',
        publishedAt: new Date('2025-05-15'),
        categoryId: 'cat4',
        authorId: 'author1',
        isImportant: true
      },
      {
        id: 'imp2',
        title: 'Estrutura Curricular do Curso',
        coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
        publishedAt: new Date('2025-05-15'),
        categoryId: 'cat4',
        authorId: 'author1',
        isImportant: true
      },
      {
        id: 'imp3',
        title: 'Programa das Disciplinas',
        coverImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
        publishedAt: new Date('2025-05-15'),
        categoryId: 'cat4',
        authorId: 'author1',
        isImportant: true
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar posts importantes:', error);
    return [];
  }
}

// Buscar Categorias
async function fetchCategories() {
  try {
    // DESCOMENTAR APÓS CONFIGURAR FIREBASE:
    // const querySnapshot = await getDocs(collection(db, 'categories'));
    // const categories = [];
    // querySnapshot.forEach((doc) => {
    //   categories.push({ id: doc.id, ...doc.data() });
    // });
    // return categories;

    // DADOS DE EXEMPLO (remover após conectar Firebase):
    return [
      { id: 'cat1', name: 'Notícias' },
      { id: 'cat2', name: 'Ciclo Básico' },
      { id: 'cat3', name: 'Avisos' },
      { id: 'cat4', name: 'Institucional' },
      { id: 'cat5', name: 'Estágios' }
    ];
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Buscar Autores
async function fetchAuthors() {
  try {
    // DESCOMENTAR APÓS CONFIGURAR FIREBASE:
    // const querySnapshot = await getDocs(collection(db, 'authors'));
    // const authors = [];
    // querySnapshot.forEach((doc) => {
    //   authors.push({ id: doc.id, ...doc.data() });
    // });
    // return authors;

    // DADOS DE EXEMPLO (remover após conectar Firebase):
    return [
      { id: 'author1', name: 'Coordenação IFRJ' }
    ];
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    return [];
  }
}

// ========================================
// RENDERIZAÇÃO DOS CARDS
// ========================================

// Criar card de post
function createPostCard(post) {
  const category = allCategories.find(c => c.id === post.categoryId);
  const author = allAuthors.find(a => a.id === post.authorId);
  
  const publishedDate = post.publishedAt instanceof Date 
    ? post.publishedAt 
    : post.publishedAt?.toDate ? post.publishedAt.toDate() : new Date(post.publishedAt);
  
  const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return `
    <article class="post-card">
      <img 
        src="${post.coverImageUrl || 'https://via.placeholder.com/400x200?text=Sem+Imagem'}" 
        alt="${post.title}"
        class="post-cover"
        loading="lazy"
      >
      <div class="post-content">
        ${category ? `<span class="post-category">${category.name}</span>` : ''}
        <h3 class="post-title">${post.title}</h3>
        <p class="post-meta">
          ${author ? `Por ${author.name} • ` : ''}${formattedDate}
        </p>
      </div>
    </article>
  `;
}

// Renderizar posts recentes
function renderRecentPosts(posts) {
  if (!posts || posts.length === 0) {
    recentPostsGrid.innerHTML = '<p>Nenhum post recente encontrado.</p>';
    return;
  }
  
  recentPostsGrid.innerHTML = posts.map(post => createPostCard(post)).join('');
}

// Renderizar posts importantes
function renderImportantPosts(posts) {
  if (!posts || posts.length === 0) {
    importantPostsGrid.innerHTML = '<p>Nenhum documento importante no momento.</p>';
    return;
  }
  
  importantPostsGrid.innerHTML = posts.map(post => createPostCard(post)).join('');
}

// Renderizar categorias
function renderCategories(categories) {
  if (!categories || categories.length === 0) {
    categoriesList.innerHTML = '<p>Nenhuma categoria disponível.</p>';
    return;
  }
  
  categoriesList.innerHTML = categories.map(category => 
    `<button class="category-item" data-category="${category.id}">${category.name}</button>`
  ).join('');
  
  // Adicionar event listeners para filtro por categoria
  document.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
  });
}

// ========================================
// BUSCA E FILTROS
// ========================================

// Busca dinâmica
function performSearch(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  if (!normalizedSearch) {
    renderRecentPosts(allPosts.filter(p => !p.isImportant).slice(0, 4));
    return;
  }
  
  const filteredPosts = allPosts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(normalizedSearch);
    const category = allCategories.find(c => c.id === post.categoryId);
    const categoryMatch = category ? category.name.toLowerCase().includes(normalizedSearch) : false;
    return titleMatch || categoryMatch;
  });
  
  recentPostsGrid.innerHTML = filteredPosts.length > 0
    ? filteredPosts.map(post => createPostCard(post)).join('')
    : '<p>Nenhum resultado encontrado para sua busca.</p>';
}

// Filtro por categoria
function filterByCategory(categoryId) {
  const filteredPosts = allPosts.filter(post => post.categoryId === categoryId);
  
  recentPostsGrid.innerHTML = filteredPosts.length > 0
    ? filteredPosts.map(post => createPostCard(post)).join('')
    : '<p>Nenhum post nesta categoria.</p>';
}

// Event listeners para busca
searchButton.addEventListener('click', () => {
  performSearch(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch(searchInput.value);
  }
});

searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    renderRecentPosts(allPosts.filter(p => !p.isImportant).slice(0, 4));
  }
});

// ========================================
// ESTATÍSTICAS
// ========================================
function updateStats() {
  const totalPostsEl = document.getElementById('total-posts');
  const totalCategoriesEl = document.getElementById('total-categories');
  
  if (totalPostsEl) totalPostsEl.textContent = allPosts.length;
  if (totalCategoriesEl) totalCategoriesEl.textContent = allCategories.length;
}

// ========================================
// NAVEGAÇÃO SUAVE
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Atualizar link ativo no menu
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      this.classList.add('active');
    }
  });
});

// ========================================
// LINK PARA ADMIN
// ========================================
if (adminLink) {
  adminLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'admin.html';
  });
}

// ========================================
// INICIALIZAÇÃO
// ========================================
async function initApp() {
  showLoading();
  
  try {
    // Inicializar tema
    initTheme();
    
    // Buscar dados do Firestore
    const [categories, authors, recentPosts, importantPosts] = await Promise.all([
      fetchCategories(),
      fetchAuthors(),
      fetchRecentPosts(),
      fetchImportantPosts()
    ]);
    
    // Armazenar dados globalmente
    allCategories = categories;
    allAuthors = authors;
    allPosts = [...recentPosts, ...importantPosts];
    
    // Renderizar conteúdo
    renderCategories(categories);
    renderRecentPosts(recentPosts);
    renderImportantPosts(importantPosts);
    updateStats();
    
    console.log('✅ Portal inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar portal:', error);
    alert('Erro ao carregar dados. Por favor, recarregue a página.');
  } finally {
    hideLoading();
  }
}

// Iniciar aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ========================================
// EXPORTAR FUNÇÕES (para uso em admin.js)
// ========================================
window.portalApp = {
  showLoading,
  hideLoading,
  fetchCategories,
  fetchAuthors
};
