import Link from "next/link";

const Footer = () => {
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
              <span className="text-2xl font-bold">EKOMART</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Nous vous aidons à économiser sur vos courses ! Nous sommes une épicerie en ligne de premier plan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Nos Magasins</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-green-500">Infos Livraison</a></li>
              <li><a href="#" className="hover:text-green-500">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-green-500">Termes & Conditions</a></li>
              <li>
                <Link href="/admin" className="text-gray-500 hover:text-green-500 text-xs mt-4 block italic">
                  Administration du site
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            Copyright 2024 © Ekomart. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
