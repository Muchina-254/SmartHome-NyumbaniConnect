import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="section-lg-professional">
      <div className="container-professional">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-6 py-3 mb-8 animate-scale-in">
            <span className="icon icon-phone text-primary-600"></span>
            <span className="text-body-sm font-semibold text-primary-700">
              Contact SmartNyumba
            </span>
          </div>
          
          <h1 className="text-display-xl font-display font-bold text-neutral-900 mb-8 animate-slide-up">
            Get in Touch with Us
          </h1>
          
          <p className="text-body-lg text-neutral-600 leading-relaxed animate-slide-up animate-delay-200">
            Have questions about properties, need support, or want to partner with us? 
            We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-slide-left">
            <div className="glass-professional p-8 rounded-xl">
              <h2 className="text-heading-lg font-bold text-neutral-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-professional focus-professional"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-professional focus-professional"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="select-professional focus-professional"
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-body-sm font-semibold text-neutral-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="input-professional focus-professional resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full hover-scale focus-professional"
                >
                  <span className="icon icon-email mr-3"></span>
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="animate-slide-right">
            <div className="space-y-8">
              {/* Office Information */}
              <div className="glass-professional p-8 rounded-xl">
                <h3 className="text-heading-lg font-bold text-neutral-900 mb-6">Our Office</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <span className="icon icon-location text-2xl text-primary-500 mt-1"></span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Address</h4>
                      <p className="text-body-md text-neutral-600">
                        Westlands, Nairobi<br />
                        Kenya
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <span className="icon icon-phone text-2xl text-primary-500 mt-1"></span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Phone</h4>
                      <p className="text-body-md text-neutral-600">
                        +254 700 000 000<br />
                        +254 720 000 000
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <span className="icon icon-email text-2xl text-primary-500 mt-1"></span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Email</h4>
                      <p className="text-body-md text-neutral-600">
                        info@smartnyumba.com<br />
                        support@smartnyumba.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support */}
              <div className="glass-professional p-8 rounded-xl">
                <h3 className="text-heading-lg font-bold text-neutral-900 mb-6">Quick Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="icon icon-message text-xl text-primary-500"></span>
                      <span className="font-medium text-neutral-900">Live Chat</span>
                    </div>
                    <span className="text-body-sm text-success-500 font-medium">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="icon icon-phone text-xl text-primary-500"></span>
                      <span className="font-medium text-neutral-900">Call Support</span>
                    </div>
                    <span className="text-body-sm text-neutral-500 font-medium">24/7</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="icon icon-star text-xl text-primary-500"></span>
                      <span className="font-medium text-neutral-900">Help Center</span>
                    </div>
                    <span className="text-body-sm text-primary-500 font-medium">View FAQs</span>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass-professional p-8 rounded-xl">
                <h3 className="text-heading-lg font-bold text-neutral-900 mb-6">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Monday - Friday</span>
                    <span className="font-medium text-neutral-900">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Saturday</span>
                    <span className="font-medium text-neutral-900">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Sunday</span>
                    <span className="font-medium text-neutral-900">Closed</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-700">Emergency Support</span>
                      <span className="font-medium text-success-500">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
