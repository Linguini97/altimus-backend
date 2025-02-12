const express = require("express");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0"; // Permite conexões externas

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(bodyParser.json());

// 📌 Exibir variáveis de ambiente carregadas
console.log("🔍 Verificando variáveis de ambiente...");
console.log("🟢 BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Carregada ✅" : "❌ NÃO CARREGADA!");
console.log("🟢 SMTP_EMAIL:", process.env.SMTP_EMAIL ? process.env.SMTP_EMAIL : "❌ NÃO CARREGADO!");

// Configuração da API da Brevo (Sendinblue)
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY || "";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// 📌 Função para enviar e-mails
async function enviarEmail(assunto, conteudoEmail) {
  const remetente = process.env.SMTP_EMAIL || "remetente@exemplo.com"; // Evita valores indefinidos
  const destinatario = "atendimento@altimuscorretora.com.br"; // E-mail fixo de destino

  const sendSmtpEmail = {
    sender: { email: remetente, name: "Altimus Corretora" },
    to: [{ email: destinatario }],
    subject: assunto,
    htmlContent: conteudoEmail
  };

  console.log("📤 Tentando enviar e-mail...");
  console.log("📧 Dados do e-mail:", JSON.stringify(sendSmtpEmail, null, 2));

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ E-mail enviado com sucesso!", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error.response?.data || error.message);
    console.error("🔴 Verifique se `BREVO_API_KEY` e `SMTP_EMAIL` estão corretos!");
    throw new Error("Erro ao enviar e-mail");
  }
}

// 📌 Rota para verificar se o servidor está rodando
app.get("/", (req, res) => {
  res.send("🚀 API do servidor está rodando!");
});

// 📌 Rota para envio de formulário de contato
app.post("/enviar-email-contato", async (req, res) => {
  console.log("📩 Requisição recebida para enviar-email-contato");
  console.log("📦 Dados recebidos:", req.body);

  const { nome, email, telefone, mensagem } = req.body;

  if (!nome || !email || !telefone || !mensagem) {
    console.error("❌ Erro: Campos obrigatórios ausentes!", req.body);
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  const assunto = "Novo Contato do Site - Altimus Corretora";
  const conteudoEmail = `
    <h2>Nova Mensagem de Contato</h2>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefone:</strong> ${telefone}</p>
    <p><strong>Mensagem:</strong> ${mensagem}</p>
  `;

  try {
    await enviarEmail(assunto, conteudoEmail);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail.", error: error.message });
  }
});

// 📌 Rota para envio de formulário de cotação
app.post("/enviar-email-cotacao", async (req, res) => {
  console.log("📩 Requisição recebida para enviar-email-cotacao");
  console.log("📦 Dados recebidos:", req.body);

  const { nome, email, telefone, tipoSeguro, preferenciaContato, ramo } = req.body;

  if (!nome || !email || !telefone || !tipoSeguro || !preferenciaContato || !ramo) {
    console.error("❌ Erro: Campos obrigatórios ausentes!", req.body);
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  const assunto = `Nova Solicitação de Cotação - ${tipoSeguro}`;
  const conteudoEmail = `
    <h2>Nova Solicitação de Cotação</h2>
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefone:</strong> ${telefone}</p>
    <p><strong>Tipo de Seguro:</strong> ${tipoSeguro}</p>
    <p><strong>Preferência de Contato:</strong> ${preferenciaContato}</p>
    <p><strong>Ramo:</strong> ${ramo}</p>
  `;

  try {
    await enviarEmail(assunto, conteudoEmail);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail.", error: error.message });
  }
});

// 📌 Iniciar o servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});

