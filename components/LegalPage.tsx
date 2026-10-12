import Link from "next/link";
import { Footer } from "./Footer";
import styles from "./LegalPage.module.css";
import { Logo } from "./Logo";

export function LegalPage({ title }: { title: string }) {
  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" aria-label="RODA, inicio" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </Link>
          <Link href="/" className={styles.back}>
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className="h2">{title}</h1>
        <p className={styles.text}>[TEXTO LEGAL PENDIENTE]</p>
        <p className={styles.contact}>
          Consultas: <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
