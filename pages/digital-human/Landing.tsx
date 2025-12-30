import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { AppModule } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { DH_TEXT_CONTENT } from './constants';

const BG_VIDEO_URL = "https://res.cloudinary.com/djmxoehe9/video/upload/v1765817364/12%E6%9C%8816%E6%97%A5_1_u5zzwh.mp4";

const FEATURE_VIDEOS: Record<string, string> = {
  [AppModule.DH_AUDIO]: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/shexiangji_cnko5j.mp4",
  [AppModule.DH_CHAT]: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/plant_pwucfi.mp4",
  // Updated video for Avatar
  [AppModule.DH_AVATAR]: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/macphone_rbh44x.mp4", 
  [AppModule.DH_3D]: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/littlegirl_gzwaui.mp4",
};

// --- Isolated Typewriter Component ---
interface TypewriterProps {
  phrases: string[];
}

const Typewriter = memo(({ phrases }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex % phrases.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        setTypingSpeed(100 + Math.random() * 50);
      }, typingSpeed);
    }

    if (!isDeleting && displayText === currentPhrase) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50);
      }, 3000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex(prev => prev + 1);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed, phrases]);

  return (
    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-normal text-center tracking-[0.1em] md:tracking-[0.2em] leading-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] min-h-[1.2em] px-4">
      {displayText}
      <span className="ml-1 animate-[blink_1s_step-end_infinite]">_</span>
    </h1>
  );
});

