import { Entry, EntrySkeletonType } from "contentful";
import client from "../../../infrastructure/contentful";
import { useQuery } from "@tanstack/react-query";

type BlogPostFields = {
  title: string;
  body: string;
  createdAt: string;
};

async function getPost(
  id: string,
): Promise<Entry<EntrySkeletonType<BlogPostFields>>> {
  const entry = await client.getEntry<EntrySkeletonType<BlogPostFields>>(id);
  return entry;
}

export function useGetPost(id: string) {
  return useQuery<Entry<EntrySkeletonType<BlogPostFields>>, Error>({
    queryKey: ["blogPost", id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });
}
