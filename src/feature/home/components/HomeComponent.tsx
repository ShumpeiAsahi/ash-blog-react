import { Link } from "react-router-dom";
import { useGetPosts } from "../api/getPosts";
import { dateFormat } from "../../../utils/dateFormat";
import styles from "./HomeComponent.module.css";

function HomeComponent() {
  const { data, error, isLoading } = useGetPosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const posts = data.map((post) => ({
    id: post.sys.id,
    title: post.fields.title,
    createdAt: post.fields.createdAt,
  }));

  return (
    <div className={styles.homeContainer}>
      <p className={styles.description}>技術ブログです。</p>
      <div>
        <h2 className={styles.subtitle}>最新記事</h2>
        <div className={styles.latestPostList}>
          {posts.map((post) => {
            const createdAt = dateFormat(post.createdAt as string);
            return (
              <p key={post.id}>
                <span>{createdAt} </span>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
