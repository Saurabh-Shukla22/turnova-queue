'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  ShieldCheck,
  FileText,
  Clock,
  UserCheck,
  Lock,
  Database,
  Bell,
  MapPin,
  Cookie,
  Share2,
  AlertCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Turnova Legal & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
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
              Turnova is a smart queue and appointment management platform that helps users join virtual queues, track their position, manage appointments, and receive notifications without unnecessary waiting.
            </p>
            <p>
              Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and how we protect it.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 1. Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Information We Collect
              </h3>
            </div>
            <p>When you use Turnova, we may collect the following information:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Account Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Account Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Password</li>
                  <li>Profile information</li>
                </ul>
              </div>

              {/* Queue & Appointment Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Queue & Appointment Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>Queue tokens</li>
                  <li>Services selected</li>
                  <li>Appointment details</li>
                  <li>Queue history</li>
                  <li>Business interactions</li>
                  <li>Check-in and check-out information</li>
                </ul>
              </div>

              {/* Business Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Business Information
                </h4>
                <p className="text-[11px] text-slate-400">For business owners, we may collect:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>Business name</li>
                  <li>Business address</li>
                  <li>Business contact information</li>
                  <li>Business category</li>
                  <li>Services and operating hours</li>
                  <li>Staff information</li>
                </ul>
              </div>

              {/* Technical Information */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Technical Information
                </h4>
                <p className="text-[11px] text-slate-400">Automatically collected technical data:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Operating system</li>
                  <li>Date and time of access</li>
                  <li>Basic usage information</li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 2. How We Use Your Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How We Use Your Information
              </h3>
            </div>
            <p>We use your information to:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                'Create and manage your account',
                'Provide queue management services',
                'Generate and manage queue tokens',
                'Display your position in a queue',
                'Manage appointments',
                'Send queue and appointment notifications',
                'Help businesses manage their queues',
                "Improve Turnova's features and performance",
                'Prevent fraud, misuse, and unauthorized activity',
                'Provide customer support',
                'Maintain security and reliability',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
              We only process personal data for specified and lawful purposes and aim to collect information that is necessary for providing the requested service.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 3. Queue Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Queue Information
              </h3>
            </div>
            <p>
              When you join a queue, Turnova may process information such as your token number, selected service, queue status, and estimated waiting time.
            </p>
            <p>
              Your token number and queue status may be visible to the relevant business for the purpose of managing the queue.
            </p>
            <p className="font-semibold text-slate-900 dark:text-white">
              We do not publicly display unnecessary personal information.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 4. Location Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Location Information
              </h3>
            </div>
            <p>
              If location features are enabled, Turnova may use your location to help you discover nearby businesses or provide location-related services.
            </p>
            <p>
              You can control location permissions through your device or browser settings. Turnova does not require continuous location tracking for basic queue functionality.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 5. Notifications */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                5
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
            </div>
            <p>Turnova may send notifications related to:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Queue confirmation</li>
              <li>Token updates</li>
              <li>Your turn approaching</li>
              <li>Your turn being called</li>
              <li>Appointment reminders</li>
              <li>Appointment confirmations or cancellations</li>
              <li>Important account or service updates</li>
            </ul>
            <p className="text-xs text-slate-500">
              You can manage certain notification preferences through your account or device settings.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 6. Cookies and Similar Technologies */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                6
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cookies and Similar Technologies
              </h3>
            </div>
            <p>Turnova may use cookies or similar technologies to:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Keep you signed in</li>
              <li>Maintain secure sessions</li>
              <li>Remember preferences</li>
              <li>Understand basic website usage</li>
              <li>Improve website performance</li>
            </ul>
            <p className="text-xs text-slate-500">
              You may control cookies through your browser settings. Disabling certain cookies may affect some features of Turnova.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 7. Sharing of Information */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                7
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sharing of Information
              </h3>
            </div>
            <p className="font-bold text-slate-900 dark:text-white">
              We do not sell your personal information.
            </p>
            <p>We may share necessary information with:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Businesses you choose to interact with</li>
              <li>Service providers that help operate Turnova</li>
              <li>Authentication, hosting, notification, analytics, or infrastructure providers</li>
              <li>Authorities when required by applicable law</li>
            </ul>
            <p className="text-xs text-slate-500">
              We only intend to share information that is reasonably necessary for the relevant purpose.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 8. Data Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                8
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Data Security
              </h3>
            </div>
            <p>
              We take reasonable technical and organizational measures to protect personal information against:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Unauthorized access</li>
              <li>Loss</li>
              <li>Misuse</li>
              <li>Alteration</li>
              <li>Unauthorized disclosure</li>
            </ul>
            <p className="text-xs text-slate-500">
              However, no internet-based service can guarantee absolute security.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 9. Data Retention */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                9
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Data Retention
              </h3>
            </div>
            <p>
              We retain personal information only for as long as reasonably necessary to provide our services, maintain records, comply with legal obligations, resolve disputes, and protect our legitimate interests.
            </p>
            <p>
              When information is no longer required, we may delete or anonymize it, subject to applicable legal requirements.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 10. Your Privacy Rights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                10
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your Privacy Rights
              </h3>
            </div>
            <p>Depending on applicable law, you may have rights relating to your personal data, including:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Requesting access to your personal information</li>
              <li>Requesting correction of inaccurate information</li>
              <li>Requesting deletion where applicable</li>
              <li>Withdrawing consent where consent is the basis for processing</li>
              <li>Requesting information about how your data is processed</li>
              <li>Raising a privacy-related complaint</li>
            </ul>
            <p className="text-xs text-slate-500">
              To exercise applicable rights, contact us using the details below.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 11. Children's Privacy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                11
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Children's Privacy
              </h3>
            </div>
            <p>
              Turnova is not specifically designed for children. We do not knowingly collect personal information from children where such collection is prohibited by applicable law.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 12. Third-Party Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                12
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Third-Party Services
              </h3>
            </div>
            <p>Turnova may use third-party services for functions such as:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Hosting</li>
              <li>Authentication</li>
              <li>Cloud storage</li>
              <li>Maps and location services</li>
              <li>Notifications</li>
              <li>Analytics</li>
              <li>Payment processing, if introduced</li>
            </ul>
            <p className="text-xs text-slate-500">
              These services may process information according to their own privacy policies.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 13. Changes to This Privacy Policy */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                13
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Changes to This Privacy Policy
              </h3>
            </div>
            <p>
              We may update this Privacy Policy from time to time. When changes are made, we will update the "Last Updated" date on this page. We recommend reviewing this page periodically.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 14. Contact Us */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                14
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contact Us
              </h3>
            </div>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, contact us:
            </p>
            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 space-y-1.5 text-xs">
              <strong className="block text-sm text-slate-900 dark:text-white">Turnova</strong>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>
                  Email:{' '}
                  <a
                    href="mailto:privacy@turnova.example"
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    privacy@turnova.example
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
              <strong>Important:</strong> This Privacy Policy is intended as a general product/privacy notice and should be reviewed and customized for your actual business, data practices, third-party services, and applicable laws before using Turnova commercially.
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
