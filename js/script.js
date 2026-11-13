/*!
 * Portfólio | Amanda Baía
 * © 2026 Amanda Baía. Licença MIT: mantenha este aviso em cópias.
 * Logo, nome e imagens não estão incluídos na licença (todos os direitos reservados).
 */
/* =========================================
   ATIVIDADE JS - AMANDA BAÍA
   Portfólio com Bootstrap 5 (versão 4)
   JS + HTML + CSS COM BOOTSTRAP
   ========================================= */


// ---------- 1. PEGANDO OS ELEMENTOS DA PÁGINA ----------
const formulario = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoAssunto = document.getElementById("assunto");
const campoMensagem = document.getElementById("mensagem");

// Botões, contador e alertas:
const botaoEnviar = document.getElementById("enviar");
const botaoLimpar = document.getElementById("limpar");
const botaoTema = document.getElementById("tema");
const botaoIdioma = document.getElementById("idioma");
const contador = document.getElementById("contador");
const alertaSucesso = document.getElementById("sucesso");
const alertaErro = document.getElementById("erro");


// ---------- 2. TEXTOS QUE O JAVASCRIPT ESCREVE (PT e EN) ----------
// Os textos do HTML são traduzidos pelos atributos data-en.
// Já os textos que o próprio JS cria ficam aqui, nos dois idiomas.
const textos = {
  pt: {
    temaEscuro: "Tema Escuro",
    temaClaro: "Tema Claro",
    caracteres: "caracteres",
    ultimaVisita: "Última visita registrada: ",
    enviar: "Enviar",
    enviando: "Enviando...",
    sucesso: "Obrigada, NOME! Sua mensagem foi enviada. Retornarei em breve.",
    erro: "Não foi possível enviar agora. Tente de novo ou escreva para amandabaiaadv@gmail.com."
  },
  en: {
    temaEscuro: "Dark Theme",
    temaClaro: "Light Theme",
    caracteres: "characters",
    ultimaVisita: "Last recorded visit: ",
    enviar: "Send",
    enviando: "Sending...",
    sucesso: "Thank you, NOME! Your message has been sent. I'll get back to you soon.",
    erro: "Your message could not be sent right now. Please try again or write to amandabaiaadv@gmail.com."
  }
};

// idioma atual (começa em português; o item 9 recupera o que estava salvo)
let idiomaAtual = "pt";

// função curta para buscar um texto no idioma atual: t("enviar")
function t(chave) {
  return textos[idiomaAtual][chave];
}


// ---------- 3. ANO ATUAL NO RODAPÉ ----------
/* obs: a função .getFullYear() puxa o ano automaticamente */
document.getElementById("ano").innerText = new Date().getFullYear();


// ---------- 4. CONTADOR DE CARACTERES (DOM) ----------
function atualizarContador() {
  contador.innerText = campoMensagem.value.length + "/1000 " + t("caracteres");
}


// ---------- 5. FORMULÁRIO - RASCUNHO (localStorage) ----------
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

// recuperar o rascunho ao voltar na página
// JSON.parse transforma o texto salvo de volta em objeto
const rascunhoSalvo = JSON.parse(localStorage.getItem("rascunhoContato"));

if (rascunhoSalvo) {
  campoNome.value = rascunhoSalvo.nome;
  campoEmail.value = rascunhoSalvo.email;
  campoAssunto.value = rascunhoSalvo.assunto;
  campoMensagem.value = rascunhoSalvo.mensagem;
}


