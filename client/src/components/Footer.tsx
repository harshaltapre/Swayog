import { Link } from "wouter";
import {
  Sun,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { FreeQuoteModal } from "./FreeQuoteModal";

import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="Swayog Energy Private Limited - Together We Can"
                className="h-12 w-auto md:h-14 lg:h-16 object-contain"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering homes and businesses with clean, renewable energy
              solutions. Join the green revolution today.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, url: "https://www.facebook.com/share/1UkbxMyKcX/" },
                { Icon: X, url: "https://x.com/Swayog_Energy" },
                { Icon: Instagram, url: "https://www.instagram.com/swayog.energy" },
                { Icon: Linkedin, url: "https://www.linkedin.com/company/swayog" },
              ].map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={`Visit our ${Icon.name} page`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Projects Gallery", href: "/projects" },
                { label: "Pricing Packages", href: "/pricing" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Services</h3>
            <ul className="space-y-4">
              {[
                "Residential Solar",
                "Commercial Solutions",
                "Industrial Plants",
                "Virtual Net Metering.",
                "DG PV Synchronization",
                "Operation & Maintenance",
                "Battery Storage",
                "cleaning Services",
              ].map((service) => (
                <li
                  key={service}
                  className="text-gray-400 flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 bg-secondary rounded-full" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  205, Gauri Ganesh Appartment UTKARSH NAGAR,
                  <br />
                  KT NAGAR GARDEN,behind Cake Link,
                  <br />
                  Katol Road, Nagpur, Maharashtra 440013
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 848 403 0070</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info.swayog@gmail.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <FreeQuoteModal>
                <button className="w-full py-3 px-6 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors">
                  Request Free Quote
                </button>
              </FreeQuoteModal>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Swayog Eneregy Private limited  . All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
