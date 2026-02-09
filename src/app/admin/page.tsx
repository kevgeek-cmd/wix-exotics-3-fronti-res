"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, RefreshCw, Layout, Image as ImageIcon, List, Mail, Phone, 
  MapPin, Megaphone, Video, BookOpen, Plus, Trash2, LogOut, 
  Settings, Share2, Type, Globe, CheckCircle2, AlertCircle, 
  Menu as MenuIcon
} from "lucide-react";
import Image from "next/image";
import { SiteConfig } from "@/lib/siteConfig";

export default function AdminDashboard() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [status, setStatus] = useState<{ 
    vercel: { kv: boolean; blob: boolean; baseUrl: boolean; }; 
    wix: { clientId: boolean; };
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config");
        const data = await res.json();
        setConfig(data);
      } catch {
        showMsg("Erreur de chargement", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/admin/status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error(err);
      }
    };

    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      fetchConfig();
      fetchStatus();
    }
  }, [router]);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showMsg("Configuration enregistrée avec succès !", "success");
      } else {
        throw new Error();
      }
    } catch {
      showMsg("Erreur lors de l'enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      showMsg("Upload en cours...", "success");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        callback(data.url);
        showMsg("Image uploadée !", "success");
      } else {
        showMsg("Erreur d'upload", "error");
      }
    } catch {
      showMsg("Erreur d'upload", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-slate-500 font-medium">Chargement du CMS...</p>
        </div>
      </div>
    );
  }

  if (!config) return null;

  const tabs = [
    { id: "general", label: "Général", icon: Layout },
    { id: "header", label: "En-tête", icon: Type },
    { id: "promos", label: "Publicités", icon: Megaphone },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "footer", label: "Pied de page", icon: List },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">Exotics CMS</span>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800">
            {status && (
              <div className="px-4 mb-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Stockage Cloud</span>
                  <div className={`w-2 h-2 rounded-full ${status.vercel.kv ? 'bg-green-500' : 'bg-orange-500'}`} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Upload Images</span>
                  <div className={`w-2 h-2 rounded-full ${status.vercel.blob ? 'bg-green-500' : 'bg-orange-500'}`} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Base URL</span>
                  <div className={`w-2 h-2 rounded-full ${status.vercel.baseUrl ? 'bg-green-500' : 'bg-orange-500'}`} />
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black text-slate-800 capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {message.text && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-in fade-in slide-in-from-top-4 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {/* General Section */}
          {activeTab === "general" && (
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-green-600" />
                  Hero Banner (Accueil)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Titre Principal</label>
                      <input 
                        type="text" 
                        value={config.hero.title}
                        onChange={(e) => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Sous-titre (Badge)</label>
                      <input 
                        type="text" 
                        value={config.hero.subtitle}
                        onChange={(e) => setConfig({...config, hero: {...config.hero, subtitle: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Texte du bouton</label>
                      <input 
                        type="text" 
                        value={config.hero.buttonText}
                        onChange={(e) => setConfig({...config, hero: {...config.hero, buttonText: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Lien du bouton</label>
                      <input 
                        type="text" 
                        value={config.hero.link || "/shop"}
                        onChange={(e) => setConfig({...config, hero: {...config.hero, link: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="/shop ou https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Image de fond</label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={config.hero.imageUrl}
                          onChange={(e) => setConfig({...config, hero: {...config.hero, imageUrl: e.target.value}})}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                          placeholder="URL de l'image"
                        />
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                          <ImageIcon className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-bold text-slate-600">Upload</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => setConfig({...config, hero: {...config.hero, imageUrl: url}}))}
                          />
                        </label>
                      </div>
                      <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50">
                        {config.hero.imageUrl && (
                          <Image 
                            src={config.hero.imageUrl} 
                            alt="Preview" 
                            fill 
                            className={config.hero.imageFit === "contain" ? "object-contain" : "object-cover"}
                            style={{ objectPosition: config.hero.imagePosition }}
                          />
                        )}
                        {!config.hero.imageUrl && (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${(config.hero.overlayOpacity ?? 40) / 100})` }} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Ajustement</label>
                          <select 
                            value={config.hero.imageFit}
                            onChange={(e) => setConfig({...config, hero: {...config.hero, imageFit: e.target.value}})}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="cover">Remplir (Cover)</option>
                            <option value="contain">Entier (Contain)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Position</label>
                          <select 
                            value={config.hero.imagePosition}
                            onChange={(e) => setConfig({...config, hero: {...config.hero, imagePosition: e.target.value}})}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="center">Centre</option>
                            <option value="top">Haut</option>
                            <option value="bottom">Bas</option>
                            <option value="left">Gauche</option>
                            <option value="right">Droite</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Opacité Overlay ({config.hero.overlayOpacity ?? 40}%)</label>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={config.hero.overlayOpacity ?? 40}
                            onChange={(e) => setConfig({...config, hero: {...config.hero, overlayOpacity: parseInt(e.target.value)}})}
                            className="w-full accent-green-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Hauteur (px)</label>
                          <input 
                            type="number"
                            value={config.hero.height}
                            onChange={(e) => setConfig({...config, hero: {...config.hero, height: parseInt(e.target.value)}})}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Configuration Boutique
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de catégories à afficher sur l&apos;accueil</label>
                  <input 
                    type="number" 
                    value={config.categories.limit}
                    onChange={(e) => setConfig({...config, categories: {limit: parseInt(e.target.value)}})}
                    className="w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </section>
            </div>
          )}

          {/* Header Section */}
          {activeTab === "header" && (
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Logo du Site
                </h3>
                <div className="flex gap-4 items-start">
                  <div className="relative w-40 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    {config.header?.logoUrl ? (
                      <Image 
                        src={config.header.logoUrl} 
                        alt="Logo" 
                        fill 
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">Aucun logo</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2">
                       <input 
                         type="text"
                         value={config.header?.logoUrl || ""}
                         placeholder="URL du logo"
                         onChange={(e) => setConfig({
                           ...config, 
                           header: { ...(config.header || {}), logoUrl: e.target.value }
                         })}
                         className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                       />
                       <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                          <ImageIcon className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-bold text-slate-600">Upload</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => setConfig({
                              ...config, 
                              header: { ...(config.header || {}), logoUrl: url }
                            }))}
                          />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400">
                      Recommandé : Image PNG transparente, hauteur 50px environ.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-green-600" />
                    Bandeau Défilant (Haut de page)
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.topBanner.enabled}
                      onChange={(e) => setConfig({...config, topBanner: {...config.topBanner, enabled: e.target.checked}})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message à afficher</label>
                    <textarea 
                      value={config.topBanner.text}
                      onChange={(e) => setConfig({...config, topBanner: {...config.topBanner, text: e.target.value}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vitesse de défilement ({config.topBanner.speed})</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={config.topBanner.speed}
                      onChange={(e) => setConfig({...config, topBanner: {...config.topBanner, speed: parseInt(e.target.value)}})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                      <span>Lent</span>
                      <span>Rapide</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Promos Section */}
          {activeTab === "promos" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black">Gestion des Blocs de Publicité</h3>
                <button 
                  onClick={() => {
                    const newPromo = { id: Date.now().toString(), title: "Nouveau bloc", imageUrl: "", link: "/shop", active: true };
                    setConfig({...config, promos: [...config.promos, newPromo]});
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Ajouter un bloc
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.promos.map((promo, index) => (
                  <div key={promo.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100">
                        {promo.imageUrl && <Image src={promo.imageUrl} alt="Promo" fill className="object-cover" />}
                        {!promo.imageUrl && <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8" /></div>}
                      </div>
                      <button 
                        onClick={() => setConfig({...config, promos: config.promos.filter(p => p.id !== promo.id)})}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={promo.title}
                      placeholder="Titre de la pub"
                      onChange={(e) => {
                        const newPromos = [...config.promos];
                        newPromos[index].title = e.target.value;
                        setConfig({...config, promos: newPromos});
                      }}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={promo.imageUrl}
                        placeholder="URL de l'image"
                        onChange={(e) => {
                          const newPromos = [...config.promos];
                          newPromos[index].imageUrl = e.target.value;
                          setConfig({...config, promos: newPromos});
                        }}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <ImageIcon className="w-4 h-4 text-slate-600" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newPromos = [...config.promos];
                            newPromos[index].imageUrl = url;
                            setConfig({...config, promos: newPromos});
                          })}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="text" 
                        value={promo.link}
                        placeholder="Lien"
                        onChange={(e) => {
                          const newPromos = [...config.promos];
                          newPromos[index].link = e.target.value;
                          setConfig({...config, promos: newPromos});
                        }}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={promo.active}
                          onChange={(e) => {
                            const newPromos = [...config.promos];
                            newPromos[index].active = e.target.checked;
                            setConfig({...config, promos: newPromos});
                          }}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm font-bold text-slate-600">Actif</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {activeTab === "videos" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black">Vidéos YouTube</h3>
                <button 
                  onClick={() => {
                    const newVideo = { id: Date.now().toString(), title: "Nouvelle Vidéo", youtubeUrl: "" };
                    setConfig({...config, videos: [...config.videos, newVideo]});
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Ajouter une vidéo
                </button>
              </div>

              <div className="space-y-4">
                {config.videos.map((video, index) => (
                  <div key={video.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 w-full space-y-4">
                      <input 
                        type="text" 
                        value={video.title}
                        placeholder="Titre de la vidéo"
                        onChange={(e) => {
                          const newVideos = [...config.videos];
                          newVideos[index].title = e.target.value;
                          setConfig({...config, videos: newVideos});
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      />
                      <input 
                        type="text" 
                        value={video.youtubeUrl}
                        placeholder="URL YouTube (ex: https://youtube.com/watch?v=...)"
                        onChange={(e) => {
                          const newVideos = [...config.videos];
                          newVideos[index].youtubeUrl = e.target.value;
                          setConfig({...config, videos: newVideos});
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => setConfig({...config, videos: config.videos.filter(v => v.id !== video.id)})}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === "contact" && (
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-black mb-6">Informations de Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email de contact</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={config.contact.email}
                      onChange={(e) => setConfig({...config, contact: {...config.contact, email: e.target.value}})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={config.contact.phone}
                      onChange={(e) => setConfig({...config, contact: {...config.contact, phone: e.target.value}})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse Physique</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={config.contact.address}
                      onChange={(e) => setConfig({...config, contact: {...config.contact, address: e.target.value}})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Google Maps (Embed)</label>
                  <textarea 
                    value={config.contact.mapUrl}
                    onChange={(e) => setConfig({...config, contact: {...config.contact, mapUrl: e.target.value}})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 h-24"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Footer Section */}
          {activeTab === "footer" && (
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-black">Informations du Pied de Page</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description courte (À propos)</label>
                  <textarea 
                    value={config.footer.description}
                    onChange={(e) => setConfig({...config, footer: {...config.footer, description: e.target.value}})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Texte Copyright</label>
                  <input 
                    type="text" 
                    value={config.footer.copyright}
                    onChange={(e) => setConfig({...config, footer: {...config.footer, copyright: e.target.value}})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-600" />
                  Réseaux Sociaux (URLs)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Facebook</label>
                    <input 
                      type="text" 
                      value={config.footer.socials.facebook}
                      onChange={(e) => setConfig({...config, footer: {...config.footer, socials: {...config.footer.socials, facebook: e.target.value}}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Instagram</label>
                    <input 
                      type="text" 
                      value={config.footer.socials.instagram}
                      onChange={(e) => setConfig({...config, footer: {...config.footer, socials: {...config.footer.socials, instagram: e.target.value}}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Twitter / X</label>
                    <input 
                      type="text" 
                      value={config.footer.socials.twitter}
                      onChange={(e) => setConfig({...config, footer: {...config.footer, socials: {...config.footer.socials, twitter: e.target.value}}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">YouTube</label>
                    <input 
                      type="text" 
                      value={config.footer.socials.youtube}
                      onChange={(e) => setConfig({...config, footer: {...config.footer, socials: {...config.footer.socials, youtube: e.target.value}}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Blog Section */}
          {activeTab === "blog" && (
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black">Configuration du Blog</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.blog.enabled}
                      onChange={(e) => setConfig({...config, blog: {...config.blog, enabled: e.target.checked}})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Titre du Blog</label>
                    <input 
                      type="text" 
                      value={config.blog.title}
                      onChange={(e) => setConfig({...config, blog: {...config.blog, title: e.target.value}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sous-titre</label>
                    <input 
                      type="text" 
                      value={config.blog.subtitle}
                      onChange={(e) => setConfig({...config, blog: {...config.blog, subtitle: e.target.value}})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black">Articles du Blog</h3>
                <button 
                  onClick={() => {
                    const newArticle = { 
                      id: Date.now().toString(), 
                      title: "Nouvel Article", 
                      excerpt: "Extrait de l'article...", 
                      content: "", 
                      imageUrl: "", 
                      date: new Date().toISOString().split('T')[0] 
                    };
                    setConfig({...config, blog: {...config.blog, articles: [...config.blog.articles, newArticle]}});
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Ajouter un article
                </button>
              </div>

              <div className="space-y-6">
                {config.blog.articles.map((article, index) => (
                  <div key={article.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 space-y-4">
                        <input 
                          type="text" 
                          value={article.title}
                          placeholder="Titre de l'article"
                          onChange={(e) => {
                            const newArticles = [...config.blog.articles];
                            newArticles[index].title = e.target.value;
                            setConfig({...config, blog: {...config.blog, articles: newArticles}});
                          }}
                          className="w-full text-xl font-black px-0 py-2 border-b border-transparent focus:border-green-600 outline-none transition-all"
                        />
                        <textarea 
                          value={article.excerpt}
                          placeholder="Extrait court..."
                          onChange={(e) => {
                            const newArticles = [...config.blog.articles];
                            newArticles[index].excerpt = e.target.value;
                            setConfig({...config, blog: {...config.blog, articles: newArticles}});
                          }}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-20 text-sm"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newArticles = config.blog.articles.filter(a => a.id !== article.id);
                          setConfig({...config, blog: {...config.blog, articles: newArticles}});
                        }}
                        className="ml-6 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Image de l&apos;article</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={article.imageUrl}
                            onChange={(e) => {
                              const newArticles = [...config.blog.articles];
                              newArticles[index].imageUrl = e.target.value;
                              setConfig({...config, blog: {...config.blog, articles: newArticles}});
                            }}
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                            placeholder="URL de l'image"
                          />
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                            <ImageIcon className="w-4 h-4 text-slate-600" />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, (url) => {
                                const newArticles = [...config.blog.articles];
                                newArticles[index].imageUrl = url;
                                setConfig({...config, blog: {...config.blog, articles: newArticles}});
                              })}
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Date de publication</label>
                        <input 
                          type="date" 
                          value={article.date}
                          onChange={(e) => {
                            const newArticles = [...config.blog.articles];
                            newArticles[index].date = e.target.value;
                            setConfig({...config, blog: {...config.blog, articles: newArticles}});
                          }}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Lien de redirection (Optionnel)</label>
                        <input 
                          type="text" 
                          value={article.link || ""}
                          placeholder="Laisse vide pour l'article interne, ou mets un lien externe"
                          onChange={(e) => {
                            const newArticles = [...config.blog.articles];
                            newArticles[index].link = e.target.value;
                            setConfig({...config, blog: {...config.blog, articles: newArticles}});
                          }}
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Contenu de l&apos;article (Markdown supporté)</label>
                        <textarea 
                          value={article.content}
                          placeholder="Écrivez votre article ici..."
                          onChange={(e) => {
                            const newArticles = [...config.blog.articles];
                            newArticles[index].content = e.target.value;
                            setConfig({...config, blog: {...config.blog, articles: newArticles}});
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-48 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
