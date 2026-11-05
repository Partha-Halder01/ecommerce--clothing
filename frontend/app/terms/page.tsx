import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  Globe,
  Sparkles,
  ShoppingBag,
  Copyright,
  ShieldAlert,
  Scale,
  CreditCard,
  Lock,
  FileText,
  Users,
  AlertCircle,
  Handshake,
  Ban,
  ReceiptText,
  Building2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | In You Fragrances",
  description:
    "Terms and Conditions for In You Fragrances by Vayuroma Fragrances (OPC) Private Limited — governing your access and use of our services.",
}

const sections = [
  {
    icon: FileText,
    id: "general",
    title: "General",
    content: `This document is an electronic record published in terms of Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 read with the Information Technology Act, 2000 and does not require any physical or digital signatures.

These Terms and Conditions ("Terms") constitute a legal agreement between You and Vayuroma Fragrances (OPC) Private Limited ("we", "us", "our") in connection with In You Fragrances (inyoufragrances.com). Payment services are provided via Razorpay Software Private Limited ("Razorpay").

By accessing our website or using our services, You agree to be bound by these Terms, including our Privacy Policy and any other applicable policy. If You do not agree, please immediately cease use of our website and services.`,
  },
  {
    icon: Globe,
    id: "use-of-website",
    title: "Use of Website & Services",
    content: `You shall register or use our website only if You are 18 years of age or above and can enter into binding contracts as per Applicable Laws.

You are responsible for maintaining the secrecy of Your passwords, login, and account information. You will be responsible for all use of the platform and/or services by You or anyone using Your password and login information (with or without our permission).

You agree to provide true, accurate, current, and complete information about Yourself. If You provide any information that is untrue, inaccurate, or incomplete, we shall have the right to immediately suspend or terminate Your account.

You agree not to use the website and/or services for any unlawful, illegal, or prohibited purpose. We may, at our sole discretion, at any time and without advance notice, suspend, terminate, or restrict Your access to all or any component of the website and/or services.`,
  },
  {
    icon: Copyright,
    id: "proprietary-rights",
    title: "Proprietary Rights",
    content: `Vayuroma Fragrances (OPC) Private Limited (and our licensors, as applicable) remain the sole owner of all right, title, and interest in the services, including the website, and any intellectual property rights which subsist in the services (whether registered or not).

We grant You a personal, non-exclusive, non-transferable, limited right to access the website and make personal use of our services. You shall not remove, obscure, or alter any proprietary rights notices.

All content on this website — including the In You name, logo, imagery, fragrance names, and written material — is the exclusive property of Vayuroma Fragrances (OPC) Private Limited and may not be reproduced, modified, or used without our prior written permission.

You shall not download, copy, create a derivative work, reverse engineer, transmit, sell, assign, sub-license, or otherwise transfer any right in the services or our marks.`,
  },
  {
    icon: Sparkles,
    id: "products-pricing",
    title: "Products & Pricing",
    content: `All fragrances are described and priced as accurately as possible in Indian Rupees (₹), inclusive of applicable taxes unless stated otherwise.

Packaging, shades, and presentation may vary subtly from on-screen images due to display settings. Prices, offers, and availability may change without prior notice.

We reserve the right to update product listings, descriptions, and pricing at our sole discretion. Any changes will be reflected immediately on the website and shall apply to all new orders placed after such change.`,
  },
  {
    icon: ShoppingBag,
    id: "orders-acceptance",
    title: "Orders & Acceptance",
    content: `Every order placed is an offer to purchase, subject to availability and confirmation. We reserve the right to accept, decline, or cancel any order — including for reasons of stock, pricing errors, or suspected fraud — and may request verification before dispatch.

You agree that Vayuroma Fragrances shall not be responsible for any delivery, after-sales service, or any other obligations or services relating to third-party couriers or logistics providers. Such obligations shall be subject to the respective courier's terms and conditions.

You shall retain records relating to transactions for a period of 10 (ten) years from the relevant date of the order.`,
  },
  {
    icon: CreditCard,
    id: "payment",
    title: "Payment",
    content: `Applicable fees for the provision of services shall be levied from time to time. You agree that fees shall be charged according to the manner, rates, and frequency determined by Razorpay as our payment service provider.

Fees are exclusive of applicable taxes. Any statutory variations in applicable taxes during the subsistence of these Terms shall be borne by You.

You acknowledge that for undertaking any payment and/or financial transaction through the platform, our payment gateway (Razorpay) may undertake due diligence measures and seek information required for KYC purposes, which as a customer You are obliged to provide in accordance with Applicable Laws.

You agree that Vayuroma Fragrances shall not be responsible for any payment failures, delays, or discrepancies arising from the payment gateway, banking network, or card networks.`,
  },
  {
    icon: Ban,
    id: "prohibited-activities",
    title: "Prohibited Activities",
    content: `You are prohibited from posting or transmitting to or through this website:

• Any unlawful, threatening, libellous, defamatory, obscene, or pornographic material
• Any commercial material or content (including solicitation of funds, advertising, or marketing of any good or services not offered by us)
• Any material that infringes, misappropriates, or violates any copyright, trademark, patent right, or other proprietary right of any third party
• Content that contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer resource
• Content that threatens the unity, integrity, defense, security, or sovereignty of India, or public order
• Content that impersonates another person

You shall be solely liable for any damages resulting from any violation of the foregoing restrictions.`,
  },
  {
    icon: Users,
    id: "user-representations",
    title: "User Representations & Warranties",
    content: `By using our services, You represent and warrant that:

• You have the full legal capacity and power to enter into, exercise Your rights under, and perform Your obligations under these Terms
• You do not, and shall not, engage in any activity related to virtual currency, cryptocurrency, or other crypto products
• Your use of the website and services and purchase of our products are solely for bona fide personal activities in compliance with Applicable Laws
• You hold express informed consent where required by law to share information with us and our payment partners

Any breach of these representations may result in immediate suspension or termination of Your access to or use of the website and services.`,
  },
  {
    icon: Lock,
    id: "data-privacy",
    title: "Data Privacy",
    content: `By using the website, You hereby consent to the use of Your information as outlined in our Privacy Policy.

You agree that Vayuroma Fragrances may share your information with our payment partner Razorpay and their banking/financial institution partners as necessary to provide payment services.

By using our services and providing your contact information, you consent to receiving information about our products and services through various channels, including email, SMS, and WhatsApp. You may opt out at any time by writing to us at vayuromafragrances@gmail.com.`,
  },
  {
    icon: Handshake,
    id: "third-party-links",
    title: "Third-Party Links & Partners",
    content: `This website contains links to other websites over which we have no control. We encourage You to review the terms and privacy policies of those other websites.

Vayuroma Fragrances is not responsible for the terms and conditions, privacy policies, or practices of other websites to which You choose to link from our website.

Your interaction with any third party accessed through the website is at Your own risk, and Vayuroma Fragrances will have no liability with respect to any damages or expenses resulting from Your interactions with third parties.`,
  },
  {
    icon: AlertCircle,
    id: "disclaimer",
    title: "Disclaimer of Warranty",
    content: `To the maximum extent permitted by Applicable Laws, the website and the services are provided on an "as is" basis.

You acknowledge that Vayuroma Fragrances does not warrant that the service(s) will be uninterrupted or error free or fit for Your specific purposes. We make no representations or warranties regarding the accuracy, completeness, or reliability of the website or its content.`,
  },
  {
    icon: ShieldAlert,
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: `Vayuroma Fragrances (including its officers, directors, employees, representatives, affiliates, and providers) will not be responsible or liable for any injury, death, loss, claim, accident, delay, or any direct, special, exemplary, punitive, indirect, incidental, or consequential damages of any kind arising out of or in any way connected with:

• Any failure or delay (including the use of or inability to use any component of the website)
• Any use of the website or services or content therein
• The performance or non-performance by us or any service provider
• Any damages to or viruses that may infect Your computer equipment as a result of Your access to the website

While we take great care in crafting and delivering your order, our liability is limited to the value of the products purchased.`,
  },
  {
    icon: ReceiptText,
    id: "indemnity",
    title: "Indemnity",
    content: `You agree to indemnify and hold Vayuroma Fragrances (and its officers, affiliates, directors, agents, and employees) harmless from any and all claims, causes of action, demands, recoveries, losses, damages, fines, penalties, or other costs or expenses of any kind or nature, including reasonable attorneys' fees, arising out of or related to:

• Your breach of these Terms
• Your violation of any Applicable Laws or the rights of a third party
• Your use of the website

The covenants of indemnity set forth herein shall survive and continue even after the termination of Your use of the services.`,
  },
  {
    icon: Building2,
    id: "card-association",
    title: "Card Payment Network Rules",
    content: `"Card Payment Network Rules" refer to the written rules, regulations, releases, guidelines, processes, interpretations, and other requirements imposed and adopted by card payment networks (such as Visa, Mastercard, RuPay). These networks have infrastructure and processes to enable transaction authorisation.

Card payment networks reserve the right to amend their guidelines, rules, and regulations from time to time. Any amendments to Card Payment Network Rules shall be deemed binding and will be applied through our payment partner Razorpay.

For UPI transactions and RuPay Debit Cards, zero MDR applies as prescribed under applicable RBI guidelines.`,
  },
  {
    icon: Scale,
    id: "governing-law",
    title: "Governing Law & Disputes",
    content: `These Terms are governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts/tribunals in Bengaluru, India.

If You object to these Terms or any subsequent modifications in any way, Your only recourse is to immediately terminate the use of our services.

Vayuroma Fragrances reserves the right to amend or otherwise modify these Terms at any time by posting an updated version on the website. The updated Terms shall take effect immediately upon posting. It is Your responsibility to review these Terms periodically for updates/amendments.`,
  },
]

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>
            <p
              className="text-sm sm:text-base text-[#FCFBF8]/50 max-w-2xl mx-auto tracking-wide leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The legal terms governing your access to and use of In You Fragrances.
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[#FCFBF8]/30 mt-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Last Updated: July 1, 2026 · Accepted by Ayush Goyal
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <p
              className="text-base sm:text-lg text-[#6B635E] leading-relaxed tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Welcome to In You Fragrances. These Terms &amp; Conditions govern your access to and use of
              inyoufragrances.com, operated by Vayuroma Fragrances (OPC) Private Limited. Payment services
              are powered by Razorpay Software Private Limited. By browsing our website or placing an order,
              you agree to these Terms in full.
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
                      Clause {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2
                      className="text-lg sm:text-xl font-normal text-[#1C1615] mb-4 tracking-wide uppercase"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {section.title}
                    </h2>
                    <div
                      className="text-[#6B635E] leading-relaxed tracking-wide text-sm whitespace-pre-line space-y-2"
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
              Need Clarification?
            </p>
            <h2
              className="text-2xl sm:text-3xl font-light text-[#FCFBF8] mb-5 tracking-wide uppercase"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Have Questions?
            </h2>
            <p
              className="text-[#FCFBF8]/50 mb-8 tracking-wide max-w-xl mx-auto text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Reach out for any clarification on these terms. Our team is here to help.
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
