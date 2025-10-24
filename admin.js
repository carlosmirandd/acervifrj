// admin.js - Painel Administrativo - Portal Acadêmico IFRJ
import { app, auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    showAdminPanel();
  } else {
    showLoginPage();
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  showLoading();
  loginError.classList.add('hidden');
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    loginError.textContent = 'Erro ao fazer login. Verifique suas credenciais.';
    loginError.classList.remove('hidden');
    console.error('Erro no login:', error);
  } finally {
    hideLoading();
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

function showAdminPanel() {
  loginContainer.style.display = 'none';
  adminContainer.style.display = 'block';
  userEmail.textContent = currentUser.email;
  initializeEditor();
  loadAllData();
}

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
async function loadPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    allPosts = [];
    querySnapshot.forEach((doc) => {
      allPosts.push({ id: doc.id, ...doc.data() });
    });
    renderPostsTable();
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
  }
}

function renderPostsTable() {
  if (allPosts.length === 0) {
    postsTableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum post cadastrado</td></tr>';
    return;
  }
  
  postsTableBody.innerHTML = allPosts.map(post => {
    const category = allCategories.find(c => c.id === post.categoryId);
    const author = allAuthors.find(a => a.id === post.authorId);
    const date = post.publishedAt.toDate().toLocaleDateString('pt-BR');
    
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

newPostBtn.addEventListener('click', () => {
  editingPostId = null;
  document.getElementById('postFormTitle').textContent = 'Novo Post';
  postForm.reset();
  quillEditor.setContents([]);
  imagePreview.innerHTML = '<div class="image-preview-placeholder">Prévia da imagem</div>';
  postFormCard.classList.remove('hidden');
  postFormCard.scrollIntoView({ behavior: 'smooth' });
});

postImage.addEventListener('input', (e) => {
  const url = e.target.value;
  if (url) {
    imagePreview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'image-preview-placeholder\\'>URL inválida</div>'">`;
  } else {
    imagePreview.innerHTML = '<div class="image-preview-placeholder">Prévia da imagem</div>';
  }
});

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const postData = {
    title: document.getElementById('postTitle').value,
    categoryId: document.getElementById('postCategory').value,
    authorId: document.getElementById('postAuthor').value,
    publishedAt: Timestamp.fromDate(new Date(document.getElementById('postDate').value)),
    coverImageUrl: document.getElementById('postImage').value,
    isImportant: document.getElementById('postImportant').checked,
    body: quillEditor.root.innerHTML
  };
  
  showLoading();
  
  try {
    if (editingPostId) {
      await updateDoc(doc(db, 'posts', editingPostId), postData);
      alert('Post atualizado com sucesso!');
    } else {
      await addDoc(collection(db, 'posts'), postData);
      alert('Post criado com sucesso!');
    }
    
    loadPosts();
    postFormCard.classList.add('hidden');
    postForm.reset();
  } catch (error) {
    console.error('Erro ao salvar post:', error);
    alert('Erro ao salvar post');
  } finally {
    hideLoading();
  }
});

window.editPost = function(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;
  
  editingPostId = postId;
  document.getElementById('postFormTitle').textContent = 'Editar Post';
  document.getElementById('postTitle').value = post.title;
  document.getElementById('postCategory').value = post.categoryId;
  document.getElementById('postAuthor').value = post.authorId;
  document.getElementById('postDate').value = post.publishedAt.toDate().toISOString().split('T')[0];
  document.getElementById('postImage').value = post.coverImageUrl;
  document.getElementById('postImportant').checked = post.isImportant;
  
  imagePreview.innerHTML = `<img src="${post.coverImageUrl}" alt="Preview">`;
  quillEditor.root.innerHTML = post.body || '';
  
  postFormCard.classList.remove('hidden');
  postFormCard.scrollIntoView({ behavior: 'smooth' });
};

window.deletePost = async function(postId) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;
  
  showLoading();
  try {
    await deleteDoc(doc(db, 'posts', postId));
    loadPosts();
    alert('Post excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    alert('Erro ao deletar post');
  } finally {
    hideLoading();
  }
};

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
    const querySnapshot = await getDocs(collection(db, 'categories'));
    allCategories = [];
    querySnapshot.forEach((doc) => {
      allCategories.push({ id: doc.id, ...doc.data() });
    });
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
      await updateDoc(doc(db, 'categories', editingCategoryId), categoryData);
      alert('Categoria atualizada!');
    } else {
      await addDoc(collection(db, 'categories'), categoryData);
      alert('Categoria criada!');
    }
    
    loadCategories();
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
    await deleteDoc(doc(db, 'categories', categoryId));
    loadCategories();
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
    const querySnapshot = await getDocs(collection(db, 'authors'));
    allAuthors = [];
    querySnapshot.forEach((doc) => {
      allAuthors.push({ id: doc.id, ...doc.data() });
    });
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
      await updateDoc(doc(db, 'authors', editingAuthorId), authorData);
      alert('Autor atualizado!');
    } else {
      await addDoc(collection(db, 'authors'), authorData);
      alert('Autor criado!');
    }
    
    loadAuthors();
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
    await deleteDoc(doc(db, 'authors', authorId));
    loadAuthors();
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
