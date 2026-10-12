import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.tag}>
          Encontrá tu grupo. <span className={styles.lima}>Salí a rodar.</span>
        </span>
        <div className={styles.links}>
          <a href="https://instagram.com/rodaclub.ar">Instagram</a>
          <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>
          <Link href="/privacidad" className={styles.muted}>
            Privacidad
          </Link>
          <Link href="/terminos" className={styles.muted}>
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