// ---------- 6. ENVIAR DE VERDADE (Formspree) ----------
// async: a função pode "esperar" (await) a resposta da internet sem travar a página
formulario.addEventListener("submit", async function (evento) {
  // impede a página de recarregar
  evento.preventDefault();

  // esconde mensagens antigas
  alertaSucesso.classList.add("d-none");
  alertaErro.classList.add("d-none");

  // checkValidity() confere se os campos obrigatórios estão certos
  if (!formulario.checkValidity()) {
    // "was-validated" faz o Bootstrap pintar os campos de verde ou vermelho
    formulario.classList.add("was-validated");
    return;
  }

  // trava o botão enquanto envia, para a pessoa não clicar duas vezes
  botaoEnviar.disabled = true;
  botaoEnviar.innerText = t("enviando");

  try {
    // enquanto o código do Formspree não for colocado no HTML, o envio é só simulado
    if (formulario.action.includes("SEU_CODIGO")) {
      console.warn("Formspree ainda não configurado: troque SEU_CODIGO no action do formulário.");
    } else {
      // fetch: manda os dados do formulário para o Formspree
      const resposta = await fetch(formulario.action, {
        method: "POST",
        body: new FormData(formulario),          // junta todos os campos que têm "name"
        headers: { Accept: "application/json" }
      });

      // se o Formspree responder com erro, pula para o "catch"
      if (!resposta.ok) {
        throw new Error("Falha no envio");
      }
    }

    // deu certo: mostra o alerta de sucesso com o nome digitado
    alertaSucesso.innerText = t("sucesso").replace("NOME", campoNome.value);
    alertaSucesso.classList.remove("d-none");

    // limpa o formulário e apaga o rascunho
    formulario.reset();
    formulario.classList.remove("was-validated");
    localStorage.removeItem("rascunhoContato");
    atualizarContador();

  } catch (falha) {
    // deu errado (sem internet, por exemplo): mostra o alerta de erro
    alertaErro.innerText = t("erro");
    alertaErro.classList.remove("d-none");

  } finally {
    // "finally" roda sempre, dando certo ou errado: destrava o botão
    botaoEnviar.disabled = false;
    botaoEnviar.innerText = t("enviar");
  }
});


// ---------- 7. LIMPAR FORMULÁRIO ----------
function limparFormulario() {
  formulario.reset();
  formulario.classList.remove("was-validated");
  localStorage.removeItem("rascunhoContato");
  atualizarContador();

  alertaSucesso.classList.add("d-none");
  alertaErro.classList.add("d-none");
}

botaoLimpar.addEventListener("click", limparFormulario);


