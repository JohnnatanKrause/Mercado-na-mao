let dadosPorCategoria = {};
let dadosOriginais = [];
let carrinho = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("itens.json")
        .then((response) => response.json())
        .then((data) => {
            dadosOriginais = data;

            data.forEach((item) => {
                if (!dadosPorCategoria[item.categoria]) {
                    dadosPorCategoria[item.categoria] = [];
                }
                dadosPorCategoria[item.categoria].push(item);
            });

            renderizarCategorias();
        });
});

function renderizarCategorias() {
    const categoriasDiv = document.getElementById("categorias");
    categoriasDiv.innerHTML = "";

    Object.keys(dadosPorCategoria).forEach((categoria) => {
        const card = document.createElement("div");
        card.classList.add("categoria-card");
        card.innerHTML = `<img src="${categoria}.png" alt="" />`;
        card.addEventListener("click", () => exibirItensDaCategoria(categoria));
        categoriasDiv.appendChild(card);
    });

    document.getElementById("categorias").style.display = "flex";
    document.getElementById("itensDaCategoria").style.display = "none";
}

function exibirItensDaCategoria(categoria) {
    const lista = document.getElementById("lista");
    const titulo = document.getElementById("tituloCategoria");

    titulo.textContent = `🧾 ${categoria}`;
    lista.innerHTML = "";

    dadosPorCategoria[categoria].forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("lista-item");

        const idCheckbox = `chk-${categoria}-${index}`;

        const container = document.createElement("div");
        container.classList.add("item-container");

        container.innerHTML = `
            <input type="checkbox" id="${idCheckbox}" data-nome="${item.nome}" data-unidade="${item.unidade || 'un'}">
            <label for="${idCheckbox}">${item.nome} (${item.unidade || "un"})</label>
            <div class="quantidade-wrap" style="display: none;">
                <button class="diminuir">−</button>
                <input type="number" value="1" min="1">
                <button class="aumentar">+</button>
            </div>
        `;

        const checkbox = container.querySelector("input[type=checkbox]");
        const quantidadeWrap = container.querySelector(".quantidade-wrap");
        const inputQuantidade = quantidadeWrap.querySelector("input");

        checkbox.addEventListener("change", function () {
            quantidadeWrap.style.display = this.checked ? "flex" : "none";
        });

        quantidadeWrap.querySelector(".aumentar").addEventListener("click", () => {
            inputQuantidade.value = parseInt(inputQuantidade.value) + 1;
        });

        quantidadeWrap.querySelector(".diminuir").addEventListener("click", () => {
            if (parseInt(inputQuantidade.value) > 1) {
                inputQuantidade.value = parseInt(inputQuantidade.value) - 1;
            }
        });

        li.appendChild(container);
        lista.appendChild(li);
    });

    // Cria o botão Inserir no Carrinho uma única vez
    if (!document.getElementById("botaoCarrinho")) {
        const btnInserir = document.createElement("button");
        btnInserir.id = "botaoCarrinho";
        btnInserir.textContent = "🛒 Inserir no Carrinho";
        btnInserir.style.marginTop = "20px";
        btnInserir.onclick = function () {
            const selecionados = document.querySelectorAll("#itensDaCategoria input[type=checkbox]:checked");
            selecionados.forEach((checkbox) => {
                const nome = checkbox.dataset.nome;
                const unidade = checkbox.dataset.unidade || "un";
                const quantidade = checkbox.parentNode.querySelector("input[type=number]").value;

                const existe = carrinho.find(item => item.nome === nome);
                if (!existe) {
                    carrinho.push({ nome, unidade, quantidade });
                }
            });

            mostrarToast("Itens adicionados ao carrinho! 🛒");
            setTimeout(() => {
                voltarParaCategorias();
            }, 1500);
        };

        document.getElementById("itensDaCategoria").appendChild(btnInserir);
    }

    document.getElementById("categorias").style.display = "none";
    document.getElementById("itensDaCategoria").style.display = "block";
}

function voltarParaCategorias() {
    renderizarCategorias();
}

function enviarWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio 😕");
        return;
    }

    let mensagem = "*Minha Lista de Compras*\n\n";

    carrinho.forEach((item) => {
        mensagem += `- ${item.nome} (${item.quantidade} ${item.unidade})\n`;
    });

    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}
function mostrarTelaUpgrade() {
    document.getElementById("categorias").style.display = "none";
    document.getElementById("itensDaCategoria").style.display = "none";
    document.getElementById("telaUpgrade").style.display = "block";
}

function fecharTelaUpgrade() {
    document.getElementById("telaUpgrade").style.display = "none";
    renderizarCategorias();
}

function comprarVersaoPro() {
    alert("Simulação: aqui você liberaria o upgrade após o pagamento!");
    // Aqui futuramente você ativaria a versão Pro
}
