// script.js - Portal Acadêmico IFRJ Campus Niterói
import { app, db } from './firebase-config.js';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
    const q = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc'),
      limit(4)
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts recentes:', error);
    return [];
  }
}

// Buscar Posts Importantes
async function fetchImportantPosts() {
  try {
    const q = query(
      collection(db, 'posts'),
      where('isImportant', '==', true),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts importantes:', error);
    return [];
  }
}

// Buscar Categorias
async function fetchCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Buscar Autores
async function fetchAuthors() {
  try {
    const querySnapshot = await getDocs(collection(db, 'authors'));
    const authors = [];
    querySnapshot.forEach((doc) => {
      authors.push({ id: doc.id, ...doc.data() });
    });
    return authors;
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    return [];
  }
}

// ========================================
// RENDERIZAÇÃO DOS CARDS
// ========================================
function createPostCard(post) {
  const category = allCategories.find(c => c.id === post.categoryId);
  const author = allAuthors.find(a => a.id === post.authorId);
  
  const publishedDate = post.publishedAt.toDate();
  const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return `
    <a href="post.html?id=${post.id}" class="post-card-link">
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
    </a>
  `;
}

function renderRecentPosts(posts) {
  if (!posts || posts.length === 0) {
    recentPostsGrid.innerHTML = '<p>Nenhum post recente encontrado.</p>';
    return;
  }
  recentPostsGrid.innerHTML = posts.map(createPostCard).join('');
}

function renderImportantPosts(posts) {
  if (!posts || posts.length === 0) {
    importantPostsGrid.innerHTML = '<p>Nenhum documento importante no momento.</p>';
    return;
  }
  importantPostsGrid.innerHTML = posts.map(createPostCard).join('');
}

function renderCategories(categories) {
  if (!categories || categories.length === 0) {
    categoriesList.innerHTML = '<p>Nenhuma categoria disponível.</p>';
    return;
  }
  
  categoriesList.innerHTML = categories.map(category => 
    `<button class="category-item" data-category="${category.id}">${category.name}</button>`
  ).join('');
  
  document.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
  });
}

// ========================================
// BUSCA E FILTROS
// ========================================
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
    ? filteredPosts.map(createPostCard).join('')
    : '<p>Nenhum resultado encontrado para sua busca.</p>';
}

function filterByCategory(categoryId) {
  const filteredPosts = allPosts.filter(post => post.categoryId === categoryId);
  
  recentPostsGrid.innerHTML = filteredPosts.length > 0
    ? filteredPosts.map(createPostCard).join('')
    : '<p>Nenhum post nesta categoria.</p>';
}

searchButton.addEventListener('click', () => performSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch(searchInput.value);
});
searchInput.addEventListener('input', () => {
  if (searchInput.value === '') {
    renderRecentPosts(allPosts.filter(p => !p.isImportant).slice(0, 4));
  }
});

// ========================================
// INICIALIZAÇÃO
// ========================================
async function initApp() {
  showLoading();
  initTheme();
  
  try {
    const [categories, authors, recentPosts, importantPosts] = await Promise.all([
      fetchCategories(),
      fetchAuthors(),
      fetchRecentPosts(),
      fetchImportantPosts()
    ]);
    
    allCategories = categories;
    allAuthors = authors;
    allPosts = [...recentPosts, ...importantPosts];
    
    renderCategories(categories);
    renderRecentPosts(recentPosts);
    renderImportantPosts(importantPosts);
    
    console.log('✅ Portal inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar portal:', error);
    alert('Erro ao carregar dados. Verifique a configuração do Firebase e recarregue a página.');
  } finally {
    hideLoading();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
