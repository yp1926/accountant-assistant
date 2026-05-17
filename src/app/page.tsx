import TaxNestLogo from "@/components/ui/taxnest-logo";

import Link from "next/link";

import {
  ArrowRight,
  Bell,
  FileText,
  Shield,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-white text-black overflow-hidden">

      {/* Navbar */}
      <header className="border-b border-white/10 bg-white/80 backdrop-blur-xl sticky top-0 z-50 h-20 flex items-center">

        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <TaxNestLogo
            width={230}
            height={70}
          />

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">

            <a
              href="#features"
              className="hover:text-blue-600 transition"
            >
              Features
            </a>

            <a
              href="#security"
              className="hover:text-blue-600 transition"
            >
              Security
            </a>

            <a
              href="#pricing"
              className="hover:text-blue-600 transition"
            >
              Pricing
            </a>

          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/20"
            >
              Get Started
            </Link>

          </div>

        </div>

      </header>

      {/* Hero */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-slate-100 via-white to-blue-100 overflow-hidden">

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-300 rounded-full blur-3xl opacity-20" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-300 rounded-full blur-3xl opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">

              Modern Accountant CRM Platform

            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-slate-900">

              The modern workspace for accountants.

            </h1>

            <p className="text-xl text-slate-600 mt-8 leading-relaxed max-w-2xl">

              Manage clients, reminders, documents and workflows
              in one intelligent platform built specifically for
              modern accounting firms.

            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Smart reminders
                </span>

              </div>

              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Secure cloud storage
                </span>

              </div>

              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Client CRM
                </span>

              </div>

              <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-4 py-3 shadow-sm">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span className="font-medium">
                  Workflow automation
                </span>

              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition shadow-xl shadow-blue-500/20"
              >

                Start Free

                <ArrowRight size={18} />

              </Link>

              <Link
                href="/login"
                className="border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white px-8 py-4 rounded-2xl font-semibold transition text-center"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}
          <div className="relative">

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-40" />

            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[32px] p-8 shadow-2xl relative border border-white/10">

              <div className="bg-white rounded-3xl p-6 space-y-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Dashboard
                    </p>

                    <h3 className="text-2xl font-bold">
                      TaxNest
                    </h3>

                  </div>

                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">

                    Live

                  </div>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gray-100 rounded-2xl p-4">

                    <p className="text-gray-500 text-sm">
                      Clients
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      148
                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-2xl p-4">

                    <p className="text-gray-500 text-sm">
                      Pending
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      23
                    </p>

                  </div>

                </div>

                {/* Activity */}
                <div className="space-y-3">

                  <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">

                    <span className="text-sm">
                      VAT reminder sent
                    </span>

                    <span className="text-xs text-gray-500">
                      2m ago
                    </span>

                  </div>

                  <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">

                    <span className="text-sm">
                      Client uploaded documents
                    </span>

                    <span className="text-xs text-gray-500">
                      10m ago
                    </span>

                  </div>

                  <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">

                    <span className="text-sm">
                      Reminder completed
                    </span>

                    <span className="text-xs text-gray-500">
                      1h ago
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="py-28 bg-white px-6"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">

              Features

            </div>

            <h2 className="text-5xl font-bold text-slate-900">
              Everything accountants need
            </h2>

            <p className="text-xl text-gray-600 mt-6 leading-relaxed">

              Built specifically for accounting firms that want
              modern client management and automated workflows.

            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

            {/* Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition duration-300">

              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">

                <Users size={28} />

              </div>

              <h3 className="text-xl font-bold mt-6">
                Client CRM
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">

                Organize and manage all accounting clients in one
                centralized workspace.

              </p>

            </div>

            {/* Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition duration-300">

              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">

                <Bell size={28} />

              </div>

              <h3 className="text-xl font-bold mt-6">
                Smart Reminders
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">

                Automate deadlines, tax reminders and client
                follow-ups.

              </p>

            </div>

            {/* Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition duration-300">

              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">

                <FileText size={28} />

              </div>

              <h3 className="text-xl font-bold mt-6">
                Documents
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">

                Upload and organize accounting documents securely
                per client.

              </p>

            </div>

            {/* Feature */}
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:-translate-y-1 hover:shadow-2xl transition duration-300">

              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">

                <Shield size={28} />

              </div>

              <h3 className="text-xl font-bold mt-6">
                Secure Platform
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">

                Enterprise-grade authentication and cloud
                infrastructure.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Security */}
      <section
        id="security"
        className="py-28 px-6 bg-gradient-to-br from-slate-900 to-blue-900 text-white relative overflow-hidden"
      >

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

            Enterprise Security

          </div>

          <h2 className="text-5xl font-bold">
            Built with security first
          </h2>

          <p className="text-xl text-blue-100 mt-6 leading-relaxed">

            TaxNest uses secure authentication, protected cloud
            storage and row-level access policies to safeguard
            sensitive accounting data.

          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">

              <h3 className="font-bold text-xl">
                Secure Authentication
              </h3>

              <p className="text-blue-100 mt-4">

                Protected sessions and encrypted login workflows.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">

              <h3 className="font-bold text-xl">
                Private Access
              </h3>

              <p className="text-blue-100 mt-4">

                Users only access their own clients and documents.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">

              <h3 className="font-bold text-xl">
                Cloud Infrastructure
              </h3>

              <p className="text-blue-100 mt-4">

                Built for scalability, reliability and security.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-28 bg-slate-50 px-6"
      >

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">

            Pricing

          </div>

          <h2 className="text-5xl font-bold text-slate-900">
            Simple pricing
          </h2>

          <p className="text-xl text-gray-600 mt-6">

            Start managing your accounting workflow today.

          </p>

          <div className="bg-white border border-gray-200 rounded-[32px] p-12 mt-16 shadow-2xl shadow-gray-100">

            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">

              Early Access

            </div>

            <h3 className="text-6xl font-bold text-slate-900">
              Free
            </h3>

            <p className="text-gray-600 mt-4">
              During beta launch
            </p>

            <div className="space-y-4 mt-10 text-left max-w-md mx-auto">

              <div>
                ✓ Unlimited clients
              </div>

              <div>
                ✓ Smart reminders
              </div>

              <div>
                ✓ Document storage
              </div>

              <div>
                ✓ Dashboard analytics
              </div>

              <div>
                ✓ Secure cloud access
              </div>

            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold mt-10 transition shadow-lg shadow-blue-500/20"
            >

              Get Started

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-28 px-6 bg-white">

        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-blue-900 rounded-[36px] p-14 text-center text-white relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl opacity-20" />

          <div className="relative z-10">

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">

              Modernize your accounting workflow.

            </h2>

            <p className="text-xl text-blue-100 mt-6 max-w-2xl mx-auto leading-relaxed">

              Join the next generation of accounting firms using
              TaxNest to manage clients, reminders and documents.

            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-semibold transition shadow-lg shadow-blue-500/20"
              >
                Start Free
              </Link>

              <Link
                href="/login"
                className="border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-semibold transition backdrop-blur-sm"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-6">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          {/* Left */}
          <div className="flex flex-col items-center md:items-start gap-1">

            <p className="font-semibold text-slate-900">
              © 2026 TaxNest
            </p>

            <p>
              The modern workspace for accountants.
            </p>

          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-5">

            <Link
              href="/privacy"
              className="hover:text-blue-600 transition"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="hover:text-blue-600 transition"
            >
              Terms
            </Link>

            <a
              href="mailto:support@taxnest.ai"
              className="hover:text-blue-600 transition"
            >
              Contact
            </a>

            <Link
              href="/login"
              className="hover:text-blue-600 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="hover:text-blue-600 transition"
            >
              Signup
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}