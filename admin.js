// admin.js - Gerenciamento Administrativo com Firebase

// INSIRA SUAS CONFIGURAÇÕES Firebase AQUI
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializando Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variáveis globais para controle
let usuarioLogado = null;

// Função para verificar se usuário está logado
auth.onAuthStateChanged(user => {
  if (user) {
    usuarioLogado = user;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    carregarDadosAdmin();
  } else {
    usuarioLogado = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
  }
});

// Função de login
async function fazerLogin() {
  const email = document.getElementById('emailLogin').value;
  const senha = document.getElementById('senhaLogin').value;

  try {
    await auth.signInWithEmailAndPassword(email, senha);
  } catch (error) {
    alert('Erro de login: ' + error.message);
  }
}

// Função de logout
function sair() {
  auth.signOut();
}

// Carregar dados iniciais do painel
async function carregarDadosAdmin() {
  await listarPosts();
  await listarCategorias();
  await listarAutores();
}

// ==================== CRUD Posts ====================

async function listarPosts() {
  const container = document.getElementById('tabelaPosts');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('posts').orderBy('publishedAt', 'desc').get();
    snapshot.forEach(doc => {
      const post = doc.data();
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${post.title}</td>
        <td>${post.categoryName || 'Sem Categoria'}</td>
        <td>${post.authorName || 'Autor Desconhecido'}</td>
        <td>${new Date(post.publishedAt.seconds * 1000).toLocaleDateString()}</td>
        <td>
          <button onclick="editarPost('${doc.id}')">Editar</button>
          <button onclick="deletarPost('${doc.id}')">Excluir</button>
        </td>
      `;
      container.appendChild(tr);
    });
  } catch (error) {
    console.error('Erro ao listar posts:', error);
  }
}

async function criarEditarPost(id = null) {
  const titulo = document.getElementById('inputTitulo').value;
  const urlImagem = document.getElementById('inputImagem').value;
  const corpo = quill.root.innerHTML; // Editor rico
  const categoriaId = document.getElementById('selectCategoria').value;
  const autorId = document.getElementById('selectAutor').value;
  const importante = document.getElementById('checkboxImportante').checked;
  const dataPublicacao = new Date(document.getElementById('inputData').value);
  const timestamp = firebase.firestore.Timestamp.fromDate(dataPublicacao);

  if (!titulo || !urlImagem || !corpo || !categoriaId || !autorId) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  const postData = {
    title: titulo,
    coverImageUrl: urlImagem,
    body: corpo,
    categoryId: categoriaId,
    categoryName: document.querySelector(`#selectCategoria option[value="${categoriaId}"]`).text,
    authorId: autorId,
    authorName: document.querySelector(`#selectAutor option[value="${autorId}"]`).text,
    isImportant: importante,
    publishedAt: timestamp
  };

  try {
    if (id) {
      await db.collection('posts').doc(id).set(postData);
    } else {
      await db.collection('posts').add(postData);
    }
    alert('Post salvo com sucesso!');
    fecharModalPost();
    await listarPosts();
  } catch (error) {
    alert('Erro ao salvar post: ' + error.message);
  }
}

async function editarPost(id) {
  const docRef = db.collection('posts').doc(id);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    const post = docSnap.data();

    // Preencher formulário com dados existentes
    document.getElementById('inputTitulo').value = post.title;
    document.getElementById('inputImagem').value = post.coverImageUrl;
    document.getElementById('inputData').value = new Date(post.publishedAt.seconds * 1000).toLocaleString();
    document.getElementById('checkboxImportante').checked = post.isImportant;

    // Selecionar categoria e autor
    document.getElementById('selectCategoria').value = post.categoryId;
    document.getElementById('selectAutor').value = post.authorId;

    // Editor corpo
    quill.root.innerHTML = post.body;

    // Abrir modal/ formulário de edição
    document.getElementById('btnSalvarPost').onclick = () => criarEditarPost(id);
    document.getElementById('modalPost').style.display = 'block';
  } else {
    alert('Post não encontrado!');
  }
}

