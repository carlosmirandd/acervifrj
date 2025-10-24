// admin.js - Painel Administrativo - Portal Acadêmico IFRJ
// Firebase Authentication + Firestore CRUD completo

// ========================================
// CONFIGURAÇÃO DO FIREBASE
// ========================================
// IMPORTANTE: Use as mesmas credenciais do script.js

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Descomentar após configurar Firebase
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
// import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
// import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================
let currentUser = null;
let quillEditor = null;
let editingPostId = null;
let editingCategoryId = null;
let editingAuthorId = null;
let allPosts = [];
let allCategories = [];
let allAuthors = [];

// ========================================
// ELEMENTOS DO DOM
// ========================================
const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const loading = document.getElementById('loading');

// Tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Posts
const newPostBtn = document.getElementById('newPostBtn');
const postFormCard = document.getElementById('postFormCard');
const postForm = document.getElementById('postForm');
const postsTableBody = document.getElementById('postsTableBody');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const cancelPostBtn2 = document.getElementById('cancelPostBtn2');
const postImage = document.getElementById('postImage');
const imagePreview = document.getElementById('imagePreview');

// Categories
const newCategoryBtn = document.getElementById('newCategoryBtn');
const categoryFormCard = document.getElementById('categoryFormCard');
const categoryForm = document.getElementById('categoryForm');
const categoriesTableBody = document.getElementById('categoriesTableBody');
const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
const cancelCategoryBtn2 = document.getElementById('cancelCategoryBtn2');

// Authors
const newAuthorBtn = document.getElementById('newAuthorBtn');
const authorFormCard = document.getElementById('authorFormCard');
const authorForm = document.getElementById('authorForm');
const authorsTableBody = document.getElementById('authorsTableBody');
const cancelAuthorBtn = document.getElementById('cancelAuthorBtn');
const cancelAuthorBtn2 = document.getElementById('cancelAuthorBtn2');

// ========================================
// FUNÇÕES DE LOADING
// ========================================
function showLoading() {
  loading.style.display = 'flex';
}

function hideLoading() {
  loading.style.display = 'none';
}

// ========================================
// AUTENTICAÇÃO
// ========================================

// Verificar estado de autenticação
function checkAuth() {
  // Simulação - remover após conectar Firebase
  // DESCOMENTAR após configurar Firebase:
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     currentUser = user;
  //     showAdminPanel();
  //   } else {
  //     showLoginPage();
  //   }
  // });
  
  // Temporário - para testar sem Firebase
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (isLoggedIn === 'true') {
    currentUser = { email: 'admin@ifrj.edu.br' };
    showAdminPanel();
  } else {
    showLoginPage();
  }
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  showLoading();
  loginError.classList.add('hidden');
  
  try {
    // DESCOMENTAR após configurar Firebase:
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // currentUser = userCredential.user;
    
    // Temporário - simulação
    if (email === 'admin@ifrj.edu.br' && password === 'admin123') {
      currentUser = { email };
      localStorage.setItem('adminLoggedIn', 'true');
      showAdminPanel();
    } else {
      throw new Error('Credenciais inválidas');
    }
  } catch (error) {
    loginError.textContent = 'Erro ao fazer login. Verifique suas credenciais.';
    loginError.classList.remove('hidden');
    console.error('Erro no login:', error);
  } finally {
    hideLoading();
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    // DESCOMENTAR após configurar Firebase:
    // await signOut(auth);
    
    // Temporário
    localStorage.removeItem('adminLoggedIn');
    currentUser = null;
    showLoginPage();
  } catch (error) {
    console.error('Erro no logout:', error);
    alert('Erro ao fazer logout');
  }
});

// Mostrar painel admin
function showAdminPanel() {
  loginContainer.style.display = 'none';
  adminContainer.style.display = 'block';
  userEmail.textContent = currentUser.email;
  initializeEditor();
  loadAllData();
}

// Mostrar página de login
function showLoginPage() {
  loginContainer.style.display = 'flex';
  adminContainer.style.display = 'none';
}

// ========================================
// INICIALIZAR EDITOR QUILL
// ========================================
function initializeEditor() {
  if (!quillEditor) {
    quillEditor = new Quill('#postEditor', {
      theme: 'snow',
      placeholder: 'Digite o conteúdo do post...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link'],
          ['clean']
        ]
      }
    });
  }
}

// ========================================
// NAVEGAÇÃO ENTRE TABS
// ========================================
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Esconder formulários ao trocar de tab
    postFormCard.classList.add('hidden');
    categoryFormCard.classList.add('hidden');
    authorFormCard.classList.add('hidden');
  });
});

