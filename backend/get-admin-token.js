// get-admin-token.js
import Medusa from "@medusajs/medusa-js";

const sdk = new Medusa({
  baseUrl: "http://localhost:9000", // URL вашего Medusa сервера
});

async function getAdminToken(email, password) {
  try {
    const response = await sdk.auth.login("admin", "emailpass", {
      email,
      password,
    });

    const { token, user } = response;

    console.log("✅ JWT Token:", token);
    console.log("👤 Admin user:", user);

    return token;
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

// Пример использования
const email = "sidorenkodima09@gmail.com";          // ваш admin email
const password = "Fnaf1pridumalskot";     // ваш пароль

getAdminToken(email, password);
