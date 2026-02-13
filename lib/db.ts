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

const SCHEMA_SQL = `
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

  CREATE TABLE IF NOT EXISTS catalog_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT,
    price TEXT NOT NULL,
    image TEXT NOT NULL,
    video_src TEXT,
    model_3d_src TEXT,
    images_json TEXT,
    aspect_ratio TEXT NOT NULL DEFAULT 'square',
    tags_json TEXT,
    description TEXT,
    is_new INTEGER NOT NULL DEFAULT 0,
    options_json TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const CATALOG_MIGRATIONS = [
  `ALTER TABLE catalog_items ADD COLUMN artist TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN video_src TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN model_3d_src TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN images_json TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN aspect_ratio TEXT NOT NULL DEFAULT 'square'`,
  `ALTER TABLE catalog_items ADD COLUMN tags_json TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN description TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN is_new INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE catalog_items ADD COLUMN options_json TEXT`,
  `ALTER TABLE catalog_items ADD COLUMN status TEXT NOT NULL DEFAULT 'active'`,
  `ALTER TABLE catalog_items ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE catalog_items ADD COLUMN created_at TEXT NOT NULL DEFAULT (datetime('now'))`,
  `ALTER TABLE catalog_items ADD COLUMN updated_at TEXT NOT NULL DEFAULT (datetime('now'))`,
];

function getSqliteErrorCode(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }
  return "";
}

function isShortReadError(error: unknown): boolean {
  return getSqliteErrorCode(error) === "SQLITE_IOERR_SHORT_READ";
}

function cleanupWalArtifacts(filePath: string) {
  for (const suffix of ["-wal", "-shm"]) {
    const artifact = `${filePath}${suffix}`;
    if (fs.existsSync(artifact)) {
      try {
        fs.unlinkSync(artifact);
      } catch {
        // ignore cleanup errors
      }
    }
  }
}

function backupBrokenDatabaseFiles(filePath: string) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  for (const suffix of ["", "-wal", "-shm"]) {
    const source = `${filePath}${suffix}`;
    if (!fs.existsSync(source)) continue;
    const target = `${source}.corrupt-${stamp}`;
    try {
      fs.renameSync(source, target);
    } catch {
      // best effort backup
    }
  }
}

function configureJournalMode(database: Database.Database) {
  try {
    database.pragma("journal_mode = WAL");
  } catch (error) {
    console.warn(
      `[db] WAL unavailable for ${DB_PATH}, fallback to DELETE journal mode`,
      error,
    );
    cleanupWalArtifacts(DB_PATH);
    try {
      database.pragma("journal_mode = DELETE");
    } catch {
      // keep default mode
    }
  }
}

function applyMigrations(database: Database.Database) {
  database.exec(SCHEMA_SQL);

  try {
    database.exec(`ALTER TABLE requests ADD COLUMN notes TEXT`);
  } catch {
    // column already exists
  }

  for (const migration of CATALOG_MIGRATIONS) {
    try {
      database.exec(migration);
    } catch {
      // column already exists
    }
  }
}

function openDatabaseWithRecovery() {
  let database = new Database(DB_PATH);
  try {
    configureJournalMode(database);
    applyMigrations(database);
    return database;
  } catch (error) {
    if (!isShortReadError(error)) throw error;

    console.error(
      `[db] Detected SQLITE_IOERR_SHORT_READ for ${DB_PATH}. Rebuilding local DB and preserving broken files.`,
      error,
    );
    try {
      database.close();
    } catch {
      // ignore close errors
    }

    backupBrokenDatabaseFiles(DB_PATH);
    cleanupWalArtifacts(DB_PATH);

    database = new Database(DB_PATH);
    configureJournalMode(database);
    applyMigrations(database);
    return database;
  }
}

const db = openDatabaseWithRecovery();

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

export type CatalogItemDbRow = {
  id: number;
  slug: string;
  category: string;
  title: string;
  artist: string | null;
  price: string;
  image: string;
  video_src: string | null;
  model_3d_src: string | null;
  images_json: string | null;
  aspect_ratio: string;
  tags_json: string | null;
  description: string | null;
  is_new: number;
  options_json: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export function listCatalogItems(limit = 500, status?: string) {
  if (status) {
    return db
      .prepare(
        `SELECT id, slug, category, title, artist, price, image, video_src, model_3d_src, images_json, aspect_ratio, tags_json, description, is_new, options_json, status, sort_order, created_at, updated_at
         FROM catalog_items
         WHERE status = ?
         ORDER BY sort_order ASC, datetime(created_at) DESC
         LIMIT ?`,
      )
      .all(status, limit) as CatalogItemDbRow[];
  }

  return db
    .prepare(
      `SELECT id, slug, category, title, artist, price, image, video_src, model_3d_src, images_json, aspect_ratio, tags_json, description, is_new, options_json, status, sort_order, created_at, updated_at
       FROM catalog_items
       ORDER BY sort_order ASC, datetime(created_at) DESC
       LIMIT ?`,
    )
    .all(limit) as CatalogItemDbRow[];
}

export function getCatalogItemById(id: number) {
  return db
    .prepare(
      `SELECT id, slug, category, title, artist, price, image, video_src, model_3d_src, images_json, aspect_ratio, tags_json, description, is_new, options_json, status, sort_order, created_at, updated_at
       FROM catalog_items
       WHERE id = ?`,
    )
    .get(id) as CatalogItemDbRow | undefined;
}

export function getCatalogItemBySlug(slug: string) {
  return db
    .prepare(
      `SELECT id, slug, category, title, artist, price, image, video_src, model_3d_src, images_json, aspect_ratio, tags_json, description, is_new, options_json, status, sort_order, created_at, updated_at
       FROM catalog_items
       WHERE slug = ?`,
    )
    .get(slug) as CatalogItemDbRow | undefined;
}

export function createCatalogItem(input: {
  slug: string;
  category: string;
  title: string;
  artist?: string | null;
  price: string;
  image: string;
  videoSrc?: string | null;
  model3dSrc?: string | null;
  imagesJson?: string | null;
  aspectRatio?: string;
  tagsJson?: string | null;
  description?: string | null;
  isNew?: boolean;
  optionsJson?: string | null;
  status?: string;
  sortOrder?: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO catalog_items
      (slug, category, title, artist, price, image, video_src, model_3d_src, images_json, aspect_ratio, tags_json, description, is_new, options_json, status, sort_order)
    VALUES
      (@slug, @category, @title, @artist, @price, @image, @video_src, @model_3d_src, @images_json, @aspect_ratio, @tags_json, @description, @is_new, @options_json, @status, @sort_order)
  `);

  return stmt.run({
    slug: input.slug,
    category: input.category,
    title: input.title,
    artist: input.artist || null,
    price: input.price,
    image: input.image,
    video_src: input.videoSrc || null,
    model_3d_src: input.model3dSrc || null,
    images_json: input.imagesJson || null,
    aspect_ratio: input.aspectRatio || "square",
    tags_json: input.tagsJson || null,
    description: input.description || null,
    is_new: input.isNew ? 1 : 0,
    options_json: input.optionsJson || null,
    status: input.status || "active",
    sort_order: input.sortOrder || 0,
  });
}

