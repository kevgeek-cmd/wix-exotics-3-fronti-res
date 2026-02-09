import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { getConfig } from "@/lib/config";

export default async function ContactPage() {
  const siteConfig = await getConfig();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header config={siteConfig} />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-green-600 py-16 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-green-100 max-w-2xl mx-auto px-4">
            Une question sur nos produits ou sur votre commande ? Notre équipe est à votre écoute pour vous répondre dans les plus brefs délais.
          </p>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Coordonnées</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900 font-bold">{siteConfig.contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Téléphone</p>
                      <p className="text-gray-900 font-bold">{siteConfig.contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Adresse</p>
                      <p className="text-gray-900 font-bold leading-relaxed">
                        {siteConfig.contact.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Embed */}
                <div className="mt-12 rounded-xl overflow-hidden h-64 border border-gray-100">
                  <iframe
                    src={siteConfig.contact.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom Complet</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                      placeholder="Comment pouvons-nous vous aider ?"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                      placeholder="Votre message ici..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button className="w-full md:w-auto bg-green-600 text-white px-12 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                      Envoyer le message
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer config={siteConfig} />
    </div>
  );
}
