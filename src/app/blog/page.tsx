import Header from "@/components/Header";
import Footer from "@/components/Footer";
import siteConfigData from "@/data/siteConfig.json";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

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

export default function BlogPage() {
  const { blog } = siteConfig;

  if (!blog.enabled) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header config={siteConfig} />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Le blog est actuellement désactivé.</h1>
            <Link href="/" className="text-green-600 mt-4 inline-block hover:underline">Retour à l&apos;accueil</Link>
          </div>
        </main>
        <Footer config={siteConfig} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header config={siteConfig} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6 shadow-lg shadow-green-600/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {blog.title}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              {blog.subtitle}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-20 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blog.articles.map((article) => (
                <article 
                  key={article.id} 
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col"
                >
                  <Link href={article.link || `/blog/${article.id}`} className="relative h-64 overflow-hidden">
                    <Image 
                      src={article.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"} 
                      alt={article.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 text-slate-900 font-bold text-sm shadow-sm">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                      <Link href={article.link || `/blog/${article.id}`}>{article.title}</Link>
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-50">
                      <Link 
                        href={article.link || `/blog/${article.id}`} 
                        className="inline-flex items-center gap-2 text-green-600 font-black hover:gap-4 transition-all"
                      >
                        Lire la suite <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {blog.articles.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xl">Aucun article n&apos;a encore été publié.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer config={siteConfig} />
    </div>
  );
}
