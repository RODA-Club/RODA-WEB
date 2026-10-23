import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { Footer } from "./Footer";
import styles from "./LegalPage.module.css";
import { Logo } from "./Logo";

export function LegalPage({
  title,
  fecha = LEGAL.fecha,
  children,
}: {
  title: string;
  fecha?: string;
  children: React.ReactNode;
}) {
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
        <p className={styles.updated}>Última actualización: {fecha}</p>
        <div className={styles.body}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
