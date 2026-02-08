"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Save, RefreshCw, Layout, Image as ImageIcon, List } from "lucide-react";

interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    imageUrl: string;
  };
  categories: {
    limit: number;
  };
}

export default function AdminDashboard() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data);
    } catch {
      console.error("Failed to fetch config");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setMessage("Configuration enregistrée avec succès !");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Erreur lors de l'enregistrement.");
      }
    } catch {
      setMessage("Erreur de connexion.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-green-600 h-12 w-12" />
      </div>
    );
  }

  if (!config) return <div>Erreur de chargement.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes("succès") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
              {message}
            </div>
          )}

          <div className="grid gap-8">
            {/* Hero Section Config */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Layout className="text-green-600 h-6 w-6" />
                <h2 className="text-xl font-bold">Configuration de la Bannière (Hero)</h2>
              </div>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre (Badge)</label>
                  <input
                    type="text"
                    value={config.hero.subtitle}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte du Bouton</label>
                    <input
                      type="text"
                      value={config.hero.buttonText}
                      onChange={(e) => setConfig({ ...config, hero: { ...config.hero, buttonText: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de l&apos;Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={config.hero.imageUrl}
                        onChange={(e) => setConfig({ ...config, hero: { ...config.hero, imageUrl: e.target.value } })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden relative">
                        <Image src={config.hero.imageUrl} alt="preview" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Categories Section Config */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <List className="text-green-600 h-6 w-6" />
                <h2 className="text-xl font-bold">Configuration des Catégories</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de catégories à afficher sur l&apos;accueil</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={config.categories.limit}
                  onChange={(e) => setConfig({ ...config, categories: { ...config.categories, limit: parseInt(e.target.value) || 1 } })}
                  className="w-full max-w-[200px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Les autres catégories seront accessibles via le bouton &quot;Voir toutes nos catégories&quot;.
                </p>
              </div>
            </section>

            <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
              <ImageIcon className="h-5 w-5" />
              <p className="text-sm">
                <strong>Astuce :</strong> Vous pouvez utiliser des URLs d&apos;images provenant d&apos;Unsplash pour la bannière.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