interface FeatureCardProps {
  id: AppModule;
  title: string;
  videoUrl: string;
  style: React.CSSProperties;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({ 
  title, 
  videoUrl,
  style,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        if (isHovered) {
            video.play().catch(() => {});
        } else {
            video.pause();
            video.currentTime = 0; // Reset to start frame
        }
    }
  }, [isHovered]);

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        boxShadow: isHovered 
          ? '0 0 60px rgba(59,130,246,0.3)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}
      className={`absolute w-64 h-96 cursor-pointer group origin-center will-change-transform rounded-[2rem] bg-[#050505] border transition-all duration-500 overflow-hidden
        ${isHovered ? 'animate-border-pulse border-white/60' : 'border-white/10'}
      `}
    >
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
           <video 
             ref={videoRef}
             src={videoUrl}
             muted
             loop
             playsInline
             className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-90 scale-110' : 'opacity-60 scale-100 grayscale-[30%]'}`}
           />
           {/* Gradient Overlay for Text Readability */}
           <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-60'}`} />
        </div>

        <div className="relative z-10 h-full w-full flex flex-col items-center justify-end pb-12 select-none">
            <div className="relative z-20 flex flex-col items-center">
              <span className={`text-xl font-bold text-white tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-center px-4 mb-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                {title}
              </span>
              <div className={`h-0.5 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500 ${isHovered ? 'w-16 opacity-100' : 'w-0 opacity-0'}`} />
            </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 mix-blend-overlay" />
    </div>
  );
});

interface LandingProps {
  onSelectModule: (module: AppModule) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelectModule }) => {
  const { lang } = useLanguage();
  
  const [deckScale, setDeckScale] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Internal animation state for transition
  const [animData, setAnimData] = useState<{
    module: AppModule;
    rect: DOMRect;
    title: string;
  } | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const t_dh = (DH_TEXT_CONTENT as any)[lang] || DH_TEXT_CONTENT.CN;

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const baseWidth = 1536; 
        const baseHeight = 864;
        // Allow scaling down more aggressively for mobile (0.35 min)
        const widthScale = Math.min(1, Math.max(0.35, window.innerWidth / baseWidth));
        const heightScale = Math.min(1, Math.max(0.35, window.innerHeight / baseHeight));
        setDeckScale(Math.min(widthScale, heightScale));
      }, 50);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, []);

  const handleModuleSelect = (module: AppModule, title: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnimData({ module, rect, title });

    setTimeout(() => {
      setIsExpanding(true);
    }, 10);

    setTimeout(() => {
      onSelectModule(module);
    }, 500); // Matches transition duration
  };

  const CARD_SPACING = 200; 
  const PUSH_DISTANCE = 240; 
  const CENTER_INDEX = 1.5; 

  const getCardStyle = (index: number) => {
    const relativeIndex = index - CENTER_INDEX;
    const baseX = relativeIndex * CARD_SPACING;
    const baseRotate = relativeIndex * 4; 

    const isHovered = index === hoveredIndex;
    const isIdle = hoveredIndex === null;
    
    let transform = '';
    let zIndex = 10;
    let opacity = 1;
    let filter = 'blur(0px)';
    
    if (isIdle) {
      transform = `translateX(${baseX}px) rotate(${baseRotate}deg) scale(0.9)`;
      zIndex = 10 + index; 
    } else if (isHovered) {
      transform = `translateX(${baseX}px) rotate(0deg) scale(1.1) translateY(-40px)`;
      zIndex = 50;
      opacity = 1;
    } else {
      const isLeft = index < hoveredIndex;
      const pushDir = isLeft ? -1 : 1;
      const targetX = baseX + (pushDir * PUSH_DISTANCE);
      const targetRotate = baseRotate + (pushDir * 8); 
      
      transform = `translateX(${targetX}px) rotate(${targetRotate}deg) scale(0.85)`;
      zIndex = 40 - Math.abs(index - hoveredIndex); 
      opacity = 0.4;
      filter = 'blur(3px) brightness(0.5)'; 
    }

    return { transform, zIndex, opacity, filter, transition: 'all 800ms cubic-bezier(0.2, 1, 0.2, 1)' };
  };

  const featureList: { 
    id: AppModule; 
    title: string; 
    videoUrl: string;
  }[] = [
    { 
      id: AppModule.DH_AUDIO, 
      title: t_dh.features[0], 
      videoUrl: FEATURE_VIDEOS[AppModule.DH_AUDIO]
    },
    { 
      id: AppModule.DH_CHAT, 
      title: t_dh.features[1], 
      videoUrl: FEATURE_VIDEOS[AppModule.DH_CHAT]
    },
    { 
      id: AppModule.DH_AVATAR, 
      title: t_dh.features[2], 
      videoUrl: FEATURE_VIDEOS[AppModule.DH_AVATAR]
    },
    { 
      id: AppModule.DH_3D, 
      title: t_dh.features[3], 
      videoUrl: FEATURE_VIDEOS[AppModule.DH_3D]
    },
  ];

  const typewriterPhrases = useMemo(() => [
    t_dh.heroTitle,
    "Make Cars Smarter",
    "重新定义美学创造"
  ], [t_dh.heroTitle]);

  return (
    <main className="w-full h-full flex flex-col items-center relative overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          src={BG_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100" 
        />
        {/* Lighter overlay for less "black" feel - Adjusted to black/20 */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0px]" />
        {/* Subtle Gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Hero Text Section: Adjusted spacing to prevent overlapping cards */}
      <div className="flex flex-col items-center justify-center pt-[12vh] md:pt-[18vh] z-20 pointer-events-none transition-all duration-500 w-full px-4 sm:px-0">
          <div className="flex items-center justify-center min-h-[3rem] sm:min-h-[4rem] md:min-h-[7rem] lg:min-h-[9rem]">
             <Typewriter phrases={typewriterPhrases} />
          </div>
          {/* Subtitle: Bigger, Glowing, Responsive */}
          <p className="text-white text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold mt-4 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            {t_dh.heroSubtitle}
          </p>
      </div>

      {/* Cards Section: Relative positioning with flexible space to avoid occlusion */}
      <div className={`relative flex-1 w-full flex items-center justify-center max-w-[1920px] perspective-1000 z-10 transition-opacity duration-300 pb-8 md:pb-0 ${animData ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="relative h-[350px] sm:h-[400px] md:h-[500px] w-full flex justify-center items-center" style={{ transform: `scale(${deckScale})`, transformOrigin: 'center center' }}>
           {featureList.map((feature, index) => (
              <FeatureCard 
                key={feature.id}
                title={feature.title}
                videoUrl={feature.videoUrl}
                style={getCardStyle(index)}
                isHovered={hoveredIndex === index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => handleModuleSelect(feature.id, feature.title, e)}
              />
           ))}
         </div>
      </div>

      {/* Transition Overlay */}
      {animData && (
        <div 
          className="fixed z-[100] bg-[#191919]/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
          style={{
            top: isExpanding ? 0 : animData.rect.top,
            left: isExpanding ? 0 : animData.rect.left,
            width: isExpanding ? '100vw' : animData.rect.width,
            height: isExpanding ? '100vh' : animData.rect.height,
            borderRadius: isExpanding ? 0 : '2rem', 
            transition: 'all 500ms cubic-bezier(0.2, 0, 0.2, 1)', 
          }}
        >
           <div className="w-full h-full flex items-center justify-center bg-black/20">
              <div className={`flex flex-col items-center gap-4 transition-all duration-300 ${isExpanding ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-spark-accent animate-spin" />
                <span className="text-white font-bold uppercase tracking-[0.3em]">{animData.title}</span>
              </div>
           </div>
        </div>
      )}
    </main>
  );
};

export default Landing;