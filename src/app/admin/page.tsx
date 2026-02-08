"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Save, RefreshCw, Layout, Image as ImageIcon, List, Mail, Phone, MapPin, Megaphone, Video, BookOpen, Plus, Trash2 } from "lucide-react";

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
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
  promos: {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    active: boolean;
  }[];
  videos: {
    id: string;
    title: string;
    youtubeUrl: string;
  }[];
  blog: {
    enabled: boolean;
    title: string;
    subtitle: string;
  };
}

export default function AdminDashboard() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchConfig();
  }, []);

  const addPromo = () => {
    if (!config) return;
    const newPromo = {
      id: Date.now().toString(),
      title: "Nouvelle Promo",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      link: "/",
      active: true,
    };
    setConfig({ ...config, promos: [...config.promos, newPromo] });
  };

  const removePromo = (id: string) => {
    if (!config) return;
    setConfig({ ...config, promos: config.promos.filter(p => p.id !== id) });
  };

  const addVideo = () => {
    if (!config) return;
    const newVideo = {
      id: Date.now().toString(),
      title: "Nouvelle Vidéo",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    };
    setConfig({ ...config, videos: [...config.videos, newVideo] });
  };

  const removeVideo = (id: string) => {
    if (!config) return;
    setConfig({ ...config, videos: config.videos.filter(v => v.id !== id) });
  };

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

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "general" ? "bg-green-600 text-white" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <Layout className="h-4 w-4" /> Accueil
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "contact" ? "bg-green-600 text-white" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <Mail className="h-4 w-4" /> Contact
            </button>
            <button
              onClick={() => setActiveTab("promos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "promos" ? "bg-green-600 text-white" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <Megaphone className="h-4 w-4" /> Promos
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "videos" ? "bg-green-600 text-white" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <Video className="h-4 w-4" /> Vidéos
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "blog" ? "bg-green-600 text-white" : "hover:bg-gray-50 text-gray-600"}`}
            >
              <BookOpen className="h-4 w-4" /> Blog
            </button>
          </div>

          <div className="grid gap-8">
            {/* General Tab */}
            {activeTab === "general" && (
              <>
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
                  </div>
                </section>
              </>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <Mail className="text-green-600 h-6 w-6" />
                  <h2 className="text-xl font-bold">Informations de Contact</h2>
                </div>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                    <input
                      type="email"
                      value={config.contact.email}
                      onChange={(e) => setConfig({ ...config, contact: { ...config.contact, email: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Phone className="w-4 h-4" /> Téléphone</label>
                    <input
                      type="text"
                      value={config.contact.phone}
                      onChange={(e) => setConfig({ ...config, contact: { ...config.contact, phone: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Adresse</label>
                    <input
                      type="text"
                      value={config.contact.address}
                      onChange={(e) => setConfig({ ...config, contact: { ...config.contact, address: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Embed Google Maps</label>
                    <input
                      type="text"
                      value={config.contact.mapUrl}
                      onChange={(e) => setConfig({ ...config, contact: { ...config.contact, mapUrl: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Promos Tab */}
            {activeTab === "promos" && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Megaphone className="text-green-600 h-6 w-6" />
                    <h2 className="text-xl font-bold">Bannières Promotionnelles</h2>
                  </div>
                  <button
                    onClick={addPromo}
                    className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                </div>
                <div className="grid gap-6">
                  {config.promos.map((promo, index) => (
                    <div key={promo.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                      <button
                        onClick={() => removePromo(promo.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la promo</label>
                            <input
                              type="text"
                              value={promo.title}
                              onChange={(e) => {
                                const newPromos = [...config.promos];
                                newPromos[index].title = e.target.value;
                                setConfig({ ...config, promos: newPromos });
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lien de redirection</label>
                            <input
                              type="text"
                              value={promo.link}
                              onChange={(e) => {
                                const newPromos = [...config.promos];
                                newPromos[index].link = e.target.value;
                                setConfig({ ...config, promos: newPromos });
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL Image Promo</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promo.imageUrl}
                              onChange={(e) => {
                                const newPromos = [...config.promos];
                                newPromos[index].imageUrl = e.target.value;
                                setConfig({ ...config, promos: newPromos });
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 overflow-hidden relative">
                              <Image src={promo.imageUrl} alt="preview" fill className="object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Video className="text-green-600 h-6 w-6" />
                    <h2 className="text-xl font-bold">Vidéos YouTube</h2>
                  </div>
                  <button
                    onClick={addVideo}
                    className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-all"
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                </div>
                <div className="grid gap-6">
                  {config.videos.map((video, index) => (
                    <div key={video.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la vidéo</label>
                          <input
                            type="text"
                            value={video.title}
                            onChange={(e) => {
                              const newVideos = [...config.videos];
                              newVideos[index].title = e.target.value;
                              setConfig({ ...config, videos: newVideos });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL YouTube</label>
                          <input
                            type="text"
                            value={video.youtubeUrl}
                            onChange={(e) => {
                              const newVideos = [...config.videos];
                              newVideos[index].youtubeUrl = e.target.value;
                              setConfig({ ...config, videos: newVideos });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Blog Tab */}
            {activeTab === "blog" && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <BookOpen className="text-green-600 h-6 w-6" />
                  <h2 className="text-xl font-bold">Configuration du Blog</h2>
                </div>
                <div className="grid gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blogEnabled"
                      checked={config.blog.enabled}
                      onChange={(e) => setConfig({ ...config, blog: { ...config.blog, enabled: e.target.checked } })}
                      className="w-5 h-5 accent-green-600"
                    />
                    <label htmlFor="blogEnabled" className="text-sm font-medium text-gray-700">Activer la section Blog sur l&apos;accueil</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la section Blog</label>
                    <input
                      type="text"
                      value={config.blog.title}
                      onChange={(e) => setConfig({ ...config, blog: { ...config.blog, title: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre de la section Blog</label>
                    <input
                      type="text"
                      value={config.blog.subtitle}
                      onChange={(e) => setConfig({ ...config, blog: { ...config.blog, subtitle: e.target.value } })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </section>
            )}

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
