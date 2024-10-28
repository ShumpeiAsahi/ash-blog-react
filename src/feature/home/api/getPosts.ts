import { Entry, EntrySkeletonType } from "contentful";
import client from "../../../infrastructure/contentful";
import { useQuery } from "@tanstack/react-query";

type BlogPostFields = {
  title: string;
  createdAt: string;
};

async function getPosts(): Promise<Entry<EntrySkeletonType<BlogPostFields>>[]> {
  const entries = await client.getEntries<EntrySkeletonType<BlogPostFields>>({
    content_type: "blogPost",
    order: ["-sys.createdAt"], // 日付順に降順でソート
    limit: 10,
    select: ["fields.title", "fields.createdAt"],
  });

  return entries.items;
}

export function useGetPosts() {
  return useQuery<Entry<EntrySkeletonType<BlogPostFields>>[], Error>({
    queryKey: ["blogPosts"],
    queryFn: getPosts,
  });
}
