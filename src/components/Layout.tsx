import { useNavigate } from 'react-router-dom';
import BuyMeACoffeeButton from './ByMeACoffeeButton';
import styles from './Layout.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
};

function Layout({ title, children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="container">
      <header>
        <button className={styles.titleContainer} onClick={() => navigate('/')}>
          <img src={'/images/logo2.svg'} className={styles.titleImage} />
          <h1 className={styles.titleText}>{title}</h1>
        </button>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.buyMeACoffee}>
          <p>\\ コーヒー１杯分支援していただけると嬉しいです！ //</p>
          <BuyMeACoffeeButton />
        </div>
        <p className={styles.links}>
          <a href="/terms">免責事項</a> |
          <a href="/commerce-disclosure-page">特定商取引法に基づく表記</a> |
          <a href="https://x.com/shumpeiasahi" target={'_blank'}>
            お問い合わせ(運営者X)
          </a>
        </p>

        <p>Copyright 2024 ウチの子寝顔ベスト3</p>
      </footer>
    </div>
  );
}

export default Layout;