// ========================================
// CARREGAR TODOS OS DADOS
// ========================================
async function loadAllData() {
  showLoading();
  try {
    await Promise.all([
      loadCategories(),
      loadAuthors(),
      loadPosts()
    ]);
    populateSelects();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    alert('Erro ao carregar dados');
  } finally {
    hideLoading();
  }
}

// ========================================
// CRUD - POSTS
// ========================================

// Carregar Posts
async function loadPosts() {
  try {
    // DESCOMENTAR após configurar Firebase:
    // const querySnapshot = await getDocs(collection(db, 'posts'));
    // allPosts = [];
    // querySnapshot.forEach((doc) => {
    //   allPosts.push({ id: doc.id, ...doc.data() });
    // });
    
    // Dados de exemplo
    allPosts = [
      {
        id: '1',
        title: 'PROCESSO SELETIVO PARA ESTÁGIO',
        categoryId: 'cat1',
        authorId: 'author1',
        publishedAt: new Date('2025-06-28'),
        coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
        isImportant: false,
        body: 'Conteúdo do post...'
      },
      {
        id: '2',
        title: 'Computação - PPC e Documentos',
        categoryId: 'cat4',
        authorId: 'author1',
        publishedAt: new Date('2025-05-15'),
        coverImageUrl: 'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=400',
        isImportant: true,
        body: 'Documentos importantes...'
      }
    ];
    
    renderPostsTable();
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
  }
}

// Renderizar tabela de posts
function renderPostsTable() {
  if (allPosts.length === 0) {
    postsTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum post cadastrado</td></tr>';
    return;
  }
  
  postsTableBody.innerHTML = allPosts.map(post => {
    const category = allCategories.find(c => c.id === post.categoryId);
    const author = allAuthors.find(a => a.id === post.authorId);
    const date = post.publishedAt instanceof Date 
      ? post.publishedAt.toLocaleDateString('pt-BR') 
      : new Date(post.publishedAt).toLocaleDateString('pt-BR');
    
    return `
      <tr>
        <td>${post.title}</td>
        <td>${category ? category.name : '-'}</td>
        <td>${author ? author.name : '-'}</td>
        <td>${date}</td>
        <td>${post.isImportant ? '⭐ Sim' : 'Não'}</td>
        <td class="table-actions">
          <button class="btn btn-primary btn-sm" onclick="editPost('${post.id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">Excluir</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Novo Post
newPostBtn.addEventListener('click', () => {
  editingPostId = null;
  document.getElementById('postFormTitle').textContent = 'Novo Post';
  postForm.reset();
  quillEditor.setContents([]);
  imagePreview.innerHTML = '<div class="image-preview-placeholder">Prévia da imagem</div>';
  postFormCard.classList.remove('hidden');
  postFormCard.scrollIntoView({ behavior: 'smooth' });
});

// Preview da imagem
postImage.addEventListener('input', (e) => {
  const url = e.target.value;
  if (url) {
    imagePreview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'>URL inválida</div>'">`;
  } else {
    imagePreview.innerHTML = '<div class="image-preview-placeholder">Prévia da imagem</div>';
  }
});

// Salvar Post
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const postData = {
    title: document.getElementById('postTitle').value,
    categoryId: document.getElementById('postCategory').value,
    authorId: document.getElementById('postAuthor').value,
    publishedAt: new Date(document.getElementById('postDate').value),
    coverImageUrl: document.getElementById('postImage').value,
    isImportant: document.getElementById('postImportant').checked,
    body: quillEditor.root.innerHTML
  };
  
  showLoading();
  
  try {
    if (editingPostId) {
      // Atualizar
      // DESCOMENTAR após Firebase:
      // await updateDoc(doc(db, 'posts', editingPostId), postData);
      
      const index = allPosts.findIndex(p => p.id === editingPostId);
      allPosts[index] = { ...allPosts[index], ...postData };
      alert('Post atualizado com sucesso!');
    } else {
      // Criar
      // DESCOMENTAR após Firebase:
      // const docRef = await addDoc(collection(db, 'posts'), postData);
      // postData.id = docRef.id;
      
      postData.id = Date.now().toString();
      allPosts.push(postData);
      alert('Post criado com sucesso!');
    }
    
    renderPostsTable();
    postFormCard.classList.add('hidden');
    postForm.reset();
  } catch (error) {
    console.error('Erro ao salvar post:', error);
    alert('Erro ao salvar post');
  } finally {
    hideLoading();
  }
});

