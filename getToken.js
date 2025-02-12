require('dotenv').config();
const { google } = require('googleapis');

// 📌 Exibir credenciais carregadas do .env para depuração
console.log("🔍 Verificando credenciais carregadas do .env:");
console.log("📧 CLIENT_ID:", process.env.CLIENT_ID || "⚠️ NÃO DEFINIDO");
console.log("🔑 CLIENT_SECRET:", process.env.CLIENT_SECRET ? "******" : "⚠️ NÃO DEFINIDO");
console.log("🔄 REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "******" : "⚠️ NÃO DEFINIDO");

// 📌 Criar cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

async function getAccessToken() {
  try {
    console.log("🔄 Solicitando token de acesso...");

    const { token } = await oauth2Client.getAccessToken();

    console.log("✅ Token de Acesso obtido com sucesso!");
    console.log("🔑 Token:", token);

    return token;
  } catch (error) {
    console.error("❌ Erro ao obter token de acesso:");
    
    // Exibir detalhes do erro
    console.error("➡️ Código do erro:", error.code || "Não disponível");
    console.error("➡️ Mensagem do erro:", error.message || "Sem mensagem específica");

    if (error.response) {
      console.error("➡️ Resposta do servidor:", error.response.data || error.response.statusText);
      console.error("➡️ Status HTTP:", error.response.status);
    }

    console.error("⚠️ Verifique se suas credenciais estão corretas e se o OAuth foi configurado corretamente.");

    process.exit(1); // Encerra o script com erro
  }
}

// Executar a função para obter o token
getAccessToken();