// ---------- 8. TEMA DARK/ESCURO (sessionStorage) ----------
// sessionStorage: o tema fica salvo enquanto a aba estiver aberta
// data-bs-theme="dark" é o modo escuro nativo do Bootstrap 5.3
function aplicarTema(tema) {
  if (tema === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    botaoTema.innerText = t("temaClaro");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
    botaoTema.innerText = t("temaEscuro");
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


// ---------- 9. IDIOMA PT / EN (localStorage) ----------
// Cada elemento traduzível tem o inglês num atributo:
//   data-en               → o conteúdo (texto) em inglês
//   data-en-placeholder   → o placeholder em inglês
//   data-en-alt           → o texto alternativo da imagem em inglês
//   data-en-aria-label    → a descrição para leitores de tela em inglês
// O português original é guardado na primeira troca (data-pt...), para poder voltar.

function trocarAtributo(atributo, idioma) {
  document.querySelectorAll("[data-en-" + atributo + "]").forEach(function (elemento) {
    const guardado = "data-pt-" + atributo;

    // guarda o português na primeira vez
    if (!elemento.hasAttribute(guardado)) {
      elemento.setAttribute(guardado, elemento.getAttribute(atributo));
    }

    const novoValor = idioma === "en"
      ? elemento.getAttribute("data-en-" + atributo)
      : elemento.getAttribute(guardado);

    elemento.setAttribute(atributo, novoValor);
  });
}

function aplicarIdioma(idioma) {
  idiomaAtual = idioma;

  // 1) textos (innerHTML, para manter negritos e ícones)
  document.querySelectorAll("[data-en]").forEach(function (elemento) {
    if (elemento.dataset.pt === undefined) {
      elemento.dataset.pt = elemento.innerHTML;     // guarda o português
    }
    elemento.innerHTML = idioma === "en" ? elemento.dataset.en : elemento.dataset.pt;
  });

  // 2) atributos
  trocarAtributo("placeholder", idioma);
  trocarAtributo("alt", idioma);
  trocarAtributo("aria-label", idioma);

  // 3) idioma da página (leitores de tela e tradutores usam isso)
  document.documentElement.lang = idioma === "en" ? "en" : "pt-br";

  // 4) botão de idioma: mostra para qual idioma o próximo clique vai mudar
  botaoIdioma.innerHTML = '<i class="bi bi-translate" aria-hidden="true"></i> ' + (idioma === "en" ? "PT" : "EN");
  botaoIdioma.setAttribute("aria-label", idioma === "en" ? "Ver o site em português" : "View the site in English");
  botaoIdioma.lang = idioma === "en" ? "pt-br" : "en";

  // 5) textos que o JS escreve
  aplicarTema(document.documentElement.getAttribute("data-bs-theme"));
  atualizarContador();
  mostrarVisita();
  if (!botaoEnviar.disabled) {
    botaoEnviar.innerText = t("enviar");
  }

  localStorage.setItem("idioma", idioma);
}

// um clique alterna: se está em português, vai para inglês; e vice-versa
botaoIdioma.addEventListener("click", function () {
  aplicarIdioma(idiomaAtual === "pt" ? "en" : "pt");
});


// ---------- 10. COOKIE DA ÚLTIMA VISITA ----------
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

function mostrarVisita() {
  document.getElementById("visita").innerText = t("ultimaVisita") + (visitaAnterior || hoje);
}


// ---------- 11. FECHAR O MENU NO CELULAR AO CLICAR EM UM LINK ----------
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


// ---------- 12. ROLAGEM: NAVBAR AZUL E BOTÃO "VOLTAR AO TOPO" ----------
// window.scrollY diz quantos pixels a página já desceu
const navbar = document.getElementById("navbar");
const botaoTopo = document.getElementById("voltar-topo");

function aoRolar() {
  // navbar: transparente na capa, azul depois de 60px
  if (window.scrollY > 60) {
    navbar.classList.add("rolou");
  } else {
    navbar.classList.remove("rolou");
  }

  // botão "voltar ao topo": aparece depois de 600px
  if (window.scrollY > 600) {
    botaoTopo.classList.add("visivel");
  } else {
    botaoTopo.classList.remove("visivel");
  }
}

window.addEventListener("scroll", aoRolar);

botaoTopo.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ---------- 13. ACESSIBILIDADE (localStorage) ----------
const botaoA11y = document.getElementById("botao-acessibilidade");
const painelA11y = document.getElementById("painel-acessibilidade");

// tamanhos de texto possíveis (o índice 1, 100%, é o padrão)
const tamanhosFonte = [90, 100, 112.5, 125, 137.5];

// estado padrão das opções
const a11yPadrao = {
  fonte: 1,
  "alto-contraste": false,
  "destacar-links": false,
  "sem-animacoes": false
};

// recupera o que a pessoa escolheu da última vez (ou usa o padrão)
let a11y = JSON.parse(localStorage.getItem("acessibilidade")) || { ...a11yPadrao };

function aplicarAcessibilidade() {
  // tamanho do texto: o Bootstrap usa "rem", então tudo cresce junto com o <html>
  document.documentElement.style.fontSize = tamanhosFonte[a11y.fonte] + "%";

  // liga ou desliga cada opção como uma classe no <html>
  ["alto-contraste", "destacar-links", "sem-animacoes"].forEach(function (opcao) {
    document.documentElement.classList.toggle(opcao, a11y[opcao]);

    const botao = document.querySelector('[data-opcao="' + opcao + '"]');
    botao.setAttribute("aria-pressed", a11y[opcao] ? "true" : "false");
  });

  localStorage.setItem("acessibilidade", JSON.stringify(a11y));
}

// abrir e fechar o painel
function alternarPainel(abrir) {
  painelA11y.hidden = !abrir;
  botaoA11y.setAttribute("aria-expanded", abrir ? "true" : "false");
}

botaoA11y.addEventListener("click", function () {
  alternarPainel(painelA11y.hidden);
});

// tecla Esc fecha o painel
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !painelA11y.hidden) {
    alternarPainel(false);
    botaoA11y.focus();
  }
});

// botões A− / A / A+
document.querySelectorAll("[data-fonte]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const passo = Number(botao.dataset.fonte);

    if (passo === 0) {
      a11y.fonte = 1;
    } else {
      // Math.min / Math.max impedem de passar do menor ou do maior tamanho
      a11y.fonte = Math.min(tamanhosFonte.length - 1, Math.max(0, a11y.fonte + passo));
    }
    aplicarAcessibilidade();
  });
});

// botões liga/desliga (alto contraste, destacar links, pausar animações)
document.querySelectorAll("[data-opcao]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    const opcao = botao.dataset.opcao;
    a11y[opcao] = !a11y[opcao];      // inverte: ligado vira desligado e vice-versa
    aplicarAcessibilidade();
  });
});

// restaurar tudo
document.getElementById("restaurar-a11y").addEventListener("click", function () {
  a11y = { ...a11yPadrao };
  aplicarAcessibilidade();
});


// ---------- 14. AO ABRIR A PÁGINA ----------
// aplica o que estava salvo: tema, idioma e acessibilidade
aplicarTema(sessionStorage.getItem("tema"));
aplicarIdioma(localStorage.getItem("idioma") || "pt");
aplicarAcessibilidade();
aoRolar();
