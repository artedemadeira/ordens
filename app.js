import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Adicionar listeners para os modais
document.addEventListener('DOMContentLoaded', () => {
    // Listener para modal de unidades
    const unidadesModal = document.getElementById('unidadesModal');
    unidadesModal.addEventListener('show.bs.modal', () => {
        loadUnidades();
    });

    // Listener para modal de tipos
    const tiposModal = document.getElementById('tiposModal');
    tiposModal.addEventListener('show.bs.modal', () => {
        loadTipos();
    });

    // Listener para modal de produtos
    const produtosModal = document.getElementById('produtosModal');
    produtosModal.addEventListener('show.bs.modal', () => {
        loadProdutos();
        loadUnidadesSelect();
        loadTiposSelect();
    });
});

// Funções para Unidades
async function loadUnidades() {
    try {
        const querySnapshot = await getDocs(collection(db, 'unidades'));
        const listaUnidades = document.getElementById('listaUnidades');
        listaUnidades.innerHTML = '<ul class="list-group">';
        
        querySnapshot.forEach(doc => {
            const unidade = doc.data();
            listaUnidades.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${unidade.sigla} - ${unidade.descricao}
                    <button class="btn btn-sm btn-danger" onclick="deleteUnidade('${doc.id}')">Excluir</button>
                </li>
            `;
        });
        
        listaUnidades.innerHTML += '</ul>';
    } catch (error) {
        console.error("Erro ao carregar unidades:", error);
        alert("Erro ao carregar unidades");
    }
}

// Função para carregar unidades no select
async function loadUnidadesSelect() {
    try {
        const querySnapshot = await getDocs(collection(db, 'unidades'));
        const select = document.getElementById('produtoUnidade');
        select.innerHTML = '<option value="">Selecione uma unidade</option>';
        
        querySnapshot.forEach(doc => {
            const unidade = doc.data();
            select.innerHTML += `
                <option value="${unidade.sigla}">${unidade.sigla} - ${unidade.descricao}</option>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar unidades no select:", error);
        alert("Erro ao carregar unidades");
    }
}

// Função para carregar tipos no select
async function loadTiposSelect() {
    try {
        const querySnapshot = await getDocs(collection(db, 'tipos'));
        const select = document.getElementById('produtoTipo');
        select.innerHTML = '<option value="">Selecione um tipo</option>';
        
        querySnapshot.forEach(doc => {
            const tipo = doc.data();
            select.innerHTML += `
                <option value="${tipo.codigo}">${tipo.codigo} - ${tipo.descricao}</option>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar tipos no select:", error);
        alert("Erro ao carregar tipos");
    }
}

document.getElementById('unidadeForm').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const sigla = document.getElementById('unidadeSigla').value;
        const descricao = document.getElementById('unidadeDescricao').value;
        
        await addDoc(collection(db, 'unidades'), {
            sigla,
            descricao,
            createdAt: new Date()
        });
        
        e.target.reset();
        loadUnidades();
        alert("Unidade salva com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar unidade:", error);
        alert("Erro ao salvar unidade");
    }
});

// Funções para Tipos
async function loadTipos() {
    try {
        const querySnapshot = await getDocs(collection(db, 'tipos'));
        const listaTipos = document.getElementById('listaTipos');
        listaTipos.innerHTML = '<ul class="list-group">';
        
        querySnapshot.forEach(doc => {
            const tipo = doc.data();
            listaTipos.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${tipo.codigo} - ${tipo.descricao}
                    <button class="btn btn-sm btn-danger" onclick="deleteTipo('${doc.id}')">Excluir</button>
                </li>
            `;
        });
        
        listaTipos.innerHTML += '</ul>';
    } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        alert("Erro ao carregar tipos");
    }
}

document.getElementById('tipoForm').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const codigo = document.getElementById('tipoCodigo').value;
        const descricao = document.getElementById('tipoDescricao').value;
        
        await addDoc(collection(db, 'tipos'), {
            codigo,
            descricao,
            permiteEstrutura: codigo === 'PA' || codigo === 'SP',
            createdAt: new Date()
        });
        
        e.target.reset();
        loadTipos();
        alert("Tipo salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar tipo:", error);
        alert("Erro ao salvar tipo");
    }
});

// Funções para Produtos
async function loadProdutos() {
    try {
        const produtosSnapshot = await getDocs(collection(db, 'produtos'));
        const listaProdutos = document.getElementById('listaProdutos');
        listaProdutos.innerHTML = '<ul class="list-group">';
        
        for (const doc of produtosSnapshot.docs) {
            const produto = doc.data();
            
            // Buscar unidade
            const unidadeQuery = query(collection(db, 'unidades'), where('sigla', '==', produto.unidade));
            const unidadeSnapshot = await getDocs(unidadeQuery);
            const unidade = unidadeSnapshot.docs[0]?.data();
            
            // Buscar tipo
            const tipoQuery = query(collection(db, 'tipos'), where('codigo', '==', produto.tipo));
            const tipoSnapshot = await getDocs(tipoQuery);
            const tipo = tipoSnapshot.docs[0]?.data();
            
            listaProdutos.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${produto.codigo} - ${produto.descricao}
                    <div>
                        <span class="badge bg-secondary me-2">Unidade: ${unidade ? `${unidade.sigla} - ${unidade.descricao}` : produto.unidade}</span>
                        <span class="badge bg-info me-2">Tipo: ${tipo ? `${tipo.codigo} - ${tipo.descricao}` : produto.tipo}</span>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduto('${doc.id}')">Excluir</button>
                    </div>
                </li>
            `;
        }
        
        listaProdutos.innerHTML += '</ul>';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos');
    }
}

document.getElementById('produtoForm').addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const codigo = document.getElementById('produtoCodigo').value;
        const descricao = document.getElementById('produtoDescricao').value;
        const unidade = document.getElementById('produtoUnidade').value;
        const tipo = document.getElementById('produtoTipo').value;
        const desenho = document.getElementById('produtoDesenho').value;
        
        await addDoc(collection(db, 'produtos'), {
            codigo,
            descricao,
            unidade,
            tipo,
            desenho,
            createdAt: new Date()
        });
        
        e.target.reset();
        loadProdutos();
        alert("Produto salvo com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        alert("Erro ao salvar produto");
    }
});

window.deleteProduto = async (id) => {
    if (confirm('Deseja realmente excluir este produto?')) {
        await deleteDoc(doc(db, 'produtos', id));
        loadProdutos();
    }
};

window.deleteTipo = async (id) => {
    if (confirm('Deseja realmente excluir este tipo?')) {
        await deleteDoc(doc(db, 'tipos', id));
        loadTipos();
    }
};

window.deleteUnidade = async (id) => {
    if (confirm('Deseja realmente excluir esta unidade?')) {
        await deleteDoc(doc(db, 'unidades', id));
        loadUnidades();
    }
};