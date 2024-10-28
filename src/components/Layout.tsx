import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

type Props = {
  title: string;
  children: React.ReactNode;
};

function Layout({ title, children }: Props) {
  return (
    <div className="container">
      <header>
        <Link to={`/`} className={styles.titleContainer}>
          <img src={"/images/myicon.jpg"} className={styles.titleImage} />
          <h1 className={styles.titleText}>{title}</h1>
        </Link>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <p>Copyright 2024 {title}</p>
      </footer>
    </div>
  );
}

export default Layout;
