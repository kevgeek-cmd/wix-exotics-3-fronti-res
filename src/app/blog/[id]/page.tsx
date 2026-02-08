import Header from "@/components/Header";
import Footer from "@/components/Footer";
import siteConfigData from "@/data/siteConfig.json";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  link?: string;
}

interface SiteConfig {
  topBanner: { text: string; enabled: boolean; speed: number };
  blog: {
    enabled: boolean;
    title: string;
    subtitle: string;
    articles: Article[];
  };
  contact: { email: string; phone: string; address: string; mapUrl: string };
  footer: {
    description: string;
    socials: { facebook: string; twitter: string; instagram: string; youtube: string };
    copyright: string;
  };
}

const siteConfig = siteConfigData as SiteConfig;

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = siteConfig.blog.articles.find(a => a.id === id);

  if (!article || !siteConfig.blog.enabled) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header config={siteConfig} />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className="relative h-[60vh] min-h-[400px] w-full">
          <Image 
            src={article.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"} 
            alt={article.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 md:px-8 pb-16">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-bold transition-colors group"
              >
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl group-hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                Retour aux articles
              </Link>
              
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-6 text-white/80 mb-6 font-bold text-sm md:text-base">
                  <div className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-2xl text-white shadow-lg shadow-green-600/20">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    5 min de lecture
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl">
                    <User className="w-4 h-4 text-blue-400" />
                    Par Admin
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-2xl text-slate-600 font-medium leading-relaxed mb-12 border-l-4 border-green-600 pl-8 italic">
                    {article.excerpt}
                  </p>
                  
                  {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-slate-700 text-lg leading-loose mb-8">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags & Share */}
                <div className="mt-16 pt-12 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-slate-900">Partager :</span>
                    <div className="flex gap-2">
                      <button className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-12">
                {/* Search / Newsletter could go here */}
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">À propos du blog</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    Découvrez nos derniers articles sur la cuisine exotique, le bio et bien plus encore pour vous aider dans votre quotidien.
                  </p>
                  <Link 
                    href="/shop" 
                    className="block w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-slate-900/10"
                  >
                    Voir la boutique
                  </Link>
                </div>

                {/* Related Articles could go here */}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer config={siteConfig} />
    </div>
  );
}
