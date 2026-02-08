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
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Vidéos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video) => {
            const embedUrl = getEmbedUrl(video.youtubeUrl);
            if (!embedUrl) return null;

            return (
              <div key={video.id} className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800">{video.title}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
