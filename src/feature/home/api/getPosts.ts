import client from "../../../infrastructure/contentful";
import { useQuery } from "@tanstack/react-query";

type BlogPostFields = {
  id: string;
  title: string;
  createdAt: string;
};

async function getPosts(): Promise<{ fields: BlogPostFields }[]> {
  const entries = await client.getEntries({
    content_type: "blogPost",
    order: ["-fields.createdAt"], // 日付順に降順でソート
    limit: 10,
    select: ["fields.title", "fields.body", "fields.createdAt"],
  });

  // 各エントリの fields に型アサーションを適用して返す
  return entries.items.map((entry) => ({
    fields: {
      id: entry.sys.id,
      title: entry.fields.title as string,
      createdAt: entry.fields.createdAt as string,
    },
  }));
}

// useGetPostsカスタムフックの定義
export function useGetPosts() {
  return useQuery<{ fields: BlogPostFields }[], Error>({
    queryKey: ["blogPosts"],
    queryFn: getPosts,
  });
}