// Editar Post
window.editPost = function(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  
  editingPostId = postId;
  document.getElementById('postFormTitle').textContent = 'Editar Post';
  document.getElementById('postTitle').value = post.title;
  document.getElementById('postCategory').value = post.categoryId;
  document.getElementById('postAuthor').value = post.authorId;
  document.getElementById('postDate').value = post.publishedAt instanceof Date 
    ? post.publishedAt.toISOString().split('T')[0]
    : new Date(post.publishedAt).toISOString().split('T')[0];
  document.getElementById('postImage').value = post.coverImageUrl;
  document.getElementById('postImportant').checked = post.isImportant;
  
  imagePreview.innerHTML = `<img src="${post.coverImageUrl}" alt="Preview">`;
  quillEditor.root.innerHTML = post.body || '';
  
  postFormCard.classList.remove('hidden');
  postFormCard.scrollIntoView({ behavior: 'smooth' });
};

// Deletar Post
window.deletePost = async function(postId) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;
  
  showLoading();
  try {
    // DESCOMENTAR após Firebase:
    // await deleteDoc(doc(db, 'posts', postId));
    
    allPosts = allPosts.filter(p => p.id !== postId);
    renderPostsTable();
    alert('Post excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    alert('Erro ao deletar post');
  } finally {
    hideLoading();
  }
};

// Cancelar edição de post
[cancelPostBtn, cancelPostBtn2].forEach(btn => {
  btn.addEventListener('click', () => {
    postFormCard.classList.add('hidden');
    editingPostId = null;
  });
});

// ========================================
// CRUD - CATEGORIAS
// ========================================

