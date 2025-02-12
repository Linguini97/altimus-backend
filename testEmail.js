const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// 📌 Exibir credenciais carregadas para depuração
console.log("🔍 Verificando credenciais carregadas do .env:");
console.log("📧 BREVO_API_KEY:", process.env.BREVO_API_KEY ? "OK" : "⚠️ NÃO DEFINIDO");
console.log("📤 SMTP_EMAIL:", process.env.SMTP_EMAIL || "⚠️ NÃO DEFINIDO");

// 📌 Configuração correta da autenticação
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// 📌 Opções do e-mail de teste
const sendSmtpEmail = {
  sender: { email: process.env.SMTP_EMAIL, name: "Altimus Corretora" },
  to: [{ email: "vfo979797@gmail.com" }], // 🔹 Substitua pelo e-mail de destino
  subject: "Teste de E-mail - Diagnóstico SMTP",
  htmlContent: `<p>Este é um teste para verificar a configuração do Brevo SMTP.</p>`
};

// 📌 Tentar enviar o e-mail e capturar logs detalhados
console.log("📨 Tentando enviar um e-mail de teste...");

apiInstance.sendTransacEmail(sendSmtpEmail)
  .then((data) => {
    console.log("✅ E-mail enviado com sucesso!");
    console.log("📨 Resposta do servidor:", data);
  })
  .catch((error) => {
    console.error("❌ Erro ao enviar e-mail:");
    console.error("➡️ Código do erro:", error.response?.status || "Não disponível");
    console.error("➡️ Mensagem do erro:", error.response?.data || error.message);
  });
