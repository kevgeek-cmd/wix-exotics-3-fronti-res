"use client";

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
}

interface VideoSectionProps {
  videos: Video[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  if (videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = "";
    try {
      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1].split("?")[0];
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1].split("?")[0];
      }
    } catch (e) {
      console.error("Error parsing YouTube URL:", url, e);
      return null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <section className="py-16 bg-gray-50 rounded-3xl mx-4 md:mx-8 mb-16 border border-gray-100 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Nos Vidéos</h2>
          <div className="w-24 h-1.5 bg-green-600 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => {
            const embedUrl = getEmbedUrl(video.youtubeUrl);
            if (!embedUrl) return null;

            return (
              <div key={video.id} className="space-y-6 group">
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500 bg-black">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 group-hover:text-green-600 transition-colors px-4">{video.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
