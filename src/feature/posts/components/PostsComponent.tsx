import { useGetPost } from "../api/getPost";
import { dateFormat } from "../../../utils/dateFormat";
import ReactMarkdown from "react-markdown";
import styles from "./PostsComponent.module.css";

function PostsComponent({ id }: { id: string }) {
  const { data, error, isLoading } = useGetPost(id);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const createdAt = dateFormat(data.fields.createdAt as string);

  return (
    <div>
      <div className={styles.titleContainer}>
        <p>{createdAt}</p>
        <h1>{data.fields.title}</h1>
      </div>
      <div className={styles.post}>
        <ReactMarkdown>{data.fields.body}</ReactMarkdown>
      </div>
    </div>
  );
}

export default PostsComponent;
