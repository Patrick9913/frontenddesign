import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { cv } from "./cvData";

Font.registerHyphenationCallback((word) => [word]);

const colors = {
  ink: "#111111",
  muted: "#333333",
  faint: "#666666",
  rule: "#cccccc",
  bg: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    color: colors.ink,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  role: {
    marginTop: 3,
    fontSize: 11,
    color: colors.muted,
  },
  meta: {
    marginTop: 6,
    fontSize: 9,
    color: colors.faint,
  },
  link: {
    color: colors.faint,
    textDecoration: "none",
  },
  rule: {
    marginTop: 12,
    marginBottom: 8,
    height: 0.8,
    backgroundColor: colors.rule,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  profile: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.45,
  },
  job: {
    marginBottom: 9,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  org: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },
  loc: {
    fontSize: 9.5,
    color: colors.muted,
  },
  jobRole: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
    color: colors.muted,
  },
  period: {
    fontSize: 9.5,
    color: colors.faint,
  },
  bullet: {
    marginTop: 2,
    marginLeft: 8,
    fontSize: 10,
    color: colors.muted,
  },
  skills: {
    fontSize: 10,
    color: colors.muted,
  },
  eduTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  eduPlace: {
    fontSize: 10,
    color: colors.muted,
  },
});

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <View>
    <View style={styles.rule} />
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

export function CVDocument() {
  return (
    <Document
      title={`${cv.name} — CV`}
      author={cv.name}
      subject="Front End Developer CV"
      language="es"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{cv.name}</Text>
        <Text style={styles.role}>{cv.role}</Text>
        <Text style={styles.meta}>
          {cv.location}
          {"  |  "}
          <Link src={`mailto:${cv.email}`} style={styles.link}>
            {cv.email}
          </Link>
          {"  |  "}
          {cv.phone}
          {"  |  "}
          <Link src={cv.github} style={styles.link}>
            GitHub
          </Link>
          {"  |  "}
          <Link src={cv.linkedin} style={styles.link}>
            LinkedIn
          </Link>
          {"  |  "}
          <Link src={cv.website} style={styles.link}>
            Portfolio
          </Link>
        </Text>

        <Section title="Summary">
          <Text style={styles.profile}>{cv.profile}</Text>
        </Section>

        <Section title="Experience">
          {cv.experience.map((item) => (
            <View key={item.org} style={styles.job} wrap={false}>
              <View style={styles.row}>
                <Text style={styles.org}>{item.org}</Text>
                <Text style={styles.loc}>{item.location}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.jobRole}>{item.role}</Text>
                <Text style={styles.period}>{item.period}</Text>
              </View>
              {item.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
            </View>
          ))}
        </Section>

        <Section title="Skills">
          <Text style={styles.skills}>{cv.skills.join(", ")}</Text>
        </Section>

        <Section title="Education">
          {cv.education.map((item) => (
            <View key={item.title} style={[styles.row, { marginBottom: 4 }]} wrap={false}>
              <Text style={styles.eduTitle}>
                {item.title}
                <Text style={styles.eduPlace}>{` — ${item.place}`}</Text>
              </Text>
              <Text style={styles.period}>{item.period}</Text>
            </View>
          ))}
        </Section>
      </Page>
    </Document>
  );
}
