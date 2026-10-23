import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { RideCard } from "@/components/RideCard";
import { SignupForm } from "@/components/SignupForm";
import { SumateLink } from "@/components/SumateLink";
import styles from "./page.module.css";

const PASOS = [
  { n: "01", title: "Contá cómo rodás", text: "Tu bici, tu ritmo, tu zona y cuándo podés salir. Dos minutos." },
  { n: "02", title: "Encontrá grupos compatibles", text: "Ves velocidad, distancia, cuántos van, dónde se juntan y si reciben gente nueva." },
  { n: "03", title: "Salí con ellos", text: "Confirmás, vas, y el GPS del grupo hace que nadie quede atrás." },
];

const LIDERES = [
  { title: "Salidas con cupo y confirmación", text: "Punto de encuentro, parada de café y etiqueta de \"abierta a nuevos\"." },
  { title: "Gente de tu nivel", text: "La compatibilidad filtra antes de que alguien aparezca y no pueda seguir el ritmo." },
  { title: "El grupo en vivo", text: "Ves dónde está cada uno durante la salida. Si alguien se corta, te enterás." },
  { title: "Grupo fundador", text: "Los primeros grupos entran antes de la apertura y aparecen primero cuando abra el piloto." },
];

const PREGUNTAS = [
  { q: "¿Qué es un pelotón?", a: "Así se le dice a un grupo de ciclistas que sale a rodar juntos. Pueden ser cinco amigos que salen los sábados o un club de cuarenta." },
  { q: "¿Cuánto cuesta?", a: "Para ciclistas y líderes de grupo, RODA es gratuita." },
  { q: "¿Cuándo sale la app?", a: "El piloto abre en marzo 2027. Los grupos fundadores la prueban antes, en febrero." },
  { q: "¿Dónde funciona?", a: "Arrancamos en Buenos Aires y vamos abriendo zonas según dónde se anote más gente. Por eso te pedimos la tuya: las zonas con más grupos anotados son las primeras en abrir." },
  { q: "Nunca salí en grupo. ¿Es para mí?", a: "Sí. RODA te muestra solo grupos de tu ritmo y te avisa cuáles reciben gente nueva. La idea es que nadie quede atrás." },
];

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <a href="#inicio" aria-label="RODA, inicio" className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
          <nav aria-label="Principal" className={styles.nav}>
            <a href="#lideres" className={styles.navLink}>Líderes</a>
            <a href="#locales" className={styles.navLink}>Locales</a>
            <a href="#sumate" className={`btn btnPrimary ${styles.navCta}`}>Sumate</a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="inicio" className={`container ${styles.hero}`}>
          <div className={styles.heroText}>
            <p className="eyebrow">Piloto 2027 · Buenos Aires</p>
            <h1 className={styles.h1}>
              Encontrá tu grupo. <span className={styles.lima}>Salí a rodar.</span>
            </h1>
            <p className={styles.heroLead}>
              RODA te conecta con grupos de ciclistas de tu nivel, tu ritmo y tu zona. Antes de ir ya sabés a qué
              velocidad van, cuántos son y dónde se juntan. Nadie queda atrás.
            </p>
            <div className={styles.heroCtas}>
              <SumateLink tipo="ciclista" className={`btn btnPrimary ${styles.ctaBig}`}>
                Anotate en la lista
              </SumateLink>
              <SumateLink tipo="lider" className={`btn btnGhost ${styles.ctaBigGhost}`}>
                Organizo un grupo
              </SumateLink>
            </div>
            <p className={styles.heroNote}>Gratis para ciclistas y líderes de grupo.</p>
          </div>
          <div className={styles.heroCard}>
            <RideCard />
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className={styles.how}>
          <div className={`container ${styles.howInner}`}>
            <div className={styles.howHead}>
              <p className={`eyebrow ${styles.eyebrowOnLight}`}>Cómo funciona</p>
              <h2 className="h2">Sin adivinar si vas a dar la talla.</h2>
            </div>
            <div className={styles.steps}>
              {PASOS.map((p) => (
                <div key={p.n} className={styles.step}>
                  <span className={styles.stepNum}>{p.n}</span>
                  <h3 className={styles.stepTitle}>{p.title}</h3>
                  <p className={styles.stepText}>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LÍDERES */}
        <section id="lideres" className={`container ${styles.leaders}`}>
          <div className={styles.leadersText}>
            <p className="eyebrow">Para quienes organizan un grupo</p>
            <h2 className="h2">Tu grupo, sin el caos del WhatsApp.</h2>
            <p className={styles.lead}>
              Publicás la salida una vez y RODA se encarga del resto: quién confirma, cuánto cupo queda y quién se
              suma con el nivel justo.
            </p>
            <SumateLink tipo="lider" className={`btn btnPrimary ${styles.ctaMid}`}>
              Sumá tu grupo
            </SumateLink>
          </div>
          <ul className={styles.features}>
            {LIDERES.map((f) => (
              <li key={f.title} className={styles.feature}>
                <span className={styles.featureTitle}>{f.title}</span>
                <span className={styles.featureText}>{f.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* LOCALES */}
        <section id="locales" className={styles.locales}>
          <div className={`container ${styles.localesInner}`}>
            <div className={styles.localesText}>
              <p className={`eyebrow ${styles.eyebrowOnLima}`}>Para cafés, bares y bicicleterías</p>
              <h2 className="h2">Que el pelotón pare en tu puerta.</h2>
              <p className={styles.localesLead}>
                Aparecé en el mapa y como parada de las salidas de la zona. Con el GPS vas a saber cuántos ciclistas
                pasaron de verdad por tu local, no una estimación.
              </p>
            </div>
            <div className={styles.founder}>
              <span className={styles.founderTitle}>Aliado fundador</span>
              <p className={styles.founderText}>
                Sin costo durante todo el piloto. Los primeros locales entran antes de que abra la app.
              </p>
              <SumateLink tipo="local" className={`btn btnPrimary ${styles.ctaSmall}`}>
                Sumar mi negocio
              </SumateLink>
              <p className={styles.founderBrand}>
                ¿Tenés una marca?{" "}
                <SumateLink tipo="local" className={styles.founderBrandLink}>
                  También podés sumarte.
                </SumateLink>
              </p>
            </div>
          </div>
        </section>

        {/* POR QUÉ RODA */}
        <section id="nosotros" className={`container ${styles.why}`}>
          <div className={styles.whyInner}>
            <p className="eyebrow">Por qué RODA</p>
            <h2 className="h2">Salir en grupo no debería depender de a quién conocés.</h2>
            <p className={styles.whyText}>
              RODA empezó hablando con ciclistas de la zona y aparecieron dos problemas. El que sale solo no se anima a
              sumarse a un grupo porque no sabe si va a poder seguir el ritmo. Y el que ya tiene grupo organiza todo en
              un WhatsApp donde nadie sabe bien quién va ni a qué hora.
            </p>
            <p className={styles.whyText}>
              RODA junta las dos puntas: te muestra cada grupo como es antes de ir, y le ordena la salida a quien la
              organiza.
            </p>
            <p className={styles.whyContact}>
              ¿Tenés un grupo o un local y querés hablar antes? Escribinos a{" "}
              <a href="mailto:roda.club.app@gmail.com">roda.club.app@gmail.com</a>
            </p>
          </div>
        </section>

        {/* FORMULARIO */}
        <section id="sumate" className={styles.signup}>
          <div className={styles.signupHead}>
            <p className="eyebrow">Lista de espera</p>
            <h2 className="h2">Sumate antes que nadie.</h2>
            <p className={styles.signupLead}>El piloto abre en marzo 2027. Te avisamos primero.</p>
          </div>
          <SignupForm />
        </section>

        {/* PREGUNTAS */}
        <section className={styles.faq}>
          <div className={styles.faqInner}>
            <h2 className={styles.faqTitle}>Preguntas</h2>
            {PREGUNTAS.map((p) => (
              <details key={p.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{p.q}</summary>
                <p className={styles.faqA}>{p.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
