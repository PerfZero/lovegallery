import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH =
  process.env.ADMIN_DB_PATH || path.join(process.cwd(), "data", "app.db");

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(DB_PATH);

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_type TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    product TEXT,
    price TEXT,
    options_json TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    excerpt TEXT,
    category TEXT,
    date TEXT,
    read_time TEXT,
    image TEXT,
    content_text TEXT,
    content_json TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`);

// Lightweight migration for older DBs
try {
  db.exec(`ALTER TABLE requests ADD COLUMN notes TEXT`);
} catch {
  // column already exists
}

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function createUser(
  email: string,
  passwordHash: string,
  role = "admin",
) {
  return db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
    .run(email, passwordHash, role);
}

export function getUserById(id: number) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function createRequest(input: {
  formType: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  product?: string;
  price?: string;
  options?: unknown;
}) {
  const stmt = db.prepare(`
    INSERT INTO requests
      (form_type, name, email, phone, subject, message, product, price, options_json)
    VALUES
      (@formType, @name, @email, @phone, @subject, @message, @product, @price, @optionsJson)
  `);

  return stmt.run({
    formType: input.formType,
    name: input.name || null,
    email: input.email || null,
    phone: input.phone || null,
    subject: input.subject || null,
    message: input.message || null,
    product: input.product || null,
    price: input.price || null,
    optionsJson: input.options ? JSON.stringify(input.options) : null,
  });
}

export function listRequests(limit = 100) {
  return db
    .prepare(
      `SELECT id, form_type, name, email, phone, subject, message, product, price, options_json, notes, status, priority, created_at
       FROM requests
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .all(limit);
}

export function getRequestById(id: number) {
  return db
    .prepare(
      `SELECT id, form_type, name, email, phone, subject, message, product, price, options_json, notes, status, priority, created_at
       FROM requests
       WHERE id = ?`,
    )
    .get(id);
}

export function updateRequest(
  id: number,
  fields: { status?: string; priority?: number; notes?: string | null },
) {
  const updates: string[] = [];
  const params: Record<string, unknown> = { id };

  if (fields.status) {
    updates.push("status = @status");
    params.status = fields.status;
  }
  if (typeof fields.priority === "number") {
    updates.push("priority = @priority");
    params.priority = fields.priority;
  }
  if (typeof fields.notes === "string") {
    updates.push("notes = @notes");
    params.notes = fields.notes;
  }

  if (updates.length === 0) return { changes: 0 };

  const stmt = db.prepare(
    `UPDATE requests SET ${updates.join(", ")} WHERE id = @id`,
  );
  return stmt.run(params);
}

export function listBlogPosts(limit = 200) {
  return db
    .prepare(
      `SELECT id, slug, title, subtitle, excerpt, category, date, read_time, image, status, created_at, updated_at
       FROM blog_posts
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .all(limit);
}

export function listBlogCategories() {
  return db
    .prepare(`SELECT id, name FROM blog_categories ORDER BY name ASC`)
    .all();
}

export function createBlogCategory(name: string) {
  return db
    .prepare(`INSERT OR IGNORE INTO blog_categories (name) VALUES (?)`)
    .run(name);
}

export function getBlogPostBySlug(slug: string) {
  return db
    .prepare(
      `SELECT id, slug, title, subtitle, excerpt, category, date, read_time, image, content_text, content_json, status, created_at, updated_at
       FROM blog_posts
       WHERE slug = ?`,
    )
    .get(slug);
}

export function getBlogPostById(id: number) {
  return db
    .prepare(
      `SELECT id, slug, title, subtitle, excerpt, category, date, read_time, image, content_text, content_json, status, created_at, updated_at
       FROM blog_posts
       WHERE id = ?`,
    )
    .get(id);
}

export function createBlogPost(input: {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  category?: string;
  date?: string;
  readTime?: string;
  image?: string;
  contentText?: string;
  contentJson?: string;
  status?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO blog_posts
      (slug, title, subtitle, excerpt, category, date, read_time, image, content_text, content_json, status)
    VALUES
      (@slug, @title, @subtitle, @excerpt, @category, @date, @read_time, @image, @content_text, @content_json, @status)
  `);
  return stmt.run({
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle || null,
    excerpt: input.excerpt || null,
    category: input.category || null,
    date: input.date || null,
    read_time: input.readTime || null,
    image: input.image || null,
    content_text: input.contentText || null,
    content_json: input.contentJson || null,
    status: input.status || "published",
  });
}

export function updateBlogPost(
  id: number,
  fields: {
    slug?: string;
    title?: string;
    subtitle?: string | null;
    excerpt?: string | null;
    category?: string | null;
    date?: string | null;
    readTime?: string | null;
    image?: string | null;
    contentText?: string | null;
    contentJson?: string | null;
    status?: string;
  },
) {
  const updates: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "undefined") continue;
    switch (key) {
      case "readTime":
        updates.push("read_time = @read_time");
        params.read_time = value;
        break;
      case "contentText":
        updates.push("content_text = @content_text");
        params.content_text = value;
        break;
      case "contentJson":
        updates.push("content_json = @content_json");
        params.content_json = value;
        break;
      default:
        updates.push(`${key} = @${key}`);
        params[key] = value;
    }
  }

  if (updates.length === 0) return { changes: 0 };

  updates.push("updated_at = datetime('now')");
  const stmt = db.prepare(
    `UPDATE blog_posts SET ${updates.join(", ")} WHERE id = @id`,
  );
  return stmt.run(params);
}

export function deleteBlogPost(id: number) {
  return db.prepare(`DELETE FROM blog_posts WHERE id = ?`).run(id);
}

export default db;
