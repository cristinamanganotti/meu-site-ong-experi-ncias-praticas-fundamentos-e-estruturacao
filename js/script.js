
// ==================================================
// MENU HAMBÚRGUER
// ==================================================

const botaoMenu = document.querySelector(".menu-hamburguer");
const menu = document.querySelector(".menu");

if (botaoMenu && menu) {

    botaoMenu.addEventListener("click", function () {

        const menuAberto = menu.classList.toggle("ativo");

        // Informa ao leitor de tela se o menu está aberto ou fechado
        botaoMenu.setAttribute("aria-expanded", menuAberto);

        // Atualiza a descrição do botão
        botaoMenu.setAttribute(
            "aria-label",
            menuAberto ? "Fechar menu" : "Abrir menu"
        );

    });

}


// ==================================================
// SPA - NAVEGAÇÃO
// ==================================================

const conteudo = document.getElementById("conteudo");


// ==================================================
// FUNÇÃO PARA CARREGAR AS PÁGINAS
// ==================================================

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

                // Reconfigura funcionalidades dos elementos
                // que foram inseridos novamente no DOM
                carregarProjetos();
                configurarCadastro();
                configurarMascaras();

                // Move o foco para o conteúdo carregado
                conteudo.setAttribute("tabindex", "-1");
                conteudo.focus();

            }

        })

        .catch(function (erro) {

            console.error("Erro ao carregar a página:", erro);

            if (conteudo) {

                conteudo.innerHTML = `
                    <section class="mensagem-erro">
                        <h2>Não foi possível carregar a página</h2>
                        <p>
                            Ocorreu um erro ao carregar o conteúdo.
                            Tente novamente.
                        </p>
                    </section>
                `;

                conteudo.setAttribute("tabindex", "-1");
                conteudo.focus();

            }

        });

}


// ==================================================
// LINKS DO MENU
// ==================================================

document.addEventListener("click", function (evento) {

    const link = evento.target.closest("a");

    if (!link) {

        return;

    }

    const url = link.getAttribute("href");

    if (!url) {

        return;

    }

    // Mantém o comportamento normal para links externos,
    // âncoras e e-mail
    if (
        url.startsWith("http") ||
        url.startsWith("#") ||
        url.startsWith("mailto:")
    ) {

        return;

    }

    // Intercepta somente páginas HTML
    if (!url.endsWith(".html")) {

        return;

    }

    evento.preventDefault();

    carregarPagina(url);

    history.pushState({}, "", url);

    // Fecha o menu depois da navegação
    if (menu) {

        menu.classList.remove("ativo");

    }

    // Atualiza o estado de acessibilidade do botão
    if (botaoMenu) {

        botaoMenu.setAttribute("aria-expanded", "false");

        botaoMenu.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }

});


// ==================================================
// VOLTAR E AVANÇAR DO NAVEGADOR
// ==================================================

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


// ==================================================
// MÁSCARAS
// ==================================================

function configurarMascaras() {


    // ==================================================
    // CPF
    // ==================================================

    const cpf = document.getElementById("cpf");

    if (cpf) {

        cpf.addEventListener("input", function () {

            let valor = cpf.value.replace(/\D/g, "");

            // Limita o CPF a 11 números
            valor = valor.substring(0, 11);

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


    // ==================================================
    // TELEFONE
    // ==================================================

    const telefone = document.getElementById("telefone");

    if (telefone) {

        telefone.addEventListener("input", function () {

            let valor = telefone.value.replace(/\D/g, "");

            // Limita o telefone a 11 números
            valor = valor.substring(0, 11);

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


// ==================================================
// CONFIGURAR O FORMULÁRIO
// ==================================================

function configurarCadastro() {

    const formulario =
        document.getElementById("formulario-cadastro");

    if (!formulario) {

        return;

    }


    // ==================================================
    // RECUPERAR DADOS SALVOS
    // ==================================================

    const dadosSalvos =
        localStorage.getItem("cadastro");

    if (dadosSalvos) {

        try {

            const dadosCadastro =
                JSON.parse(dadosSalvos);

            const nome =
                document.getElementById("nome");

            const telefone =
                document.getElementById("telefone");

            const cpf =
                document.getElementById("cpf");


            if (nome) {

                nome.value = dadosCadastro.nome || "";

            }

            if (telefone) {

                telefone.value = dadosCadastro.telefone || "";

            }

            if (cpf) {

                cpf.value = dadosCadastro.cpf || "";

            }

        } catch (erro) {

            console.error(
                "Erro ao recuperar os dados do cadastro:",
                erro
            );

        }

    }


    // ==================================================
    // SALVAR DADOS
    // ==================================================

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const campoNome =
            document.getElementById("nome");

        const campoTelefone =
            document.getElementById("telefone");

        const campoCpf =
            document.getElementById("cpf");


        const dadosCadastro = {

            nome: campoNome ? campoNome.value : "",

            telefone: campoTelefone
                ? campoTelefone.value
                : "",

            cpf: campoCpf
                ? campoCpf.value
                : ""

        };


        try {

            localStorage.setItem(
                "cadastro",
                JSON.stringify(dadosCadastro)
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar os dados do cadastro:",
                erro
            );

        }

    });

}


// ==================================================
// SISTEMA DE TEMPLATES
// ==================================================


// ==================================================
// DADOS DOS PROJETOS
// ==================================================

const projetos = [

    {
        titulo: "Projeto de Apoio à Comunidade",
        descricao:
            "Oferecemos apoio às famílias e pessoas em situação de vulnerabilidade, contribuindo para melhorar suas condições de vida.",
        badge: "Projeto ativo"
    },

    {
        titulo: "Projeto de Voluntariado",
        descricao:
            "Incentivamos a participação de voluntários em ações sociais, promovendo a colaboração e a solidariedade na comunidade.",
        badge: "Voluntariado"
    },

    {
        titulo: "Campanhas de Doação",
        descricao:
            "Realizamos campanhas para arrecadar recursos e materiais destinados às pessoas e famílias atendidas pela ONG.",
        badge: "Doação"
    },

    {
        titulo: "Outro Projeto",
        descricao:
            "Desenvolvemos novas ações sociais de acordo com as necessidades identificadas na comunidade.",
        badge: "Projeto ativo"
    }

];


// ==================================================
// TEMPLATE LITERAL
// ==================================================

function criarProjeto(projeto) {

    return `
        <article class="card">

            <span class="badge">${projeto.badge}</span>

            <h3>${projeto.titulo}</h3>

            <p>${projeto.descricao}</p>

        </article>
    `;

}


// ==================================================
// INJETAR OS PROJETOS NO HTML
// ==================================================

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