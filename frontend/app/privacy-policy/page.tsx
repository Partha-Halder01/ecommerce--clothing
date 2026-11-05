import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Eye,
  Sparkles,
  Share2,
  Cookie,
  Lock,
  UserCheck,
  AlertCircle,
  Activity,
  Link2,
  Scale,
  FileText,
  MessagesSquare,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | In You Fragrances",
  description:
    "Privacy Policy for In You Fragrances by Vayuroma Fragrances (OPC) Private Limited — how we collect, use, and protect your personal information.",
}

const sections = [
  {
    icon: Eye,
    id: "introduction",
    title: "Introduction",
    content: `This Privacy Policy applies to your use of the In You Fragrances website and services operated by Vayuroma Fragrances (OPC) Private Limited ("we", "our", "us"). The terms "you", "your", and "User" refer to you as a user of our website.

"Personal Information" means information that personally identifies you — such as your name, phone number, email address, billing/shipping address, and any other data tied to such information.

By visiting this website, you agree and acknowledge to be bound by this Privacy Policy and consent that we will collect, use, process, and share your Personal Information in the manner set out herein. If you do not agree with these terms, do not use the website.`,
  },
  {
    icon: Eye,
    id: "information-we-collect",
    title: "Information We Collect & How We Use It",
    content: `We collect, receive, and store your Personal Information. If you provide third-party account credentials to us, such information may be transmitted to your account with us if you authorise such transmissions.

We use commercially reasonable efforts to ensure that collection of Personal Information is limited to what is necessary. The Personal Information collected will be used only for:

• Enabling you to use the services provided by us
• Promoting a safe service and calibrating consumer interest in our products
• Informing you about online offers and updates (with consent)
• Troubleshooting problems and customising user experience
• Detecting and protecting against error, fraud, and criminal activity
• Collecting payment and enforcing our terms and conditions`,
  },
  {
    icon: UserCheck,
    id: "account-information",
    title: "Account Information",
    content: `If you create an account, we ask for and record Personal Information such as your name, email address, and mobile number. We may collect and store Sensitive Personal Data or Information (such as financial information including credit card, debit card details, bank account, and KYC documents as per applicable regulations).

We use your email address to send you updates, news, and newsletters (if you willingly subscribe) and to contact you on behalf of other users. We use your mobile numbers to send you transaction alerts and SMS alerts based on your preferences.

Vayuroma Fragrances assures that your Personal Information will not be made public or sold to any third party.

The User shall have an option to erase any information provided, including Personal Information. If a User opts for erasure, we shall delete all stored information from our servers.`,
  },
  {
    icon: Activity,
    id: "activity",
    title: "Activity & Usage Data",
    content: `We record information relating to your use of our website, such as the searches you undertake, pages you view, browser type, IP address, location, requested URL, referring URL, and timestamp information. We use this to administer the website and provide the highest possible level of security and service.

We also use this information in aggregate to perform statistical analyses of user behaviour and characteristics to measure interest in and use of the various areas of our website. You cannot be identified from this aggregate information.

We own all intellectual property rights associated with the website and its contents. No right, title, or interest in any downloaded material is transferred to you as a result of any downloading or copying.`,
  },
  {
    icon: Cookie,
    id: "cookies",
    title: "Cookies",
    content: `We send cookies to your computer to uniquely identify your browser and improve the quality of our service. "Cookies" refers to small pieces of information that a website sends to your computer's hard drive while you are viewing the site.

We may use both session cookies (which expire once you close your browser) and persistent cookies (which stay on your computer until you delete them). Persistent cookies can be removed by following your browser's help file directions.

If you choose to disable cookies, some areas of our website may not work properly or at all. We also use third-party tools who may collect anonymous information about your visits using cookies. No Personal Information is collected or used in this process.`,
  },
  {
    icon: Share2,
    id: "transfer-of-information",
    title: "Transfer of Information",
    content: `We do not share your Personal Information with any third party apart from:

• Financial institutions such as banks and regulatory agencies (as may be required)
• Trusted partners required to provide our services (payment gateways, courier services, analytics providers)
• Technical support and customer support providers

These third parties are required not to use your Personal Information other than to provide the services requested by you.

We may share your Personal Information with our affiliates, subsidiaries, or in the event of an acquisition of our company. We may also disclose your Personal Information if required by law, court order, or to protect our rights, reputation, and property.`,
  },
  {
    icon: Lock,
    id: "security",
    title: "Security",
    content: `Your account is password protected. We use industry standard measures to protect the Personal Information stored in our database and follow industry standard best practices on Information Security. We limit access to your Personal Information to those employees and contractors who need it to perform their job function.

You hereby acknowledge that Vayuroma Fragrances is not responsible for any intercepted information sent via the internet, and you release us from any claims arising out of or related to the use of intercepted information in any unauthorised manner.`,
  },
  {
    icon: AlertCircle,
    id: "enforcement",
    title: "Enforcement",
    content: `We may use the information we collect in connection with your use of our website (including your Personal Information) to investigate, enforce, and apply our Terms of Use and this Privacy Policy.`,
  },
  {
    icon: Link2,
    id: "links",
    title: "Third-Party Links",
    content: `References on this website to any names, marks, products, or services of third parties or hyperlinks to third-party websites are provided solely for your convenience and do not constitute or imply our endorsement, sponsorship, or recommendation of the third party, information, product, or service.

We are not responsible for the privacy practices of third-party websites. We suggest you read the privacy policies on all such third-party websites.`,
  },
  {
    icon: FileText,
    id: "modifications",
    title: "Terms & Modifications",
    content: `Our Privacy Policy is subject to change at any time without notice. To make sure you are aware of any changes, please review this policy periodically. These changes will be effective immediately upon posting.

You are responsible for updating your Personal Information, including providing us with your most current email address. Continued use of our website after any change to this Privacy Policy shall indicate your acknowledgement of such changes and agreement to be bound by the updated terms.`,
  },
  {
    icon: Scale,
    id: "applicable-law",
    title: "Applicable Law",
    content: `Your use of this website will be governed by and construed in accordance with the laws of India. Users agree that any legal action or proceedings arising out of your use may be brought exclusively in the competent courts/tribunals having jurisdiction in Bengaluru, India, and irrevocably submit themselves to the jurisdiction of such courts/tribunals.`,
  },
  {
    icon: MessagesSquare,
    id: "grievance",
    title: "Complaints & Grievance Redressal",
    content: `If you contact us to provide feedback, register a complaint, or ask a question, we will record any Personal Information and other content that you provide so that we can effectively respond.

Any complaints or concerns in relation to your Personal Information, content of this website, or any dispute should be immediately informed to our Data Protection Officer in writing or by raising a grievance ticket.

DPO / Grievance Officer
SHASHANK KARINCHETI
Razorpay Software Private Limited
Address: No. 22, 1st Floor, SJR Cyber, Laskar - Hosur Road, Adugodi, Bangalore - 560030
Phone: 080-46669555
Email: dpo@razorpay.com
Grievances Portal: https://razorpay.com/grievances/`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Header />
      <main>

        {/* Hero */}
        <section className="bg-[#1C1615] py-20 sm:py-28">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-5 font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Legal
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#FCFBF8] tracking-wide uppercase mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Privacy Policy
            </h1>
            <p
              className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              How Vayuroma Fragrances (OPC) Private Limited protects the information you share with us.
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[#FCFBF8]/30 mt-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Last Updated: March 19th, 2024
            </p>
          </div>
        </section>

        {/* Acceptance Details */}
        <section className="py-10 bg-[#F4F1EB] border-b border-[#E8E3DC]">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[#D8B4A0] mb-4 font-semibold text-center"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Acceptance Details
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              {[
                { label: "Owner Name", value: "VAYUROMA FRAGRANCES (OPC) PRIVATE LIMITED" },
                { label: "Signatory", value: "AYUSH GOYAL" },
                { label: "Date of Acceptance", value: "2026-07-01" },
                { label: "Contact", value: "+91 98713 62528" },
                { label: "Email", value: "vayuromafragrances@gmail.com" },
                { label: "Governing Law", value: "India (Bengaluru Jurisdiction)" },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-[#E8E3DC] p-4">
                  <p
                    className="text-[9px] uppercase tracking-[0.25em] text-[#D8B4A0] mb-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[11px] text-[#1C1615] font-medium leading-snug"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p
              className="text-base sm:text-lg text-[#6B635E] leading-relaxed tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Vayuroma Fragrances (OPC) Private Limited (&ldquo;In You&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) respects your privacy. This policy explains what we collect, how we use it,
              and the choices you have when you visit or shop with us. Our payment services are powered by
              Razorpay — please read this policy in conjunction with the Razorpay Terms of Use.
            </p>
            <div className="w-16 h-px bg-[#D8B4A0]/40 mx-auto mt-10" />
          </div>
        </section>

        {/* Table of Contents */}
        <section className="pb-6">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <div className="bg-[#1C1615] p-7 sm:p-9">
              <p
                className="text-[10px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-5 font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Contents
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-[#FCFBF8]/60 hover:text-[#D8B4A0] text-xs tracking-wide transition-colors duration-200 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="text-[#D8B4A0]/50">{String(i + 1).padStart(2, "0")}.</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-6 pb-20 sm:pb-28">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl space-y-4">
            {sections.map((section, index) => (
              <div
                key={index}
                id={section.id}
                className="bg-white border border-[#E8E3DC] p-7 sm:p-9 shadow-sm scroll-mt-20"
              >
                <div className="flex items-start gap-5">
                  <div className="w-11 h-11 bg-[#F4F1EB] flex items-center justify-center shrink-0 border border-[#E8E3DC]">
                    <section.icon className="h-5 w-5 text-[#D8B4A0]" />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[9px] uppercase tracking-[0.3em] text-[#D8B4A0] mb-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Section {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2
                      className="text-lg sm:text-xl font-normal text-[#1C1615] mb-4 tracking-wide uppercase"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {section.title}
                    </h2>
                    <div
                      className="text-[#6B635E] leading-relaxed tracking-wide text-sm space-y-3 whitespace-pre-line"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="py-16 sm:py-20 bg-[#1C1615]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <p
              className="text-[11px] uppercase tracking-[0.4em] text-[#D8B4A0] mb-4 font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Grievance & Contact
            </p>
            <h2
              className="text-2xl sm:text-3xl font-light text-[#FCFBF8] mb-5 tracking-wide uppercase"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Questions About Privacy?
            </h2>
            <p
              className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              For any privacy-related request or concern, contact us at the address below.
              Vayuroma Fragrances (OPC) Private Limited — Delhi, India.
            </p>
            <a
              href="mailto:vayuromafragrances@gmail.com"
              className="inline-block bg-[#D8B4A0] text-[#1C1615] px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#FCFBF8] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              vayuromafragrances@gmail.com
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
