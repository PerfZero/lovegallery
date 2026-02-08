import { blogArticles } from "@/data/blog-articles";
import db, { createBlogPost } from "@/lib/db";

export function ensureBlogSeeded() {
  const row = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number };
  if (row.count > 0) return;

  Object.entries(blogArticles).forEach(([slug, article]) => {
    createBlogPost({
      slug,
      title: article.title,
      subtitle: null,
      excerpt: article.excerpt,
      category: article.category,
      date: article.date,
      readTime: article.readTime,
      image: article.image,
      contentText: article.content,
      contentJson: null,
      status: "published",
    });
  });
}
