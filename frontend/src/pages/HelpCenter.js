import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: 'icon-star' },
    { id: 'getting-started', label: 'Getting Started', icon: 'icon-rocket' },
    { id: 'property-search', label: 'Property Search', icon: 'icon-search' },
    { id: 'account', label: 'Account & Profile', icon: 'icon-user' },
    { id: 'safety', label: 'Safety & Security', icon: 'icon-shield' },
    { id: 'payments', label: 'Payments & Billing', icon: 'icon-money' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create an account on SmartNyumba?',
      answer: 'Click on "Get Started" in the top navigation, choose your user type (Tenant, Landlord, or Agent), and fill in your details. You\'ll receive a verification email to activate your account.'
    },
    {
      id: 2,
      category: 'property-search',
      question: 'How can I search for properties in specific areas?',
      answer: 'Use our advanced search filters on the Properties page. You can filter by county, area, property type, price range, number of bedrooms, and amenities.'
    },
    {
      id: 3,
      category: 'safety',
      question: 'How does SmartNyumba verify properties?',
      answer: 'Our verification team conducts physical inspections, verifies ownership documents, and confirms landlord credentials before listing any property on our platform.'
    },
    {
      id: 4,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your Dashboard and click on "Edit Profile". You can update your personal information, contact details, and preferences from there.'
    },
    {
      id: 5,
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept M-Pesa, bank transfers, and major credit/debit cards. All transactions are secured with bank-level encryption.'
    },
    {
      id: 6,
      category: 'property-search',
      question: 'Can I save properties for later viewing?',
      answer: 'Yes! Click the heart icon on any property to save it to your favorites. You can view all saved properties in your Dashboard.'
    },
    {
      id: 7,
      category: 'safety',
      question: 'What should I do if I encounter a suspicious listing?',
      answer: 'Report it immediately using the "Report" button on the property page. Our team will investigate and take appropriate action within 24 hours.'
    },
    {
      id: 8,
      category: 'getting-started',
      question: 'Is SmartNyumba free to use?',
      answer: 'Yes, browsing and searching for properties is completely free. Landlords and agents pay a small listing fee to post properties.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="section-lg-professional">
      <div className="container-professional">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-6 py-3 mb-8 animate-scale-in">
            <span className="icon icon-star text-primary-600"></span>
            <span className="text-body-sm font-semibold text-primary-700">
              Help Center
            </span>
          </div>
          
          <h1 className="text-display-xl font-display font-bold text-neutral-900 mb-8 animate-slide-up">
            How Can We Help You?
          </h1>
          
          <p className="text-body-lg text-neutral-600 leading-relaxed mb-8 animate-slide-up animate-delay-200">
            Find answers to common questions, get support, and learn how to make the most of SmartNyumba
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-slide-up animate-delay-300">
            <div className="relative">
              <span className="icon icon-search absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-neutral-400"></span>
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-professional pl-12 pr-4 py-4 text-lg focus-professional"
              />
            </div>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link to="/contact" className="glass-professional p-8 rounded-xl text-center hover-lift transition-all duration-300 group">
            <div className="icon icon-message text-6xl text-primary-500 mb-6 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Live Chat</h3>
            <p className="text-body-md text-neutral-600">
              Get instant help from our support team
            </p>
          </Link>
          
          <Link to="/contact" className="glass-professional p-8 rounded-xl text-center hover-lift transition-all duration-300 group">
            <div className="icon icon-phone text-6xl text-success-500 mb-6 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Call Support</h3>
            <p className="text-body-md text-neutral-600">
              Speak directly with our experts
            </p>
          </Link>
          
          <Link to="/contact" className="glass-professional p-8 rounded-xl text-center hover-lift transition-all duration-300 group">
            <div className="icon icon-email text-6xl text-warning-500 mb-6 group-hover:scale-110 transition-transform"></div>
            <h3 className="text-heading-md font-bold text-neutral-900 mb-4">Email Us</h3>
            <p className="text-body-md text-neutral-600">
              Send us your questions anytime
            </p>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-professional p-6 rounded-xl sticky top-8">
              <h3 className="text-heading-md font-bold text-neutral-900 mb-6">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover-lift focus-professional ${
                      activeCategory === category.id
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className={`icon ${category.icon} text-lg`}></span>
                    {category.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-heading-lg font-bold text-neutral-900">
                  {activeCategory === 'all' ? 'All Questions' : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <div className="text-body-sm text-neutral-600">
                  {filteredFaqs.length} article{filteredFaqs.length !== 1 ? 's' : ''} found
                </div>
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="icon icon-search text-8xl text-neutral-400 mb-6"></div>
                  <h3 className="text-heading-md text-neutral-900 mb-4">No results found</h3>
                  <p className="text-body-md text-neutral-600 mb-6">
                    Try adjusting your search terms or browse different categories
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                    className="btn btn-secondary hover-scale focus-professional"
                  >
                    <span className="icon icon-refresh mr-2"></span>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="glass-professional p-6 rounded-xl animate-slide-up hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h3 className="text-heading-md font-bold text-neutral-900 mb-4 flex items-start gap-3">
                        <span className="icon icon-star text-primary-500 text-lg mt-1"></span>
                        {faq.question}
                      </h3>
                      <p className="text-body-md text-neutral-600 leading-relaxed pl-8">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="glass-professional p-12 rounded-xl animate-slide-up">
            <h2 className="text-heading-xl font-display font-bold text-neutral-900 mb-6">
              Still Need Help?
            </h2>
            <p className="text-body-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can't find the answer you're looking for? Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn btn-primary btn-lg hover-scale focus-professional"
              >
                <span className="icon icon-message mr-3"></span>
                Contact Support
              </Link>
              <Link
                to="/register"
                className="btn btn-secondary btn-lg hover-scale focus-professional"
              >
                <span className="icon icon-rocket mr-3"></span>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
