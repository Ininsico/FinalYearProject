import { PageHero, Section, Prose } from "../components/layout"

const DOCS = {
  privacy: {
    title: "Privacy policy",
    lede: "What Fablet collects, why, and how it is handled.",
    sections: [
      ["What we collect", "When you create an account we store your name, email address, a hashed password, and a record of email verification. When you submit the contact form we store your name, email, and message. Productions you create store the briefs and generated output that belong to your workspace."],
      ["How we use it", "Account data is used to authenticate you and operate your workspace. Contact messages are used to respond to your enquiry. Orchestration data is used to run productions and to improve the swarm's behaviour across runs."],
      ["What we do not do", "We do not sell your personal data. Private briefs, assets, and outputs stay within your workspace and are not used to train models for other customers."],
      ["Retention", "Account data is retained while your account is active. Contact messages are retained for as long as needed to handle the enquiry. You can request deletion of your account and its data at any time."],
      ["Contact", "Questions about this policy can be sent to fablet@artdevelopers.site."],
    ],
  },
  terms: {
    title: "Terms of service",
    lede: "The agreement that governs your use of Fablet.",
    sections: [
      ["The service", "Fablet is an early-stage, conceptual platform offered during an early-access period. It is provided as-is, and features may change as the architecture evolves."],
      ["Your account", "You are responsible for keeping your credentials secure and for activity that happens under your account. You must provide accurate information and be old enough to enter into this agreement."],
      ["Acceptable use", "Do not use Fablet to create content that is unlawful, infringing, or harmful, to attempt to disrupt the service, or to access data that does not belong to you."],
      ["Your content", "You retain ownership of the briefs and output you create. You grant us the limited rights needed to operate the service on your behalf."],
      ["Liability", "The service is provided without warranties. To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the service."],
      ["Contact", "Questions about these terms can be sent to fablet@artdevelopers.site."],
    ],
  },
  security: {
    title: "Security",
    lede: "How Fablet protects accounts and workspaces.",
    sections: [
      ["Transport", "The service is served over HTTPS with a modern TLS configuration, and security headers are applied to every response."],
      ["Accounts", "Passwords are stored only as salted hashes. Sessions use signed, HTTP-only cookies, and verification and password-reset tokens are single-use and expire after fifteen minutes."],
      ["Sessions", "Changing your password invalidates other active sessions, so a compromised session cannot outlive a reset."],
      ["Workspaces", "Productions, assets, and generated output are scoped to your workspace. Orchestration data is separated per account."],
      ["Reporting", "If you believe you have found a vulnerability, email fablet@artdevelopers.site and we will respond as quickly as we can."],
    ],
  },
}

export default function Legal({ doc }) {
  const d = DOCS[doc]
  return (
    <>
      <PageHero eyebrow="Legal" title={d.title} lede={d.lede} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow lg:sticky lg:top-28 lg:self-start">Last updated 2026</p>
          <div>
            {d.sections.map(([h, b]) => (
              <div key={h} className="border-t border-line py-8">
                <h2 className="display text-step-2 text-ink-950">{h}</h2>
                <Prose className="mt-4">
                  <p>{b}</p>
                </Prose>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
