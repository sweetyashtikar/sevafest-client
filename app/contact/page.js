'use client'

import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  User,
  AtSign,
  PhoneCall,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Page</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-semibold">Contact Page</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-2">
              Get In Touch
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8">Contact Details</h2>
                
                {/* Office Address 1 */}
                <div className="mb-6">
                  <p className="font-bold text-lg mb-1">Office Address-1:</p>
                  <p className="text-green-100">Parbhani</p>
                </div>

                {/* Office Address 2 */}
                <div className="mb-8 pb-8 border-b border-white/20">
                  <p className="font-bold text-lg mb-1">Office Address-2:</p>
                  <p className="text-green-100">Parbhani</p>
                </div>

                {/* Emergency Call */}
                <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Emergency Call</p>
                      <a href="tel:07507566066" className="text-2xl font-bold hover:text-green-200 transition-colors">
                        07507566066
                      </a>
                    </div>
                  </div>
                </div>

                {/* General Communication */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">General Communication</p>
                      <a href="mailto:info@sevafast.in" className="text-lg font-semibold hover:text-green-200 transition-colors">
                        info@sevafast.in
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Share */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Social Share:</h3>
                  <div className="flex gap-3">
                    <button className="w-12 h-12 bg-white/20 hover:bg-white hover:text-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-white/30">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 hover:bg-white hover:text-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-white/30">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 hover:bg-white hover:text-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-white/30">
                      <Instagram className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 hover:bg-white hover:text-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110 border border-white/30">
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Need Help? Send Message
                </h2>
              </div>

              <div className="space-y-6">
                {/* Name Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Recipient Email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Service Type - Checkboxes */}
                <div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value="delivery"
                        checked={formData.serviceType === 'delivery'}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-700 font-medium">Delivery Problem</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value="customer"
                        checked={formData.serviceType === 'customer'}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-700 font-medium">Customer Service</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="serviceType"
                        value="others"
                        checked={formData.serviceType === 'others'}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-700 font-medium">Others Service</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Messages
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none bg-gray-50 text-gray-900 placeholder-gray-400"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;