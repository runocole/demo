// VideoSection.tsx
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
    <section className="bg-white py-6"> {/* Added py-6 for spacing */}
      <div className="w-full">
        <iframe
          className="w-full h-[600px] rounded-lg shadow-md" /* Added rounded and shadow */
          src={`${videoUrl}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};