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
    <main className="min-h-screen bg-white text-black">

      {/* Navbar */}
      <header className="border-b bg-white sticky top-0 z-50 h-20 flex items-center">

        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <TaxNestLogo
            width={230}
            height={70}
          />

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

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
              className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Get Started
            </Link>

          </div>

        </div>

      </header>

      {/* Hero */}
      <section className="py-28 px-6 overflow-hidden">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div>

            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">

              Modern Accountant CRM Platform

            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">

              The modern workspace for accountants.

            </h1>

            <p className="text-xl text-gray-600 mt-8 leading-relaxed max-w-2xl">

              Manage clients, reminders, documents and workflows
              in one intelligent platform built specifically for
              accounting firms.

            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span>
                  Smart reminders
                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span>
                  Secure cloud storage
                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span>
                  Client CRM
                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={20}
                  className="text-blue-600"
                />

                <span>
                  Workflow automation
                </span>

              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >

                Start Free

                <ArrowRight size={18} />

              </Link>

              <Link
                href="/login"
                className="border border-gray-300 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition text-center"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}
          <div className="relative">

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40" />

            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 shadow-2xl relative">

              <div className="bg-white rounded-2xl p-6 space-y-6">

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

                  <div className="bg-gray-100 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Clients
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      148
                    </p>

                  </div>

                  <div className="bg-gray-100 rounded-xl p-4">

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

                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">

                    <span className="text-sm">
                      VAT reminder sent
                    </span>

                    <span className="text-xs text-gray-500">
                      2m ago
                    </span>

                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">

                    <span className="text-sm">
                      Client uploaded documents
                    </span>

                    <span className="text-xs text-gray-500">
                      10m ago
                    </span>

                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">

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
        className="py-24 bg-gray-50 px-6"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-3xl mx-auto">

            <h2 className="text-4xl font-bold">
              Everything accountants need
            </h2>

            <p className="text-xl text-gray-600 mt-6">

              Built specifically for accounting firms that want
              modern client management and automated workflows.

            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

            {/* Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition">

              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">

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
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition">

              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">

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
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition">

              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">

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
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition">

              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">

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
        className="py-24 px-6"
      >

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl font-bold">
            Built with security first
          </h2>

          <p className="text-xl text-gray-600 mt-6 leading-relaxed">

            TaxNest uses secure authentication, protected cloud
            storage and row-level access policies to safeguard
            sensitive accounting data.

          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

            <div className="border rounded-2xl p-8">

              <h3 className="font-bold text-xl">
                Secure Authentication
              </h3>

              <p className="text-gray-600 mt-4">

                Protected sessions and encrypted login workflows.

              </p>

            </div>

            <div className="border rounded-2xl p-8">

              <h3 className="font-bold text-xl">
                Private Access
              </h3>

              <p className="text-gray-600 mt-4">

                Users only access their own clients and documents.

              </p>

            </div>

            <div className="border rounded-2xl p-8">

              <h3 className="font-bold text-xl">
                Cloud Infrastructure
              </h3>

              <p className="text-gray-600 mt-4">

                Built for scalability, reliability and security.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 bg-gray-50 px-6"
      >

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl font-bold">
            Simple pricing
          </h2>

          <p className="text-xl text-gray-600 mt-6">

            Start managing your accounting workflow today.

          </p>

          <div className="bg-white border rounded-3xl p-10 mt-16 shadow-sm">

            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">

              Early Access

            </div>

            <h3 className="text-5xl font-bold">
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
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold mt-10 transition"
            >

              Get Started

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-24 px-6">

        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-14 text-center text-white">

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">

            Modernize your accounting workflow.

          </h2>

          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">

            Join the next generation of accounting firms using
            TaxNest to manage clients, reminders and documents.

          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
            >
              Start Free
            </Link>

            <Link
              href="/login"
              className="border border-gray-600 hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 px-6">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

          {/* Left */}
          <div className="flex flex-col items-center md:items-start gap-1">

            <p className="font-medium text-slate-900">
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