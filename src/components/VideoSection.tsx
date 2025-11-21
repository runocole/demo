interface VideoSectionProps {
  videoUrl: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export const VideoSection = ({ 
  videoUrl, 
  title = "YouTube video player",
  autoPlay = true,
  muted = true,
  loop = true
}: VideoSectionProps) => {
  return (
    <section className="py-10 bg-white">
      <div className="w-full">
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`${videoUrl}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};