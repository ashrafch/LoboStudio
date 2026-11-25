import { randomBytes, scryptSync } from "node:crypto";
import { writeFileSync, existsSync } from "node:fs";

const config = ".env.cms";
const passwordFile = ".env.cms-login";
if (existsSync(config) || existsSync(passwordFile)) {
  console.error(
    "Esiste già una configurazione CMS. I file sono stati conservati.",
  );
  process.exitCode = 1;
} else {
  const password = randomBytes(24).toString("base64url");
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  writeFileSync(
    config,
    `CMS_PASSWORD_HASH=${salt.toString("hex")}:${hash.toString("hex")}\n`,
    { flag: "wx", mode: 0o600 },
  );
  writeFileSync(passwordFile, password + "\n", { flag: "wx", mode: 0o600 });
  console.log("Configurazione locale creata. La password è in .env.cms-login.");
}