export function updateCatalogItem(
  id: number,
  fields: {
    slug?: string;
    category?: string;
    title?: string;
    artist?: string | null;
    price?: string;
    image?: string;
    videoSrc?: string | null;
    model3dSrc?: string | null;
    imagesJson?: string | null;
    aspectRatio?: string;
    tagsJson?: string | null;
    description?: string | null;
    isNew?: boolean;
    optionsJson?: string | null;
    status?: string;
    sortOrder?: number;
  },
) {
  const updates: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "undefined") continue;
    switch (key) {
      case "videoSrc":
        updates.push("video_src = @video_src");
        params.video_src = value;
        break;
      case "model3dSrc":
        updates.push("model_3d_src = @model_3d_src");
        params.model_3d_src = value;
        break;
      case "imagesJson":
        updates.push("images_json = @images_json");
        params.images_json = value;
        break;
      case "aspectRatio":
        updates.push("aspect_ratio = @aspect_ratio");
        params.aspect_ratio = value;
        break;
      case "tagsJson":
        updates.push("tags_json = @tags_json");
        params.tags_json = value;
        break;
      case "isNew":
        updates.push("is_new = @is_new");
        params.is_new = value ? 1 : 0;
        break;
      case "optionsJson":
        updates.push("options_json = @options_json");
        params.options_json = value;
        break;
      case "sortOrder":
        updates.push("sort_order = @sort_order");
        params.sort_order = value;
        break;
      default:
        updates.push(`${key} = @${key}`);
        params[key] = value;
    }
  }

  if (updates.length === 0) return { changes: 0 };

  updates.push("updated_at = datetime('now')");
  const stmt = db.prepare(
    `UPDATE catalog_items SET ${updates.join(", ")} WHERE id = @id`,
  );
  return stmt.run(params);
}

export function deleteCatalogItem(id: number) {
  return db.prepare(`DELETE FROM catalog_items WHERE id = ?`).run(id);
}

export default db;