async function deletarPost(id) {
  if (confirm('Tem certeza que deseja excluir este post?')) {
    try {
      await db.collection('posts').doc(id).delete();
      alert('Post excluído!');
      await listarPosts();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  }
}

//=================== CRUD Categorias ===================

async function listarCategorias() {
  const selectCat = document.getElementById('selectCategoria');
  selectCat.innerHTML = '<option value="">Selecione uma categoria</option>';

  const container = document.getElementById('listaCategorias');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('categories').get();
    snapshot.forEach(doc => {
      const cat = doc.data();
      // Popula select
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = cat.name;
      selectCat.appendChild(option);

      // Lista para gerenciar
      const li = document.createElement('li');
      li.innerHTML = `
        ${cat.name} 
        <button onclick="editarCategoria('${doc.id}')">Editar</button>
        <button onclick="deletarCategoria('${doc.id}')">Excluir</button>
      `;
      container.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
  }
}

async function criarEditarCategoria(id = null) {
  const nome = document.getElementById('inputCategoriaNome').value.trim();
  if (!nome) {
    alert('Digite o nome da categoria.');
    return;
  }
  try {
    if (id) {
      await db.collection('categories').doc(id).set({ name: nome });
    } else {
      await db.collection('categories').add({ name: nome });
    }
    alert('Categoria salva!');
    document.getElementById('modalCategoria').style.display = 'none';
    await listarCategorias();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function editarCategoria(id) {
  const docRef = db.collection('categories').doc(id);
  const snap = await docRef.get();
  if (snap.exists) {
    document.getElementById('inputCategoriaNome').value = snap.data().name;
    document.getElementById('btnSalvarCategoria').onclick = () => criarEditarCategoria(id);
    document.getElementById('modalCategoria').style.display = 'block';
  }
}

async function deletarCategoria(id) {
  if (confirm('Excluir essa categoria?')) {
    try {
      await db.collection('categories').doc(id).delete();
      await listarCategorias();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  }
}

//=================== CRUD Autores ===================

async function listarAutores() {
  const selectAutor = document.getElementById('selectAutor');
  selectAutor.innerHTML = '<option value="">Selecione um autor</option>';

  const container = document.getElementById('listaAutores');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('authors').get();
    snapshot.forEach(doc => {
      const autor = doc.data();
      // Popula select
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = autor.name;
      selectAutor.appendChild(option);

      // Lista para gerenciar
      const li = document.createElement('li');
      li.innerHTML = `
        ${autor.name} 
        <button onclick="editarAutor('${doc.id}')">Editar</button>
        <button onclick="deletarAutor('${doc.id}')">Excluir</button>
      `;
      container.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao listar autores:', error);
  }
}

async function criarEditarAutor(id = null) {
  const nome = document.getElementById('inputAutorNome').value.trim();
  if (!nome) {
    alert('Digite o nome do autor.');
    return;
  }
  try {
    if (id) {
      await db.collection('authors').doc(id).set({ name: nome });
    } else {
      await db.collection('authors').add({ name: nome });
    }
    alert('Autor salvo!');
    document.getElementById('modalAutor').style.display = 'none';
    await listarAutores();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function editarAutor(id) {
  const docRef = db.collection('authors').doc(id);
  const snap = await docRef.get();
  if (snap.exists) {
    document.getElementById('inputAutorNome').value = snap.data().name;
    document.getElementById('btnSalvarAutor').onclick = () => criarEditarAutor(id);
    document.getElementById('modalAutor').style.display = 'block';
  }
}

async function deletarAutor(id) {
  if (confirm('Excluir esse autor?')) {
    try {
      await db.collection('authors').doc(id).delete();
      await listarAutores();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  }
}

// ==================== Funções auxiliares ====================

function abrirModalPost() {
  document.getElementById('formPost').reset();
  quill.root.innerHTML = '';
  document.getElementById('modalPost').style.display = 'block';
}

function fecharModalPost() {
  document.getElementById('modalPost').style.display = 'none';
}

function abrirModalCategoria() {
  document.getElementById('formCategoria').reset();
  document.getElementById('modalCategoria').style.display = 'block';
}

function abrirModalAutor() {
  document.getElementById('formAutor').reset();
  document.getElementById('modalAutor').style.display = 'block';
}