async function loadCategories() {
  try {
    // DESCOMENTAR após Firebase:
    // const querySnapshot = await getDocs(collection(db, 'categories'));
    // allCategories = [];
    // querySnapshot.forEach((doc) => {
    //   allCategories.push({ id: doc.id, ...doc.data() });
    // });
    
    // Dados de exemplo
    allCategories = [
      { id: 'cat1', name: 'Notícias' },
      { id: 'cat2', name: 'Ciclo Básico' },
      { id: 'cat3', name: 'Avisos' },
      { id: 'cat4', name: 'Institucional' },
      { id: 'cat5', name: 'Estágios' }
    ];
    renderCategoriesTable();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

function renderCategoriesTable() {
  if (allCategories.length === 0) {
    categoriesTableBody.innerHTML = '<tr><td colspan="2" class="empty-state">Nenhuma categoria cadastrada</td></tr>';
    return;
  }
  
  categoriesTableBody.innerHTML = allCategories.map(category => `
    <tr>
      <td>${category.name}</td>
      <td class="table-actions">
        <button class="btn btn-primary btn-sm" onclick="editCategory('${category.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
}

newCategoryBtn.addEventListener('click', () => {
  editingCategoryId = null;
  document.getElementById('categoryFormTitle').textContent = 'Nova Categoria';
  categoryForm.reset();
  categoryFormCard.classList.remove('hidden');
  categoryFormCard.scrollIntoView({ behavior: 'smooth' });
});

categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const categoryData = {
    name: document.getElementById('categoryName').value
  };
  
  showLoading();
  
  try {
    if (editingCategoryId) {
      // DESCOMENTAR após Firebase:
      // await updateDoc(doc(db, 'categories', editingCategoryId), categoryData);
      
      const index = allCategories.findIndex(c => c.id === editingCategoryId);
      allCategories[index] = { ...allCategories[index], ...categoryData };
      alert('Categoria atualizada!');
    } else {
      // DESCOMENTAR após Firebase:
      // const docRef = await addDoc(collection(db, 'categories'), categoryData);
      // categoryData.id = docRef.id;
      
      categoryData.id = Date.now().toString();
      allCategories.push(categoryData);
      alert('Categoria criada!');
    }
    
    renderCategoriesTable();
    populateSelects();
    categoryFormCard.classList.add('hidden');
    categoryForm.reset();
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    alert('Erro ao salvar categoria');
  } finally {
    hideLoading();
  }
});

window.editCategory = function(categoryId) {
  const category = allCategories.find(c => c.id === categoryId);
  if (!category) return;
  
  editingCategoryId = categoryId;
  document.getElementById('categoryFormTitle').textContent = 'Editar Categoria';
  document.getElementById('categoryName').value = category.name;
  categoryFormCard.classList.remove('hidden');
  categoryFormCard.scrollIntoView({ behavior: 'smooth' });
};

window.deleteCategory = async function(categoryId) {
  if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
  
  showLoading();
  try {
    // DESCOMENTAR após Firebase:
    // await deleteDoc(doc(db, 'categories', categoryId));
    
    allCategories = allCategories.filter(c => c.id !== categoryId);
    renderCategoriesTable();
    populateSelects();
    alert('Categoria excluída!');
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    alert('Erro ao deletar categoria');
  } finally {
    hideLoading();
  }
};

[cancelCategoryBtn, cancelCategoryBtn2].forEach(btn => {
  btn.addEventListener('click', () => {
    categoryFormCard.classList.add('hidden');
    editingCategoryId = null;
  });
});

// ========================================
// CRUD - AUTORES
// ========================================

async function loadAuthors() {
  try {
    // DESCOMENTAR após Firebase:
    // const querySnapshot = await getDocs(collection(db, 'authors'));
    // allAuthors = [];
    // querySnapshot.forEach((doc) => {
    //   allAuthors.push({ id: doc.id, ...doc.data() });
    // });
    
    // Dados de exemplo
    allAuthors = [
      { id: 'author1', name: 'Coordenação IFRJ' },
      { id: 'author2', name: 'Secretaria' }
    ];
    renderAuthorsTable();
  } catch (error) {
    console.error('Erro ao carregar autores:', error);
  }
}

function renderAuthorsTable() {
  if (allAuthors.length === 0) {
    authorsTableBody.innerHTML = '<tr><td colspan="2" class="empty-state">Nenhum autor cadastrado</td></tr>';
    return;
  }
  
  authorsTableBody.innerHTML = allAuthors.map(author => `
    <tr>
      <td>${author.name}</td>
      <td class="table-actions">
        <button class="btn btn-primary btn-sm" onclick="editAuthor('${author.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAuthor('${author.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
}

newAuthorBtn.addEventListener('click', () => {
  editingAuthorId = null;
  document.getElementById('authorFormTitle').textContent = 'Novo Autor';
  authorForm.reset();
  authorFormCard.classList.remove('hidden');
  authorFormCard.scrollIntoView({ behavior: 'smooth' });
});

authorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const authorData = {
    name: document.getElementById('authorName').value
  };
  
  showLoading();
  
  try {
    if (editingAuthorId) {
      // DESCOMENTAR após Firebase:
      // await updateDoc(doc(db, 'authors', editingAuthorId), authorData);
      
      const index = allAuthors.findIndex(a => a.id === editingAuthorId);
      allAuthors[index] = { ...allAuthors[index], ...authorData };
      alert('Autor atualizado!');
    } else {
      // DESCOMENTAR após Firebase:
      // const docRef = await addDoc(collection(db, 'authors'), authorData);
      // authorData.id = docRef.id;
      
      authorData.id = Date.now().toString();
      allAuthors.push(authorData);
      alert('Autor criado!');
    }
    
    renderAuthorsTable();
    populateSelects();
    authorFormCard.classList.add('hidden');
    authorForm.reset();
  } catch (error) {
    console.error('Erro ao salvar autor:', error);
    alert('Erro ao salvar autor');
  } finally {
    hideLoading();
  }
});

window.editAuthor = function(authorId) {
  const author = allAuthors.find(a => a.id === authorId);
  if (!author) return;
  
  editingAuthorId = authorId;
  document.getElementById('authorFormTitle').textContent = 'Editar Autor';
  document.getElementById('authorName').value = author.name;
  authorFormCard.classList.remove('hidden');
  authorFormCard.scrollIntoView({ behavior: 'smooth' });
};

window.deleteAuthor = async function(authorId) {
  if (!confirm('Tem certeza que deseja excluir este autor?')) return;
  
  showLoading();
  try {
    // DESCOMENTAR após Firebase:
    // await deleteDoc(doc(db, 'authors', authorId));
    
    allAuthors = allAuthors.filter(a => a.id !== authorId);
    renderAuthorsTable();
    populateSelects();
    alert('Autor excluído!');
  } catch (error) {
    console.error('Erro ao deletar autor:', error);
    alert('Erro ao deletar autor');
  } finally {
    hideLoading();
  }
};

[cancelAuthorBtn, cancelAuthorBtn2].forEach(btn => {
  btn.addEventListener('click', () => {
    authorFormCard.classList.add('hidden');
    editingAuthorId = null;
  });
});

// ========================================
// POPULAR SELECTS
// ========================================
function populateSelects() {
  const categorySelect = document.getElementById('postCategory');
  const authorSelect = document.getElementById('postAuthor');
  
  categorySelect.innerHTML = '<option value="">Selecione...</option>' + 
    allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  
  authorSelect.innerHTML = '<option value="">Selecione...</option>' + 
    allAuthors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
}

// ========================================
// INICIALIZAÇÃO
// ========================================
checkAuth();