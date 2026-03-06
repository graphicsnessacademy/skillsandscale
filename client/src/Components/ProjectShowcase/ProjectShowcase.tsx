import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import axios from 'axios';
import './ProjectShowcase.css';

const ProjectShowcase = () => {
  const [projects, setProjects] = useState<{ position: number; image: string }[]>([]);
  const [sliderPos, setSliderPos] = useState(50);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } catch {
        console.error("Error loading projects");
      }
    };
    fetchProjects();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateIn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // --- PARALLAX FOR CARDS 2-5 ---
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--card-x', x.toString());
    card.style.setProperty('--card-y', y.toString());
  };

  // --- MOUSE MOVEMENT SLIDER FOR CARD 1 ---
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--card-x', '0.5');
    card.style.setProperty('--card-y', '0.5');
  };

  const getImg = (pos: number) => {
    const p = projects.find(item => item.position === pos);
    return p ? p.image : "https://via.placeholder.com/800"; // Changed p.imageUrl to p.image
  };
  return (
    <section className="showcase-bento-section" ref={sectionRef}>

      {/* LIGHTBOX PREVIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <button onClick={() => setSelectedImage(null)} className="absolute top-8 right-8 p-3 text-white hover:rotate-90 transition-all"><X size={32} /></button>
          <img src={selectedImage} alt="Full Preview" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" />
        </div>
      )}

      <div className="intro-section">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-hind-siliguri">আমাদের রিসেন্ট ডিজাইন</h2>
        <p className="mt-5 text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-noto-sans-bengali">আমরা আপনার ব্যবসাকে অনলাইনে তুলে ধরি।</p>
        <a href="#" className="cta-button-bento">View All Projects <ArrowRight size={16} /></a>
      </div>

      <div className="gallery-wrapper">
        <div className="gallery-container-bento">

          {/* Card 2 */}
          <div
            className={`work-card-bento card-2 ${animateIn ? 'animate-in' : ''}`}
            onMouseMove={handleCardMove} onMouseLeave={handleCardLeave}
            onClick={() => setSelectedImage(getImg(2))}
          >
            <div className="card-num-bento">2</div>
            <div className="img-wrapper-bento">
              <div className="img-layer-bento" style={{ backgroundImage: `url(${getImg(2)})` }}></div>
              <div className="preview-overlay"><Maximize2 size={24} /></div>
            </div>
          </div>

          {/* CARD 1 (BEFORE/AFTER SLIDER) */}
          <div
            className={`work-card-bento card-1 cursor-crosshair ${animateIn ? 'animate-in' : ''}`}
            onMouseMove={handleSliderMove}
            onClick={() => setSelectedImage(getImg(1))}
          >
            {/* Top Layer (After / Color) */}
            <div className="slider-after-bento" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <div className="img-layer-bento" style={{ backgroundImage: `url(${getImg(1)})` }}></div>
            </div>

            {/* Bottom Layer (Before / Grayscale) */}
            <div className="img-wrapper-bento">
              <div className="img-layer-bento grayscale" style={{ backgroundImage: `url(${getImg(1)})` }}></div>
              {/* Overlay remains so user knows it's clickable */}
              <div className="preview-overlay"><Maximize2 size={24} /></div>
            </div>

            {/* Handle Line */}
            <div className="slider-divider-bento" style={{ left: `${sliderPos}%` }}>
              <div className="slider-handle-bento">
                <ChevronLeft size={16} />
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`work-card-bento card-3 ${animateIn ? 'animate-in' : ''}`}
            onMouseMove={handleCardMove} onMouseLeave={handleCardLeave} onClick={() => setSelectedImage(getImg(3))}>
            <div className="card-num-bento">3</div>
            <div className="img-wrapper-bento">
              <div className="img-layer-bento" style={{ backgroundImage: `url(${getImg(3)})` }}></div>
              <div className="preview-overlay"><Maximize2 size={24} /></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className={`work-card-bento card-4 ${animateIn ? 'animate-in' : ''}`}
            onMouseMove={handleCardMove} onMouseLeave={handleCardLeave} onClick={() => setSelectedImage(getImg(4))}>
            <div className="card-num-bento">4</div>
            <div className="img-wrapper-bento">
              <div className="img-layer-bento" style={{ backgroundImage: `url(${getImg(4)})` }}></div>
              <div className="preview-overlay"><Maximize2 size={24} /></div>
            </div>
          </div>

          {/* Card 5 */}
          <div className={`work-card-bento card-5 ${animateIn ? 'animate-in' : ''}`}
            onMouseMove={handleCardMove} onMouseLeave={handleCardLeave} onClick={() => setSelectedImage(getImg(5))}>
            <div className="card-num-bento">5</div>
            <div className="img-wrapper-bento">
              <div className="img-layer-bento" style={{ backgroundImage: `url(${getImg(5)})` }}></div>
              <div className="preview-overlay"><Maximize2 size={24} /></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;