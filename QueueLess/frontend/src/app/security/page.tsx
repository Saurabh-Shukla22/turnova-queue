'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  ShieldCheck,
  Lock,
  Clock,
  Key,
  Database,
  Server,
  Users,
  Radio,
  Eye,
  FileCheck,
  AlertTriangle,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function SecurityPage() {
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
            <span>Turnova Trust & Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Security Overview
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
              At Turnova, security is an important part of how we build and operate our platform.
            </h2>
            <p>
              We use reasonable technical and organizational measures to help protect user and business information from unauthorized access, misuse, alteration, disclosure, or destruction.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 1. Secure Authentication */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Authentication
              </h3>
            </div>
            <p>Turnova protects user accounts using secure authentication practices:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Passwords are securely hashed using industry-standard algorithms (bcrypt with salt) before being stored.</li>
              <li>Authentication tokens (JWT) are signed and protected.</li>
              <li>Protected routes require valid authentication headers.</li>
              <li>Role-based access controls prevent unauthorized access to restricted features.</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 2. Data Protection */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Data Protection
              </h3>
            </div>
            <p>We take steps to protect information handled by Turnova, including:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Account information</li>
              <li>Queue information</li>
              <li>Appointment information</li>
              <li>Business information</li>
              <li>Reviews and user-generated content</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Access to sensitive information is limited to authorized users and systems that need it to provide the service.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 3. Secure Communication */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Communication
              </h3>
            </div>
            <p>
              Turnova is designed to use encrypted HTTPS connections for communication between users and our servers. This helps protect information while it is transmitted over the internet.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 4. Database Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Database Security
              </h3>
            </div>
            <p>Turnova uses access controls and authentication to protect its database infrastructure. We aim to:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Restrict unauthorized database access</li>
              <li>Use secure credentials</li>
              <li>Avoid exposing database credentials in application code</li>
              <li>Validate incoming data</li>
              <li>Protect against common database attacks (injection, prototype pollution)</li>
              <li>Maintain appropriate backups where applicable</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 5. API Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                5
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                API Security
              </h3>
            </div>
            <p>Our APIs use security controls such as:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              {[
                'Authentication',
                'Authorization',
                'Input validation',
                'Rate limiting',
                'Request validation',
                'Error handling',
                'CORS controls',
                'Helmet headers',
              ].map((item) => (
                <li key={item} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 font-medium text-center">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Users can only access resources and actions permitted by their account role.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 6. Role-Based Access */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                6
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Role-Based Access
              </h3>
            </div>
            <p>Turnova uses different access levels for different types of accounts:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  User
                </h4>
                <p className="text-xs text-slate-500">Can manage their own:</p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                  <li>Queues & digital tokens</li>
                  <li>Appointments</li>
                  <li>Profile & password</li>
                  <li>Reviews</li>
                  <li>Notifications</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Business Owner
                </h4>
                <p className="text-xs text-slate-500">Can manage:</p>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                  <li>Business profile & branding</li>
                  <li>Services & operating hours</li>
                  <li>Live queues & customer calls</li>
                  <li>Appointments</li>
                  <li>Staff assignments</li>
                  <li>Analytics</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Staff
                </h4>
                <p className="text-xs text-slate-500">Scope:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Can perform only the operational queue actions assigned by the business owner (calling next, serving customers).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Administrator
                </h4>
                <p className="text-xs text-slate-500">Scope:</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Can manage platform-level operations, business verification, user moderation, reports, and global metrics.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 7. Real-Time Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                7
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Security
              </h3>
            </div>
            <p>
              Turnova uses real-time communication (Socket.IO) for live queue updates. Real-time connections are validated before allowing access to protected queue information. Users should only receive queue updates associated with queues they are authorized to access.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 8. Account Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                8
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Security
              </h3>
            </div>
            <p>Users are responsible for keeping their account credentials secure. We recommend:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Using a strong, unique password</li>
              <li>Never sharing your password</li>
              <li>Logging out from shared devices</li>
              <li>Keeping your email account secure</li>
              <li>Reporting suspicious account activity</li>
            </ul>
            <p className="text-xs text-rose-600 dark:text-rose-400 pt-1">
              If you believe your account has been compromised, contact us as soon as possible.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 9. Business Security */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                9
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Business Security
              </h3>
            </div>
            <p>Business owners are responsible for managing access to their business accounts. Business owners should:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Use strong passwords</li>
              <li>Only provide staff access when required</li>
              <li>Remove access for former staff</li>
              <li>Keep business information accurate</li>
              <li>Avoid sharing account credentials</li>
            </ul>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 10. Third-Party Services */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                10
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Third-Party Services
              </h3>
            </div>
            <p>Turnova may use trusted third-party services for functions such as:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Cloud hosting</li>
              <li>Database infrastructure</li>
              <li>Authentication</li>
              <li>Email delivery</li>
              <li>Notifications</li>
              <li>Maps</li>
              <li>File storage</li>
            </ul>
            <p className="text-xs text-slate-500">
              Third-party services may have their own security practices and policies.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 11. Security Monitoring */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                11
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Security Monitoring
              </h3>
            </div>
            <p>We may monitor system activity for security purposes, including detecting:</p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>Suspicious login attempts</li>
              <li>Unauthorized access attempts</li>
              <li>Abuse</li>
              <li>Automated attacks</li>
              <li>Unusual activity</li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              Security logs may be retained for an appropriate period for investigation and protection of the platform.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 12. Vulnerability Management */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                12
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vulnerability Management
              </h3>
            </div>
            <p>
              We continuously aim to identify and address security vulnerabilities in our application and infrastructure. Security updates and dependency updates may be applied when appropriate.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 13. Responsible Disclosure */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                13
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Responsible Disclosure
              </h3>
            </div>
            <p>
              If you discover a potential security vulnerability in Turnova, please report it responsibly. Please do not publicly disclose the vulnerability before we have had a reasonable opportunity to investigate and address it.
            </p>
            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 space-y-1.5 text-xs">
              <strong className="block text-sm text-slate-900 dark:text-white">Security Contact</strong>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>
                  Email:{' '}
                  <a
                    href="mailto:security@turnova.example"
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    security@turnova.example
                  </a>
                </span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white pt-2">
              When reporting a vulnerability, please include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
              <li>A description of the issue</li>
              <li>Steps to reproduce it</li>
              <li>Potential impact</li>
              <li>Relevant screenshots or evidence, if safe to provide</li>
            </ul>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Please do not include passwords, personal information, or other sensitive data in your report.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 14. Security Limitations */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                14
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Security Limitations
              </h3>
            </div>
            <p>
              Although we take reasonable measures to protect Turnova, no online service can guarantee absolute security. Users should also take appropriate steps to protect their accounts and devices.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 15. Security Updates */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-200/60 dark:border-brand-800/60">
                15
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Security Updates
              </h3>
            </div>
            <p>
              We may update our security practices as our platform evolves. Important security-related changes may be reflected on this page.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Contact Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/70 space-y-1.5 text-xs">
            <strong className="block text-sm text-slate-900 dark:text-white">Turnova Security Team</strong>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-brand-500" />
              <span>
                For security-related questions or vulnerability reports:{' '}
                <a
                  href="mailto:security@turnova.example"
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  security@turnova.example
                </a>
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
