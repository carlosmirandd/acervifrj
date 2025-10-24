// post.js - Lógica para a página de detalhes do post
import { db } from './firebase-config.js';
import { doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const postTitleEl = document.getElementById('post-title');
const postMetaEl = document.getElementById('post-meta');
const postImageEl = document.getElementById('post-image');
const postBodyEl = document.getElementById('post-body');
const loadingOverlay = document.getElementById('loading-overlay');

async function fetchPost(postId) {
    try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            return postSnap.data();
        } else {
            console.error("Nenhum post encontrado com este ID!");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar post:", error);
        return null;
    }
}

async function fetchAuthors() {
    try {
        const querySnapshot = await getDocs(collection(db, 'authors'));
        const authors = {};
        querySnapshot.forEach((doc) => {
            authors[doc.id] = doc.data();
        });
        return authors;
    } catch (error) {
        console.error("Erro ao buscar autores:", error);
        return {};
    }
}

async function fetchCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = {};
        querySnapshot.forEach((doc) => {
            categories[doc.id] = doc.data();
        });
        return categories;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return {};
    }
}

function renderPost(post, author, category) {
    document.title = `${post.title} - Portal Acadêmico IFRJ`;
    postTitleEl.textContent = post.title;
    postImageEl.src = post.coverImageUrl;
    postImageEl.alt = post.title;
    postBodyEl.innerHTML = post.body;

    const date = post.publishedAt.toDate().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    let metaHTML = `Publicado em ${date}`;
    if (author) {
        metaHTML += ` por ${author.name}`;
    }
    if (category) {
        metaHTML += ` em <span class="post-category-display">${category.name}</span>`;
    }
    postMetaEl.innerHTML = metaHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
    loadingOverlay.style.display = 'flex';
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postTitleEl.textContent = "Post não encontrado";
        postBodyEl.textContent = "O ID do post não foi fornecido na URL.";
        loadingOverlay.style.display = 'none';
        return;
    }

    const [post, authors, categories] = await Promise.all([
        fetchPost(postId),
        fetchAuthors(),
        fetchCategories()
    ]);

    if (post) {
        const author = authors[post.authorId];
        const category = categories[post.categoryId];
        renderPost(post, author, category);
    } else {
        postTitleEl.textContent = "Erro ao carregar o post";
        postBodyEl.textContent = "Não foi possível encontrar o post solicitado. Por favor, verifique o link e tente novamente.";
    }
    loadingOverlay.style.display = 'none';
});