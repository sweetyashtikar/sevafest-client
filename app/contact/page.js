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
  MessageCircle
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
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="w-6 h-6 text-green-600" />
                Contact Details
              </h2>
              
              {/* Office Address 1 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Office Address-1</p>
                    <p className="text-gray-600">Parbhani, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Office Address 2 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Office Address-2</p>
                    <p className="text-gray-600">Parbhani, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Emergency Call */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Emergency Call</p>
                    <a href="tel:07507566066" className="text-red-600 hover:text-red-700 font-bold text-lg">
                      07507566066
                    </a>
                  </div>
                </div>
              </div>

              {/* General Communication */}
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">General Communication</p>
                    <a href="mailto:info@sevafast.in" className="text-purple-600 hover:text-purple-700">
                      info@sevafast.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Business Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-orange-300">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-orange-300">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Sunday</span>
                  <span className="text-orange-200">Closed</span>
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Facebook className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Twitter className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Instagram className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <Linkedin className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Need Help? Send Message
                </h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you shortly</p>
              </div>

              <div className="space-y-6">
                {/* Name Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-3">
                    Service Type
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="delivery"
                        checked={formData.serviceType === 'delivery'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-green-500 peer-checked:bg-green-500 flex items-center justify-center">
                            {formData.serviceType === 'delivery' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">Delivery Problem</span>
                        </div>
                      </div>
                    </label>

                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="customer"
                        checked={formData.serviceType === 'customer'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 flex items-center justify-center">
                            {formData.serviceType === 'customer' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">Customer Service</span>
                        </div>
                      </div>
                    </label>

                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="others"
                        checked={formData.serviceType === 'others'}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg peer-checked:border-purple-500 peer-checked:bg-purple-50 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-purple-500 peer-checked:bg-purple-500 flex items-center justify-center">
                            {formData.serviceType === 'others' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-700">Others Service</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Messages
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows="6"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-4 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">Map Integration Area</p>
              <p className="text-gray-400 text-sm mt-2">Embed your Google Maps here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;