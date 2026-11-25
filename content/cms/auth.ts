import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { activeDatabase, database } from "./store";

const derive = promisify(scrypt);
const lifetime = 60 * 60 * 8;
const cookie = "lobo_admin_session";
const hash = (value: string) =>
  createHash("sha256")
    .update(process.env.CMS_PASSWORD_HASH ?? "")
    .update(":")
    .update(value)
    .digest("hex");

function origin(key: "CMS_ORIGIN" | "CMS_ADMIN_ORIGIN" = "CMS_ORIGIN") {
  const value = process.env[key];
  if (!value) return;
  const parsed = URL.parse(value);
  if (!parsed || parsed.origin !== value) return;
  if (
    parsed.protocol === "https:" ||
    (parsed.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname))
  )
    return parsed;
}

function adminConfigured() {
  return Boolean(
    process.env.CMS_DB_PATH &&
    /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(process.env.CMS_PASSWORD_HASH ?? ""),
  );
}

export function adminEnabled() {
  return adminConfigured() && Boolean(origin());
}

export function adminHref() {
  if (!adminConfigured()) return;
  const target = origin() ?? origin("CMS_ADMIN_ORIGIN");
  if (target) return new URL("/admin", target).href;
}

export async function assertOrigin() {
  if (!adminEnabled() || (await headers()).get("origin") !== origin()?.origin) {
    throw new Error("Richiesta non autorizzata.");
  }
}

export async function hasSession() {
  if (!adminEnabled()) return false;
  const token = (await cookies()).get(cookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return !!database()
    ?.prepare("SELECT 1 FROM sessions WHERE hash=? AND expires>?")
    .get(hash(token), Date.now());
}

export async function requireAdmin() {
  if (!(await hasSession())) redirect("/admin");
}

export async function login(password: unknown) {
  await assertOrigin();
  if (typeof password !== "string" || password.length > 256) return false;
  const db = activeDatabase();
  const now = Date.now();
  const limit = db
    .prepare(
      `
    INSERT INTO login_limits VALUES(1,1,?)
    ON CONFLICT(id) DO UPDATE SET
      attempts=CASE WHEN reset_at<=? THEN 1 ELSE attempts+1 END,
      reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END
    WHERE reset_at<=? OR attempts<8
    RETURNING attempts
  `,
    )
    .get(now + 600000, now, now, now);
  if (!limit) return false;
  const [salt, expected] = process.env.CMS_PASSWORD_HASH!.split(":");
  const actual = (await derive(
    password,
    Buffer.from(salt, "hex"),
    64,
  )) as Buffer;
  if (!timingSafeEqual(actual, Buffer.from(expected, "hex"))) return false;
  const jar = await cookies();
  const previous = jar.get(cookie)?.value;
  if (previous)
    db.prepare("DELETE FROM sessions WHERE hash=?").run(hash(previous));
  db.prepare("DELETE FROM sessions WHERE expires<=?").run(now);
  db.prepare("DELETE FROM login_limits").run();
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES(?,?)").run(
    hash(token),
    now + lifetime * 1000,
  );
  jar.set(cookie, token, {
    httpOnly: true,
    secure: origin()?.protocol === "https:",
    sameSite: "strict",
    maxAge: lifetime,
    path: "/",
  });
  return true;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(cookie)?.value;
  if (token)
    database()?.prepare("DELETE FROM sessions WHERE hash=?").run(hash(token));
  jar.delete(cookie);
}
