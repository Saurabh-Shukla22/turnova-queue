'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowLeft,
  Shield,
  Scale,
} from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold">
            <Scale className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Turnova Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Updated: September 14, 2026</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Welcome & Intro */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Welcome to Turnova.
            </h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Turnova platform, including our website, applications, queue management services, appointment features, and related services.
            </p>
            <p className="font-semibold text-slate-900 dark:text-white">
              By creating an account or using Turnova, you agree to these Terms. If you do not agree with these Terms, please do not use the service.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 1. About Turnova */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                About Turnova
              </h3>
            </div>
            <p>
              Turnova is a digital queue and appointment management platform that allows users to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Discover participating businesses</li>
              <li>Join virtual queues</li>
              <li>Receive digital queue tokens</li>
              <li>Track queue positions</li>
              <li>Book appointments</li>
              <li>Receive queue and appointment notifications</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Turnova also provides tools that allow businesses to manage queues, services, appointments, customers, staff, and related information.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 2. Eligibility */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Eligibility
              </h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must not use Turnova if you are prohibited from using online services under applicable law.</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 3. User Accounts */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                User Accounts
              </h3>
            </div>
            <p>When creating a Turnova account:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Provide accurate and current information.</li>
              <li>Keep your login credentials secure.</li>
              <li>Do not share your account with unauthorized people.</li>
              <li>Notify us if you believe your account has been compromised.</li>
              <li>You are responsible for activity performed through your account.</li>
              <li>We may suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 4. Joining a Queue */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Joining a Queue
              </h3>
            </div>
            <p>When you join a queue:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Turnova may generate a digital token for you.</li>
              <li>Your position may change as other customers are served.</li>
              <li>Estimated waiting times are approximate and are not guaranteed.</li>
              <li>Businesses may pause, modify, or close queues.</li>
              <li>A queue may be cancelled due to circumstances outside Turnova&apos;s control.</li>
              <li>Joining a queue does not guarantee that a specific service will be provided at a particular time.</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 5. Appointments */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                5
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Appointments
              </h3>
            </div>
            <p>
              Appointment availability is controlled by the relevant business. Turnova provides the technology for appointment management but does not guarantee that a business will provide a service.
            </p>
            <p className="text-xs">Businesses may:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Confirm appointments</li>
              <li>Reschedule appointments</li>
              <li>Cancel appointments</li>
              <li>Change operating hours</li>
              <li>Mark appointments as no-show</li>
            </ul>
            <p className="text-xs font-medium text-slate-900 dark:text-white pt-1">
              Users should check appointment details before visiting the business.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 6. Business Accounts */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                6
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Business Accounts
              </h3>
            </div>
            <p>Businesses using Turnova are responsible for:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Providing accurate business information</li>
              <li>Maintaining correct operating hours</li>
              <li>Managing their queues appropriately</li>
              <li>Providing accurate service information</li>
              <li>Managing their staff accounts</li>
              <li>Handling customers professionally</li>
              <li>Complying with applicable laws</li>
            </ul>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium pt-1">
              Turnova is not responsible for the quality, safety, legality, or outcome of services provided by participating businesses.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 7. Prohibited Activities */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                7
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Prohibited Activities
              </h3>
            </div>
            <p>You must not use Turnova to:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {[
                'Create fake accounts',
                'Manipulate queue positions',
                'Abuse or harass other users',
                'Submit fraudulent information',
                'Attempt unauthorized access',
                'Distribute malware',
                'Interfere with the platform',
                'Scrape or copy platform data without permission',
                'Use the service for unlawful activities',
                'Circumvent security measures',
                'Abuse notifications or communication features',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              We may suspend or terminate accounts involved in prohibited activities.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 8. Payments */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                8
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payments
              </h3>
            </div>
            <p>
              If Turnova introduces paid services, subscriptions, or transaction-based features, applicable pricing and payment terms will be displayed before purchase. Unless otherwise stated:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Prices are displayed in the applicable currency.</li>
              <li>Users are responsible for applicable taxes.</li>
              <li>Subscription charges may recur according to the selected plan.</li>
              <li>Refunds will be handled according to the applicable refund policy.</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 9. Third-Party Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                9
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Third-Party Services
              </h3>
            </div>
            <p>Turnova may integrate with third-party services such as:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Maps</li>
              <li>Authentication providers</li>
              <li>Payment providers</li>
              <li>Cloud storage</li>
              <li>Notification services</li>
              <li>Analytics services</li>
            </ul>
            <p className="text-xs text-slate-500">
              Your use of those services may also be subject to their respective terms and policies.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 10. Intellectual Property */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                10
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Intellectual Property
              </h3>
            </div>
            <p>
              Turnova and its associated content, branding, software, designs, logos, text, graphics, and features are owned by or licensed to Turnova unless otherwise stated.
            </p>
            <p>
              You may not copy, reproduce, modify, distribute, sell, or reverse engineer Turnova&apos;s proprietary content or software without appropriate authorization.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 11. User Content */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                11
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                User Content
              </h3>
            </div>
            <p>
              Users and businesses may submit information such as reviews, business descriptions, profile information, images, and service information. You are responsible for the content you submit.
            </p>
            <p className="text-xs">You must not submit content that is:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Illegal</li>
              <li>Fraudulent</li>
              <li>Abusive</li>
              <li>Misleading</li>
              <li>Infringing</li>
              <li>Harmful</li>
              <li>Offensive in a manner that violates applicable law</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              By submitting content, you grant Turnova the limited rights necessary to store, display, and process that content to provide the service.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 12. Reviews */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                12
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reviews
              </h3>
            </div>
            <p>Reviews should reflect genuine experiences. Users must not:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Post fake reviews</li>
              <li>Manipulate ratings</li>
              <li>Review a business dishonestly</li>
              <li>Post personal or confidential information about others</li>
              <li>Use reviews to threaten or harass businesses</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Turnova may remove content that violates these Terms.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 13. Notifications */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                13
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <p>Turnova may send notifications related to:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Queue status</li>
              <li>Token updates</li>
              <li>Appointments</li>
              <li>Reminders</li>
              <li>Account activity</li>
              <li>Important service updates</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Notification delivery may depend on your device, browser, internet connection, and third-party notification services. Turnova does not guarantee that every notification will be delivered immediately or successfully.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 14. Service Availability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                14
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Service Availability
              </h3>
            </div>
            <p>
              We aim to keep Turnova available and reliable, but we do not guarantee uninterrupted service. Turnova may temporarily become unavailable because of:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Maintenance</li>
              <li>Technical issues</li>
              <li>Server problems</li>
              <li>Internet outages</li>
              <li>Security incidents</li>
              <li>Third-party service failures</li>
              <li>Events outside our reasonable control</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 15. No Guarantee of Waiting Time */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                15
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Guarantee of Waiting Time
              </h3>
            </div>
            <p>
              Estimated waiting times are generated using available queue information and, where applicable, historical service data.
            </p>
            <p className="text-xs">Actual waiting times may differ because of:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Service duration</li>
              <li>Customer cancellations</li>
              <li>No-shows</li>
              <li>Emergencies</li>
              <li>Staff availability</li>
              <li>Business decisions</li>
              <li>Technical issues</li>
            </ul>
            <p className="text-xs font-semibold text-slate-900 dark:text-white pt-1">
              Turnova is not responsible for losses caused by relying solely on an estimated waiting time.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 16. Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                16
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Limitation of Liability
              </h3>
            </div>
            <p>
              To the maximum extent permitted by applicable law, Turnova will not be responsible for indirect, incidental, special, or consequential losses resulting from the use or inability to use the platform.
            </p>
            <p>
              Turnova does not control the services provided by businesses using the platform. Any dispute regarding the quality or delivery of a business&apos;s service should primarily be addressed with that business.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 17. Account Suspension and Termination */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                17
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Suspension and Termination
              </h3>
            </div>
            <p>We may suspend or terminate access if:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>You violate these Terms.</li>
              <li>You misuse the platform.</li>
              <li>You engage in fraudulent activity.</li>
              <li>You attempt to compromise platform security.</li>
              <li>Your activity creates risk for Turnova or other users.</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Users may stop using Turnova at any time. Where appropriate, we may provide notice before termination.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 18. Changes to These Terms */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                18
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Changes to These Terms
              </h3>
            </div>
            <p>
              We may update these Terms from time to time. When changes are made, we will update the &quot;Last Updated&quot; date.
            </p>
            <p className="text-xs text-slate-500">
              Continued use of Turnova after changes become effective means you accept the updated Terms, to the extent permitted by applicable law.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 19. Governing Law */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                19
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Governing Law
              </h3>
            </div>
            <p>
              These Terms will be governed by the applicable laws of India, unless otherwise required by applicable law. Any disputes will be handled by the courts or dispute-resolution mechanisms having appropriate jurisdiction.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 20. Contact Us */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                20
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contact Us
              </h3>
            </div>
            <p>If you have questions about these Terms, contact us:</p>
            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 space-y-1.5 text-xs">
              <strong className="block text-sm text-slate-900 dark:text-white">Turnova</strong>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>
                  Email:{' '}
                  <a
                    href="mailto:legal@turnova.example"
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    legal@turnova.example
                  </a>
                </span>
              </div>
              <div className="text-slate-500">
                Website:{' '}
                <Link href="/" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  Turnova
                </Link>
              </div>
            </div>
          </section>

          {/* Important Notice Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Important:</strong> These Terms are a general template for a queue and appointment platform. They should be reviewed and customized by a qualified legal professional before Turnova is launched commercially.
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
