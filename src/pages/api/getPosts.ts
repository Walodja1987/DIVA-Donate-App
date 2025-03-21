import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { Post } from "@/pages";

const postsDirectory = join(process.cwd(), "_posts");

export function getAllSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .map((post) => post.replace(/\.mdx?$/, ""));
}

export function getPostBySlug(slug: string) {
  const fullPath = join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const data = matter(fileContents);

  return {
    content: data.content,
    ...data.data,
    slug,
  } as Omit<Post, "date"> & { date: Date };
}

export function getAllPosts() {
  return getAllSlugs().map((post) => getPostBySlug(post));
}
