// MENU HAMBÚRGUER

const botaoMenu = document.querySelector(".menu-hamburguer");
const menu = document.querySelector(".menu");

if (botaoMenu && menu) {

    botaoMenu.addEventListener("click", function () {

        menu.classList.toggle("ativo");

    });

}


// SPA - NAVEGAÇÃO

const conteudo = document.getElementById("conteudo");


// FUNÇÃO PARA CARREGAR AS PÁGINAS

function carregarPagina(url) {

    fetch(url)

        .then(function (resposta) {

            if (!resposta.ok) {

                throw new Error("Erro ao carregar a página.");

            }

            return resposta.text();

        })

        .then(function (html) {

            const documento = new DOMParser().parseFromString(
                html,
                "text/html"
            );

            const novoConteudo = documento.querySelector("main");

            if (novoConteudo && conteudo) {

                conteudo.innerHTML = novoConteudo.innerHTML;

                carregarProjetos();

                configurarCadastro();

            }

            configurarMascaras();

        })

        .catch(function (erro) {

            console.error("Erro ao carregar a página:", erro);

        });

}


// LINKS DO MENU

document.addEventListener("click", function (evento) {

    const link = evento.target.closest("a");

    if (!link) {

        return;

    }

    const url = link.getAttribute("href");

    if (!url) {

        return;

    }

    if (
        url.startsWith("http") ||
        url.startsWith("#") ||
        url.startsWith("mailto:")
    ) {

        return;

    }

    if (!url.endsWith(".html")) {

        return;

    }

    evento.preventDefault();

    carregarPagina(url);

    history.pushState({}, "", url);

    if (menu) {

        menu.classList.remove("ativo");

    }

});


// VOLTAR E AVANÇAR

window.addEventListener("popstate", function () {

    const caminho = window.location.pathname;

    if (caminho.includes("projetos.html")) {

        carregarPagina("projetos.html");

    } else if (caminho.includes("cadastro.html")) {

        carregarPagina("cadastro.html");

    } else {

        carregarPagina("index.html");

    }

});


// MÁSCARAS

function configurarMascaras() {

    // CPF

    const cpf = document.getElementById("cpf");

    if (cpf) {

        cpf.addEventListener("input", function () {

            let valor = cpf.value.replace(/\D/g, "");

            valor = valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

            valor = valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

            valor = valor.replace(
                /(\d{3})(\d{1,2})$/,
                "$1-$2"
            );

            cpf.value = valor;

        });

    }


    // TELEFONE

    const telefone = document.getElementById("telefone");

    if (telefone) {

        telefone.addEventListener("input", function () {

            let valor = telefone.value.replace(/\D/g, "");

            valor = valor.replace(
                /^(\d{2})(\d)/,
                "($1) $2"
            );

            valor = valor.replace(
                /(\d{5})(\d)/,
                "$1-$2"
            );

            telefone.value = valor;

        });

    }

}


// ==================================================
// LOCALSTORAGE - CADASTRO
// ==================================================


// CONFIGURAR O FORMULÁRIO

function configurarCadastro() {

    const formulario =
        document.getElementById("formulario-cadastro");

    if (!formulario) {

        return;

    }


    // RECUPERAR DADOS SALVOS

    const dadosSalvos =
        localStorage.getItem("cadastro");

    if (dadosSalvos) {

        const dadosCadastro =
            JSON.parse(dadosSalvos);

        const nome =
            document.getElementById("nome");

        const telefone =
            document.getElementById("telefone");

        const cpf =
            document.getElementById("cpf");


        if (nome) {

            nome.value = dadosCadastro.nome;

        }

        if (telefone) {

            telefone.value = dadosCadastro.telefone;

        }

        if (cpf) {

            cpf.value = dadosCadastro.cpf;

        }

    }


    // SALVAR DADOS

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const dadosCadastro = {

            nome:
                document.getElementById("nome").value,

            telefone:
                document.getElementById("telefone").value,

            cpf:
                document.getElementById("cpf").value

        };


        localStorage.setItem(
            "cadastro",
            JSON.stringify(dadosCadastro)
        );

    });

}


// ==================================================
// SISTEMA DE TEMPLATES
// ==================================================


// DADOS DOS PROJETOS

const projetos = [

    {
        titulo: "Projeto de Apoio à Comunidade",
        descricao: "Oferecemos apoio às famílias e pessoas em situação de vulnerabilidade, contribuindo para melhorar suas condições de vida.",
        badge: "Projeto ativo"
    },

    {
        titulo: "Projeto de Voluntariado",
        descricao: "Incentivamos a participação de voluntários em ações sociais, promovendo a colaboração e a solidariedade na comunidade.",
        badge: "Voluntariado"
    },

    {
        titulo: "Campanhas de Doação",
        descricao: "Realizamos campanhas para arrecadar recursos e materiais destinados às pessoas e famílias atendidas pela ONG.",
        badge: "Doação"
    },

    {
        titulo: "Outro Projeto",
        descricao: "Desenvolvemos novas ações sociais de acordo com as necessidades identificadas na comunidade.",
        badge: "Projeto ativo"
    }

];


// TEMPLATE LITERAL

function criarProjeto(projeto) {

    return `
        <article class="card">

            <span class="badge">${projeto.badge}</span>

            <h3>${projeto.titulo}</h3>

            <p>${projeto.descricao}</p>

        </article>
    `;

}


// INJETAR OS PROJETOS NO HTML

function carregarProjetos() {

    const listaProjetos =
        document.querySelector(".iniciativas-grid");

    if (!listaProjetos) {

        return;

    }

    let htmlProjetos = "";

    projetos.forEach(function (projeto) {

        htmlProjetos += criarProjeto(projeto);

    });

    listaProjetos.innerHTML = htmlProjetos;

}


// ==================================================
// INICIALIZAÇÃO
// ==================================================

carregarProjetos();

configurarMascaras();

configurarCadastro();