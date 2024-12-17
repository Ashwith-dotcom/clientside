
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative">
      {/* Footer Image */}
      

      {/* Main Footer Content */}
      <div className="bg-gradient-to-b from-orange-900 to-orange-800">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-300" />
                  <span>+91 7382046888</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-300" />
                  <a href="mailto:info@vikastarangini.org" className="hover:text-orange-300 transition-colors">
                    info@vikastarangini.org
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-orange-300 flex-shrink-0" />
                  <p>Sriramnnagar, Muchinthal, Shamshabad</p>
                </div>
              </div>
            </div>

            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-orange-300 transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-300 transition-colors">Our Mission</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-300 transition-colors">Get Involved</a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-300 transition-colors">Donate</a>
                </li>
              </ul>
            </div>

            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
              <div className="flex gap-4 mb-6">
                <a href="#" className="hover:text-orange-300 transition-colors">
                  <Facebook />
                </a>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  <Twitter />
                </a>
                <a href="#" className="hover:text-orange-300 transition-colors">
                  <Instagram />
                </a>
              </div>
              <p className="text-sm">
                Follow us on social media to stay updated with our latest activities and impact stories.
              </p>
            </div>
          </div>
          <div className="w-full mt-8">
        <img
          src={require("../Images/footer1.png")} // Replace with your image path or URL
          alt="Footer Image"
          className="w-full h-auto "
        />
      </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;