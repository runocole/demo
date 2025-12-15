import { Sparkles } from 'lucide-react';

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Fresh Insights Weekly
          </div>

          {/* Title */}
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl" style={{ animationDelay: '100ms' }}>
            Discover Ideas That
            <span className="block text-gradient">Inspire & Transform</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-muted-foreground" style={{ animationDelay: '200ms' }}>
            Explore thoughtful articles on design, technology, and creativity. 
            Updated weekly with fresh perspectives and insights.
          </p>
        </div>
      </div>
    </section>
  );
}
