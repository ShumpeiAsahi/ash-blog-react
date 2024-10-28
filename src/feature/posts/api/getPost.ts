import client from "../../../infrastructure/contentful";
import { useQuery } from "@tanstack/react-query";

type BlogPostFields = {
  title: string;
  body: string;
  createdAt: string;
};

async function getPost(id: string): Promise<{ fields: BlogPostFields }> {
  const entry = await client.getEntry(id);

  const fields = {
    title: entry.fields.title as string,
    body: entry.fields.body as string,
    createdAt: entry.fields.createdAt as string,
  };

  return { fields };
}

export function useGetPost(id: string) {
  return useQuery<{ fields: BlogPostFields }, Error>({
    queryKey: ["blogPost", id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });
}
