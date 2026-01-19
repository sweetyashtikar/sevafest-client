"use client";

import {
  Shield,
  FileText,
  UserCheck,
  Lock,
  CreditCard,
  RefreshCw,
  Copyright,
  MessageSquare,
  Cookie,
  Database,
  Link2,
  AlertTriangle,
  Scale,
  XCircle,
  Gavel,
  Globe,
  Edit,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-center text-blue-100 mb-2">
            Last Updated: January 9, 2026
          </p>
          <p className="text-center text-blue-50 max-w-2xl mx-auto">
            Welcome to grostore! Please read these terms carefully before using
            our services.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto py-12">
      
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:p-16">

          <div className="space-y-12">
        
            <section className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  1. Introduction
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                These Terms and Conditions ("Terms") govern your access to and
                use of the grostore website and services (collectively, the
                "Service"). By accessing or using our Service, you agree to be
                bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree to these Terms, please do not use our
                Service. We reserve the right to modify these Terms at any time,
                and your continued use of the Service constitutes acceptance of
                any changes.
              </p>
            </section>

            {/* Definitions */}
            <section className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  2. Definitions
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                For the purposes of these Terms:
              </p>
              <div className="space-y-3">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <strong className="text-purple-700">
                      "We," "Us," "Our"
                    </strong>{" "}
                    refers to grostore and its affiliates
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <strong className="text-purple-700">
                      "You," "Your," "User"
                    </strong>{" "}
                    refers to the individual or entity accessing our Service
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <strong className="text-purple-700">"Content"</strong> means
                    any text, images, videos, or other materials available on
                    the Service
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <strong className="text-purple-700">"Account"</strong> means
                    the account you create to access certain features of our
                    Service
                  </p>
                </div>
              </div>
            </section>

            {/* Account Registration */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  3. Account Registration
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                To access certain features of our Service, you may be required
                to create an account. When creating an account, you agree to:
              </p>
              <div className="bg-green-50 p-6 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Provide accurate, current, and complete information
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Maintain and promptly update your account information to
                    keep it accurate
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Maintain the security of your password and accept all risks
                    of unauthorized access
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Notify us immediately if you discover any unauthorized use
                    of your account
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700">
                    Be responsible for all activities that occur under your
                    account
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-800 font-medium">
                  ⚠️ You must be at least 18 years old to create an account and
                  use our Service.
                </p>
              </div>
            </section>

            {/* Use of Service */}
            <section className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  4. Use of Service
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                You agree to use our Service only for lawful purposes. You agree
                not to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ❌ Violate any applicable laws
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ❌ Infringe intellectual property rights
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ❌ Upload viruses or malicious code
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">❌ Gain unauthorized access</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ❌ Disrupt or interfere with Service
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">❌ Impersonate others</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">❌ Harvest user information</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ❌ Unauthorized commercial use
                  </p>
                </div>
              </div>
            </section>

            {/* Purchases and Payments */}
            <section className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  5. Purchases and Payments
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  When you make a purchase through our Service, you agree to
                  provide current, complete, and accurate purchase and account
                  information.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-800 mb-2">
                    💳 All prices are subject to change without notice.
                  </p>
                  <p className="text-gray-800 mb-2">
                    🛡️ We reserve the right to refuse or cancel any order.
                  </p>
                  <p className="text-gray-800">
                    ✅ Payment must be received before order acceptance.
                  </p>
                </div>
              </div>
            </section>

            {/* Returns and Refunds */}
            <section className="border-l-4 border-teal-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-8 h-8 text-teal-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  6. Returns and Refunds
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                Our return and refund policy allows you to return products
                within 30 days of receipt, subject to certain conditions:
              </p>
              <div className="bg-teal-50 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <p className="text-gray-700">
                    Products must be unused and in their original packaging
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <p className="text-gray-700">
                    Proof of purchase is required for all returns
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <p className="text-gray-700">
                    Certain products may be non-returnable (e.g., perishable
                    goods)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <p className="text-gray-700">
                    Refunds will be processed within 7-10 business days
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="border-l-4 border-indigo-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Copyright className="w-8 h-8 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  7. Intellectual Property Rights
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                Unless otherwise stated, grostore and/or its licensors own all
                intellectual property rights for all material on grostore.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium">
                    ✓ Website design & graphics
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium">
                    ✓ Product descriptions
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium">
                    ✓ Logos & trademarks
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium">✓ Software & code</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <p className="text-gray-800 font-semibold mb-3">
                  You must not:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    • Republish material from this website
                  </p>
                  <p className="text-gray-700">
                    • Sell, rent, or sub-license material
                  </p>
                  <p className="text-gray-700">
                    • Reproduce or duplicate material
                  </p>
                  <p className="text-gray-700">
                    • Redistribute content from grostore
                  </p>
                </div>
              </div>
            </section>

            {/* User Content */}
            <section className="border-l-4 border-pink-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-pink-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  8. User-Generated Content
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                You may have the opportunity to submit reviews, comments, or
                other content ("User Content"). By submitting User Content, you
                grant us a worldwide, non-exclusive, royalty-free license to
                use, reproduce, modify, and display such content.
              </p>
              <div className="bg-pink-50 p-6 rounded-lg">
                <p className="text-gray-800 font-semibold mb-3">
                  You represent and warrant that:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    ✓ You own or have the right to submit the User Content
                  </p>
                  <p className="text-gray-700">
                    ✓ The User Content does not violate any third-party rights
                  </p>
                  <p className="text-gray-700">
                    ✓ The User Content does not contain offensive or illegal
                    material
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Cookies */}
            <section className="border-l-4 border-orange-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-8 h-8 text-orange-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  9. Privacy and Cookies
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                We respect your privacy and are committed to protecting your
                personal data. We employ the use of cookies to enhance your
                experience.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-5 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-700">Remember preferences</p>
                </div>
                <div className="bg-orange-50 p-5 rounded-lg">
                  <Database className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-700">Understand usage patterns</p>
                </div>
                <div className="bg-orange-50 p-5 rounded-lg">
                  <Edit className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-700">Improve user experience</p>
                </div>
                <div className="bg-orange-50 p-5 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-700">Personalized content</p>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="border-l-4 border-cyan-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-cyan-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  10. Information We Collect
                </h2>
              </div>
              <div className="space-y-3">
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">Identifiers:</strong>{" "}
                    Name, email, phone, address
                  </p>
                </div>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">Demographic:</strong> Age,
                    gender, preferences
                  </p>
                </div>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">Commercial:</strong>{" "}
                    Purchase history, browsing behavior
                  </p>
                </div>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">
                      Internet Activity:
                    </strong>{" "}
                    IP address, browser type, device info
                  </p>
                </div>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">Geolocation:</strong>{" "}
                    Location for delivery purposes
                  </p>
                </div>
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <p className="text-gray-800">
                    <strong className="text-cyan-700">Audio/Visual:</strong>{" "}
                    Profile pictures, review images
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Links */}
            <section className="border-l-4 border-violet-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Link2 className="w-8 h-8 text-violet-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  11. Third-Party Links
                </h2>
              </div>
              <div className="bg-violet-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  Our Service may contain links to third-party websites or
                  services that are not owned or controlled by grostore.
                </p>
                <p className="text-gray-700">
                  We have no control over, and assume no responsibility for, the
                  content, privacy policies, or practices of any third-party
                  websites.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  12. Limitation of Liability
                </h2>
              </div>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by applicable law, grostore
                shall not be liable for any indirect, incidental, or
                consequential damages:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">⚠️ Loss of profits or revenue</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    ⚠️ Loss of data or information
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">⚠️ Business interruption</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700">⚠️ Loss of goodwill</p>
                </div>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-gray-800 font-semibold mb-2">
                  We cannot exclude liability for:
                </p>
                <p className="text-gray-700">
                  ✓ Death or personal injury caused by negligence
                </p>
                <p className="text-gray-700">
                  ✓ Fraud or fraudulent misrepresentation
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section className="border-l-4 border-amber-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  13. Indemnification
                </h2>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  You agree to indemnify and hold harmless grostore from all
                  claims resulting from:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    • Your violation of these Terms
                  </p>
                  <p className="text-gray-700">
                    • Your violation of any rights of another party
                  </p>
                  <p className="text-gray-700">• Your use of the Service</p>
                  <p className="text-gray-700">• Any User Content you submit</p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  14. Termination
                </h2>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  We may terminate or suspend your account immediately, without
                  prior notice, for any reason including breach of these Terms.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service will
                  immediately cease.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  15. Dispute Resolution
                </h2>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-5 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">
                    Step 1: Informal Resolution
                  </p>
                  <p className="text-gray-700">
                    Contact us first to seek an informal resolution
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">
                    Step 2: Mediation
                  </p>
                  <p className="text-gray-700">
                    If informal resolution fails, submit to mediation
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">
                    Step 3: Arbitration
                  </p>
                  <p className="text-gray-700">
                    If mediation unsuccessful, binding arbitration
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  16. Governing Law
                </h2>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  These Terms shall be governed by and construed in accordance
                  with the laws of India, without regard to its conflict of law
                  provisions.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <Edit className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  17. Changes to Terms
                </h2>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-3">
                  We reserve the right to modify these Terms at any time.
                  Material revisions will have at least 30 days' notice.
                </p>
                <p className="text-gray-700">
                  Continued use after revisions means you accept the new terms.
                </p>
              </div>
            </section>

            {/* Severability */}
            <section className="border-l-4 border-gray-500 pl-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-8 h-8 text-gray-600" />
                <h2 className="text-3xl font-bold text-gray-900">
                  18. Severability
                </h2>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  If any provision is held unenforceable, it will be modified to
                  accomplish its objectives to the greatest extent possible, and
                  remaining provisions continue in full force.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
