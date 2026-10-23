import {
  Body,
  Button,
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
import { IG_BUTTON, IG_URL, PRIVACIDAD_URL, type MailContent } from "@/lib/mail/content";

// Layout común de los mails de confirmación (design/mails/*.dc.html).
// Tablas de 600 px, colores inline y tipografías con fallback, porque los
// clientes de mail no cargan Archivo ni Inter.

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
  sobreLima: "#2A2A14",
  pie: "#0E0E05",
};

const ARCHIVO_FONT_FACE =
  "@font-face{font-family:'Archivo';font-style:italic;font-weight:600 900;" +
  "src:url(https://fonts.gstatic.com/s/archivo/v25/k3kBo8UDI-1M0wlSfdzyIEkpwTM29hr-8mTYCxCmuA.woff2) format('woff2');}";

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

export function Confirmacion({ c, assetsUrl }: { c: MailContent; assetsUrl: string }) {
  const ultima = c.h1.length - 1;

  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        {/* Solo declara Archivo (los clientes que cargan fuentes web la usan en
            los títulos); no la aplica a todo como haría <Font>. */}
        <style>{ARCHIVO_FONT_FACE}</style>
      </Head>
      <Preview>{c.preheader}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: C.fondo, color: C.blanco }}>
        <Container style={{ width: "100%", maxWidth: 600, backgroundColor: C.fondo }}>
          {/* Header */}
          <Section style={{ padding: "32px 40px 0" }}>
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Img src={`${assetsUrl}/logo.png`} width={85} height={28} alt="RODA" style={{ display: "block" }} />
              </Column>
              <Column align="right" style={{ verticalAlign: "middle" }}>
                <Text style={etiqueta(C.secundario)}>{c.eyebrow}</Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={{ padding: "56px 40px 40px" }}>
            <Text style={titulo(54, { lineHeight: "0.98", letterSpacing: "-0.01em", color: C.blanco })}>
              {c.h1.map((linea, i) => (
                <span key={i}>
                  {i === ultima ? <span style={{ color: C.lima }}>{linea}</span> : linea}
                  {i < ultima && <br />}
                </span>
              ))}
            </Text>
            <Text style={texto(17, C.hueso, { marginTop: 22 })}>{c.saludo}</Text>
            <Text style={texto(17, C.hueso, { marginTop: 22 })}>{c.intro}</Text>
          </Section>

          {/* Pase */}
          <Section style={{ padding: "0 40px 44px" }}>
            <Section
              style={{
                backgroundColor: C.caja,
                border: `1px solid ${C.borde}`,
                borderRadius: 24,
                padding: "24px 26px",
              }}
            >
              <Row>
                <Column style={{ verticalAlign: "middle" }}>
                  <Text style={titulo(20, { lineHeight: 1.2, color: C.blanco })}>{c.pase.titulo}</Text>
                </Column>
                <Column align="right" style={{ verticalAlign: "middle", paddingLeft: 12, whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: C.lima,
                      color: C.fondo,
                      fontFamily: TEXTO,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.pase.chip}
                  </span>
                </Column>
              </Row>
              <Row style={{ marginTop: 18 }}>
                {c.pase.celdas.map((celda, i) => (
                  <Column
                    key={celda.label}
                    style={{ width: "33.33%", verticalAlign: "top", paddingLeft: i === 0 ? 0 : 5, paddingRight: i === 2 ? 0 : 5 }}
                  >
                    <div style={{ backgroundColor: C.fondo, borderRadius: 14, padding: "12px 14px" }}>
                      <Text style={texto(12, C.secundario, { lineHeight: 1.4 })}>{celda.label}</Text>
                      <Text style={texto(15, C.blanco, { lineHeight: 1.4, fontWeight: 600, marginTop: 4 })}>
                        {celda.value}
                      </Text>
                    </div>
                  </Column>
                ))}
              </Row>
            </Section>
          </Section>

          {/* Qué sigue */}
          <Section style={{ padding: "0 40px 44px" }}>
            <Text style={etiqueta(C.lima, 13)}>Qué sigue</Text>
            {c.pasos.map((paso, i) => (
              <Row key={i} style={{ marginTop: 16, borderTop: `1px solid ${C.separador}` }}>
                <Column style={{ width: 58, verticalAlign: "top", paddingTop: 16 }}>
                  <Text style={titulo(26, { lineHeight: 1, color: paso.destacado ? C.lima : C.apagado })}>
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </Column>
                <Column style={{ verticalAlign: "top", paddingTop: 16 }}>
                  <Text
                    style={texto(16, paso.destacado ? C.blanco : C.hueso, {
                      lineHeight: 1.55,
                      fontWeight: paso.destacado ? 600 : 400,
                    })}
                  >
                    {paso.texto}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Franja lima */}
          <Section style={{ backgroundColor: C.lima, padding: "36px 40px" }}>
            <Row>
              <Column style={{ width: 60, verticalAlign: "top" }}>
                <Img src={`${assetsUrl}/sobre.png`} width={40} height={40} alt="" style={{ display: "block" }} />
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={titulo(26, { lineHeight: 1.02, color: C.fondo })}>{c.franja.titulo}</Text>
                <Text style={texto(15, C.sobreLima, { lineHeight: 1.55, marginTop: 10 })}>{c.franja.texto}</Text>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "44px 40px" }}>
            <Text style={texto(16, C.hueso, { lineHeight: 1.55 })}>{c.cta}</Text>
            <Button
              href={IG_URL}
              style={{
                marginTop: 18,
                backgroundColor: C.lima,
                color: C.fondo,
                fontFamily: TEXTO,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                padding: "15px 26px",
                borderRadius: 999,
              }}
            >
              {IG_BUTTON}
            </Button>
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
              Nos vemos en la ruta.
            </Text>
            <Text style={texto(15, C.secundario, { marginTop: 4 })}>El equipo de RODA</Text>
          </Section>

          {/* Pie */}
          <Section style={{ backgroundColor: C.pie, borderTop: `1px solid ${C.separador}`, padding: "32px 40px" }}>
            <Text style={{ ...etiqueta(C.hueso), letterSpacing: "0.14em" }}>
              Encontrá tu grupo. <span style={{ color: C.lima }}>Salí a rodar.</span>
            </Text>
            <Text style={texto(12, C.secundario, { marginTop: 14 })}>{c.pie}</Text>
            <Text style={texto(12, C.secundario, { marginTop: 14 })}>
              <Link href={IG_URL} style={{ color: C.lima }}>
                Instagram
              </Link>
              <span style={{ display: "inline-block", width: 18 }}>&nbsp;</span>
              <Link href={PRIVACIDAD_URL} style={{ color: C.secundario }}>
                Política de privacidad
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
