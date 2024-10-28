import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PostsComponent from "../feature/posts/components/PostsComponent";

function Posts() {
  const { id } = useParams<{ id: string }>();
  return (
    <Layout title="ashumpei.com">
      {id ? <PostsComponent id={id} /> : <div>Post ID not found</div>}
    </Layout>
  );
}

export default Posts;
