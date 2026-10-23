import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { IG_URL, PRIVACIDAD_URL, type MailContent } from "@/lib/mail/content";
import { pieza } from "@/lib/mail/piezas";

// Layout común de los mails de confirmación (design/mails/*.dc.html).
// Tablas de 600 px, colores inline y tipografías con fallback, porque los
// clientes de mail no cargan Archivo ni Inter.
//
// Modo oscuro de Gmail en iPhone: invierte todos los colores del mail. Para que
// se vea igual que el diseño:
// - Cada fondo y cada línea van también como degradé de un color (Gmail no
//   invierte imágenes de fondo). Las líneas son bloques de 1 px, no bordes.
// - Los textos sobre fondo oscuro van dentro de <G>: dos capas con
//   mix-blend-mode que deshacen la inversión (solo se activan en Gmail, por el
//   selector `u + .body`).
// - Todo lo lima o sobre lima es imagen (lib/mail/piezas.ts): ese color no se
//   puede recuperar con CSS. La franja tiene versión para celular.

const C = {
  fondo: "#141408",
  caja: "#1E1E12",
  borde: "#33331F",
  separador: "#2A2A1C",
  blanco: "#FFFFFF",
  hueso: "#EBEAE4",
  secundario: "#A8A898",
  apagado: "#5A5A48",
  lima: "#C6FE04",
  pie: "#0E0E05",
};

const ARCHIVO_FONT_FACE =
  "@font-face{font-family:'Archivo';font-style:italic;font-weight:600 900;" +
  "src:url(https://fonts.gstatic.com/s/archivo/v25/k3kBo8UDI-1M0wlSfdzyIEkpwTM29hr-8mTYCxCmuA.woff2) format('woff2');}";

const GMAIL_DARK_FIX =
  "u + .body .gm-s{background:#000;mix-blend-mode:screen}" +
  "u + .body .gm-d{background:#000;mix-blend-mode:difference}";

// En pantallas angostas se muestra la versión para celular de la franja.
const RESPONSIVE =
  "@media only screen and (max-width:520px){" +
  ".solo-d{display:none !important}" +
  ".solo-m{display:block !important;max-height:none !important;overflow:visible !important}}";

const TITULO = "Archivo, 'Arial Black', Arial, sans-serif";
const TEXTO = "Inter, Arial, sans-serif";

const titulo = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  margin: 0,
  fontFamily: TITULO,
  fontStyle: "italic",
  fontWeight: 900,
  fontSize: size,
  textTransform: "uppercase",
  ...extra,
});

const etiqueta = (color: string, size = 12): React.CSSProperties => ({
  margin: 0,
  fontFamily: TITULO,
  fontStyle: "italic",
  fontWeight: 600,
  fontSize: size,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color,
});

const texto = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  margin: 0,
  fontFamily: TEXTO,
  fontSize: size,
  lineHeight: 1.6,
  color,
  ...extra,
});

// Fondo que Gmail no invierte: color + degradé del mismo color.
const fondo = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  backgroundImage: `linear-gradient(${color},${color})`,
});

// Texto sobre fondo oscuro que mantiene su color en el modo oscuro de Gmail.
function G({ children }: { children: React.ReactNode }) {
  return (
    <span className="gm-s" style={{ display: "block" }}>
      <span className="gm-d" style={{ display: "block" }}>
        {children}
      </span>
    </span>
  );
}

// Línea de 1 px que no se invierte.
function Linea({ color, style }: { color: string; style?: React.CSSProperties }) {
  return <div style={{ ...fondo(color), height: 1, lineHeight: "1px", fontSize: 1, ...style }}>&nbsp;</div>;
}

