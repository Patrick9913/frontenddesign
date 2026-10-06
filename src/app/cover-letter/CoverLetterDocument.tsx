import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { cv, cvEn } from "../cv/cvData";
import {
  applyPlaceholders,
  formatLetterDate,
  salutation,
  signOff,
} from "./templates";
import type { CoverLetterPdfPayload } from "./types";

Font.registerHyphenationCallback((word) => [word]);

const colors = {
  ink: "#111111",
  muted: "#333333",
  faint: "#555555",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: colors.ink,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.55,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
  },
  headerBlock: {
    marginBottom: 28,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
  meta: {
    marginTop: 4,
    fontSize: 9.5,
    color: colors.faint,
  },
  date: {
    marginBottom: 22,
    fontSize: 10.5,
    color: colors.muted,
  },
  recipient: {
    marginBottom: 18,
    fontSize: 10.5,
    color: colors.muted,
  },
  paragraph: {
    marginBottom: 12,
    fontSize: 11,
    color: colors.muted,
    textAlign: "justify",
  },
  bullet: {
    marginBottom: 6,
    marginLeft: 10,
    fontSize: 11,
    color: colors.muted,
  },
  signOff: {
    marginTop: 18,
    fontSize: 11,
    color: colors.muted,
  },
  signature: {
    marginTop: 28,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
});

export function CoverLetterDocument({ payload }: { payload: CoverLetterPdfPayload }) {
  const contact = payload.language === "en" ? cvEn : cv;
  const company = payload.company.trim();
  const role = payload.role.trim();

  const opening = applyPlaceholders(payload.opening, company, role);
  const motivation = applyPlaceholders(payload.motivation, company, role);
  const closing = applyPlaceholders(payload.closing, company, role);

  return (
    <Document
      title={`Cover letter — ${company || "Draft"}`}
      author={contact.name}
      subject="Cover letter"
      language={payload.language}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.meta}>
            {contact.location} · {contact.email} · {contact.phone}
          </Text>
        </View>

        <Text style={styles.date}>{formatLetterDate(payload.language)}</Text>

        {company ? (
          <Text style={styles.recipient}>
            {payload.language === "en" ? "Re: " : "Ref.: "}
            {role ? `${role} — ${company}` : company}
          </Text>
        ) : null}

        <Text style={styles.paragraph}>
          {salutation(payload.language, payload.recipientName)}
        </Text>

        <Text style={styles.paragraph}>{opening}</Text>
        <Text style={styles.paragraph}>{motivation}</Text>

        {payload.highlights.length > 0 ? (
          <View style={{ marginBottom: 6 }}>
            {payload.highlights.map((item) => (
              <Text key={item} style={styles.bullet}>
                • {item}
              </Text>
            ))}
          </View>
        ) : null}

        <Text style={styles.paragraph}>{closing}</Text>

        <Text style={styles.signOff}>{signOff(payload.language)}</Text>
        <Text style={styles.signature}>{contact.name}</Text>
      </Page>
    </Document>
  );
}
