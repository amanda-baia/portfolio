/* =========================================
   ATIVIDADE JS - AMANDA BAÍA
   Atividade 08 - Currículo / Portfólio
   JS + HTML + CSS COM BOOTSTRAP
   ========================================= */
 
 
// Pegando os elementos da página:
const formulario = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoAssunto = document.getElementById("assunto");
const campoMensagem = document.getElementById("mensagem");
 
// Botões, contador e alerta:
const botaoLimpar = document.getElementById("limpar");
const botaoTema = document.getElementById("tema");
const contador = document.getElementById("contador");
const alertaSucesso = document.getElementById("sucesso");
 
 
// ---------- ANO ATUAL NO RODAPÉ ----------
/* obs: a função .getFullYear() puxa o ano automaticamente */
document.getElementById("ano").innerText = new Date().getFullYear();
 
 
// ---------- CONTADOR DE CARACTERES (DOM) ----------
function atualizarContador() {
  contador.innerText = campoMensagem.value.length + "/1000 caracteres";
}
 
 
// ---------- FORMULÁRIO - STORAGE ----------
// salva o que a pessoa está digitando, para não perder se fechar a página
function salvarRascunho() {
  const rascunho = {
    nome: campoNome.value,
    email: campoEmail.value,
    assunto: campoAssunto.value,
    mensagem: campoMensagem.value
  };
 
  // JSON.stringify transforma o objeto em texto para salvar
  localStorage.setItem("rascunhoContato", JSON.stringify(rascunho));
  atualizarContador();
}
 
// o evento "input" acontece a cada letra digitada
campoNome.addEventListener("input", salvarRascunho);
campoEmail.addEventListener("input", salvarRascunho);
campoAssunto.addEventListener("change", salvarRascunho);
campoMensagem.addEventListener("input", salvarRascunho);
 
 
// ---------- RECUPERAR O RASCUNHO AO VOLTAR NA PÁGINA ----------
// JSON.parse transforma o texto salvo de volta em objeto
const rascunhoSalvo = JSON.parse(localStorage.getItem("rascunhoContato"));
 
// se existir rascunho salvo, preenche os campos
if (rascunhoSalvo) {
  campoNome.value = rascunhoSalvo.nome;
  campoEmail.value = rascunhoSalvo.email;
  campoAssunto.value = rascunhoSalvo.assunto;
  campoMensagem.value = rascunhoSalvo.mensagem;
  atualizarContador();
}
 
 
// ---------- ENVIAR (com validação do Bootstrap) ----------
formulario.addEventListener("submit", function (evento) {
  // impede a página de recarregar
  evento.preventDefault();
 
  // checkValidity() confere se os campos obrigatórios estão certos
  if (!formulario.checkValidity()) {
    // "was-validated" faz o Bootstrap pintar os campos de verde ou vermelho
    formulario.classList.add("was-validated");
    return;
  }
 
  // mostra o alerta de sucesso usando o nome digitado
  alertaSucesso.innerText =
    "Obrigada, " + campoNome.value + "! Sua mensagem foi registrada. Retornarei em breve.";
  alertaSucesso.classList.remove("d-none");
 
  // limpa o formulário e apaga o rascunho
  formulario.reset();
  formulario.classList.remove("was-validated");
  localStorage.removeItem("rascunhoContato");
  atualizarContador();
});
 
 
// ---------- LIMPAR FORMULÁRIO ----------
function limparFormulario() {
  formulario.reset();
  formulario.classList.remove("was-validated");
  localStorage.removeItem("rascunhoContato");
  atualizarContador();
 
  alertaSucesso.classList.add("d-none");
}
 
botaoLimpar.addEventListener("click", limparFormulario);
 
 
// ---------- TEMA DARK/ESCURO ----------
// sessionStorage: o tema fica salvo enquanto a aba estiver aberta
// data-bs-theme="dark" é o modo escuro nativo do Bootstrap 5.3
function aplicarTema(tema) {
  if (tema === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    botaoTema.innerText = "Tema Claro";
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
    botaoTema.innerText = "Tema Escuro";
  }
}
 
botaoTema.addEventListener("click", function () {
  let novoTema;
 
  if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    novoTema = "light";
  } else {
    novoTema = "dark";
  }
 
  aplicarTema(novoTema);
  sessionStorage.setItem("tema", novoTema);
});
 
// ao recarregar a página, aplica o tema salvo
aplicarTema(sessionStorage.getItem("tema"));
 
 
// ---------- COOKIE DA ÚLTIMA VISITA ----------
// função para ler um cookie pelo nome
function lerCookie(nome) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [chave, valor] = cookie.split("=");
    if (chave === nome) {
      return decodeURIComponent(valor);
    }
  }
  return null;
}
 
const hoje = new Date().toLocaleDateString("pt-BR");
 
// lê a visita anterior ANTES de gravar a de hoje
const visitaAnterior = lerCookie("ultimaVisita");
 
// grava a visita de hoje (o cookie dura 30 dias)
document.cookie = "ultimaVisita=" + encodeURIComponent(hoje) + "; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
 
document.getElementById("visita").innerText =
  "Última visita registrada: " + (visitaAnterior || hoje);
 
 
// ---------- FECHAR O MENU NO CELULAR AO CLICAR EM UM LINK ----------
const linksMenu = document.querySelectorAll(".nav-link");
const menu = document.getElementById("menu");
 
linksMenu.forEach(function (link) {
  link.addEventListener("click", function () {
    // se o menu estiver aberto (classe "show"), fecha
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});
 



// ---------- NAVBAR TRANSPARENTE -> AZUL AO ROLAR ----------
// window.scrollY diz quantos pixels a página já desceu
const navbar = document.getElementById("navbar");

function atualizarNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add("rolou");
  } else {
    navbar.classList.remove("rolou");
  }
}

window.addEventListener("scroll", atualizarNavbar);
atualizarNavbar();   // já confere ao abrir a página