export function Confirmacion({ c, assetsUrl }: { c: MailContent; assetsUrl: string }) {
  const img = (id: string, alt: string, style: React.CSSProperties = {}, className?: string) => {
    const { width, height } = pieza(id);
    return (
      <Img
        src={`${assetsUrl}/${id}.png`}
        width={width}
        height={height}
        alt={alt}
        className={className}
        style={{ display: "block", maxWidth: "100%", height: "auto", ...style }}
      />
    );
  };

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        {/* Solo declara Archivo (los clientes que cargan fuentes web la usan en
            los títulos) y el arreglo del modo oscuro de Gmail. */}
        <style>{ARCHIVO_FONT_FACE + GMAIL_DARK_FIX + RESPONSIVE}</style>
      </Head>
      <Preview>{c.preheader}</Preview>
      <Body className="body" style={{ margin: 0, padding: 0, ...fondo(C.fondo), color: C.blanco }}>
        <Container style={{ width: "100%", maxWidth: 600, ...fondo(C.fondo) }}>
          {/* Header */}
          <Section style={{ padding: "32px 40px 0" }}>
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Img src={`${assetsUrl}/logo.png`} width={85} height={28} alt="RODA" style={{ display: "block" }} />
              </Column>
              <Column align="right" style={{ verticalAlign: "middle" }}>
                <Text style={etiqueta(C.secundario)}>
                  <G>{c.eyebrow}</G>
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={{ padding: "56px 40px 40px" }}>
            {img(`h1-${c.tipo}`, c.h1.join(" "))}
            <Text style={texto(17, C.hueso, { marginTop: 22 })}>
              <G>{c.saludo}</G>
            </Text>
            <Text style={texto(17, C.hueso, { marginTop: 22 })}>
              <G>{c.intro}</G>
            </Text>
          </Section>

          {/* Pase: el borde es un marco de 1 px con degradé */}
          <Section style={{ padding: "0 40px 44px" }}>
            <Section style={{ ...fondo(C.borde), borderRadius: 24, padding: 1 }}>
              <Section style={{ ...fondo(C.caja), borderRadius: 23, padding: "24px 26px" }}>
                <Row>
                  <Column style={{ verticalAlign: "middle" }}>
                    <Text style={titulo(20, { lineHeight: 1.2, color: C.blanco })}>
                      <G>{c.pase.titulo}</G>
                    </Text>
                  </Column>
                  <Column
                    align="right"
                    style={{ width: pieza(`chip-${c.tipo}`).width + 12, verticalAlign: "middle", paddingLeft: 12 }}
                  >
                    {img(`chip-${c.tipo}`, c.pase.chip, { marginLeft: "auto" })}
                  </Column>
                </Row>
                <Row style={{ marginTop: 18 }}>
                  {c.pase.celdas.map((celda, i) => (
                    <Column
                      key={celda.label}
                      style={{
                        width: "33.33%",
                        verticalAlign: "top",
                        paddingLeft: i === 0 ? 0 : 5,
                        paddingRight: i === 2 ? 0 : 5,
                      }}
                    >
                      <div style={{ ...fondo(C.fondo), borderRadius: 14, padding: "12px 14px" }}>
                        <Text style={texto(12, C.secundario, { lineHeight: 1.4 })}>
                          <G>{celda.label}</G>
                        </Text>
                        <Text style={texto(15, C.blanco, { lineHeight: 1.4, fontWeight: 600, marginTop: 4 })}>
                          <G>{celda.value}</G>
                        </Text>
                      </div>
                    </Column>
                  ))}
                </Row>
              </Section>
            </Section>
          </Section>

          {/* Qué sigue */}
          <Section style={{ padding: "0 40px 44px" }}>
            {img("que-sigue", "Qué sigue")}
            {c.pasos.map((paso, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <Section key={i} style={{ marginTop: 16 }}>
                  <Linea color={C.separador} />
                  <Row>
                    <Column style={{ width: 58, verticalAlign: "top", paddingTop: 16 }}>
                      {paso.destacado ? (
                        img(`num-${n}`, n)
                      ) : (
                        <Text style={titulo(26, { lineHeight: 1, color: C.apagado })}>
                          <G>{n}</G>
                        </Text>
                      )}
                    </Column>
                    <Column style={{ verticalAlign: "top", paddingTop: 16 }}>
                      <Text
                        style={texto(16, paso.destacado ? C.blanco : C.hueso, {
                          lineHeight: 1.55,
                          fontWeight: paso.destacado ? 600 : 400,
                        })}
                      >
                        <G>{paso.texto}</G>
                      </Text>
                    </Column>
                  </Row>
                </Section>
              );
            })}
          </Section>

          {/* Franja lima */}
          <Section style={{ ...fondo(C.lima), padding: "36px 40px" }}>
            {img(`franja-${c.tipo}`, `${c.franja.titulo} ${c.franja.texto}`, {}, "solo-d")}
            <div className="solo-m" style={{ display: "none", maxHeight: 0, overflow: "hidden", msoHide: "all" } as React.CSSProperties}>
              {img(`franja-${c.tipo}-m`, `${c.franja.titulo} ${c.franja.texto}`, { width: "100%" })}
            </div>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "44px 40px" }}>
            <Text style={texto(16, C.hueso, { lineHeight: 1.55 })}>
              <G>{c.cta}</G>
            </Text>
            <Link href={IG_URL} style={{ display: "inline-block", marginTop: 18 }}>
              {img("boton-ig", "Seguir a @rodaclub.ar")}
            </Link>
            <Text
              style={{
                margin: "36px 0 0",
                fontFamily: TITULO,
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: 18,
                color: C.blanco,
              }}
            >
              <G>Nos vemos en la ruta.</G>
            </Text>
            <Text style={texto(15, C.secundario, { marginTop: 4 })}>
              <G>El equipo de RODA</G>
            </Text>
          </Section>

          {/* Pie */}
          <Linea color={C.separador} />
          <Section style={{ ...fondo(C.pie), padding: "32px 40px" }}>
            {img("pie-tagline", "Encontrá tu grupo. Salí a rodar.")}
            <Text style={texto(12, C.secundario, { marginTop: 14 })}>
              <G>{c.pie}</G>
            </Text>
            <Row style={{ marginTop: 14 }}>
              <Column style={{ width: 72, verticalAlign: "middle" }}>
                <Link href={IG_URL}>{img("pie-instagram", "Instagram")}</Link>
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
                <Text style={texto(12, C.secundario)}>
                  <G>
                    <Link href={PRIVACIDAD_URL} style={{ color: C.secundario }}>
                      Política de privacidad
                    </Link>
                  </G>
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
