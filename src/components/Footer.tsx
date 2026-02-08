import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

interface FooterProps {
  config: {
    footer: {
      description: string;
      socials: {
        facebook: string;
        twitter: string;
        instagram: string;
        youtube: string;
      };
      copyright: string;
    };
    contact: {
      phone: string;
      email: string;
      address: string;
    };
  };
}

const Footer = ({ config }: FooterProps) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-green-600 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-2xl font-bold uppercase tracking-wider">Wix Exotics</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {config.footer.description}
            </p>
            <div className="flex gap-4">
              {config.footer.socials.facebook && (
                <a href={config.footer.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {config.footer.socials.instagram && (
                <a href={config.footer.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.footer.socials.twitter && (
                <a href={config.footer.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {config.footer.socials.youtube && (
                <a href={config.footer.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Nos Magasins
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-green-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-green-500 transition-colors">Boutique</Link></li>
              <li><Link href="/blog" className="hover:text-green-500 transition-colors">Actualités</Link></li>
              <li><Link href="/contact" className="hover:text-green-500 transition-colors">Infos Livraison</Link></li>
              <li><Link href="/contact" className="hover:text-green-500 transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/contact" className="hover:text-green-500 transition-colors">Termes & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Catégories
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-green-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/categories" className="hover:text-green-500 transition-colors">Fruits & Légumes</Link></li>
              <li><Link href="/categories" className="hover:text-green-500 transition-colors">Produits Exotiques</Link></li>
              <li><Link href="/categories" className="hover:text-green-500 transition-colors">Épicerie Fine</Link></li>
              <li><Link href="/categories" className="hover:text-green-500 transition-colors">Boissons</Link></li>
              <li><Link href="/categories" className="hover:text-green-500 transition-colors">Promotions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-green-600 rounded-full"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>{config.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>{config.contact.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400 group">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-green-600 transition-colors mt-1">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>{config.contact.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {config.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-gray-600 hover:text-green-500 text-xs transition-colors italic">
              Administration
            </Link>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">VISA</div>
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">MASTERCARD</div>
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
