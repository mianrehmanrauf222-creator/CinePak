import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  X, 
  Lock, 
  Sparkles, 
  Check, 
  Info,
  Tv
} from 'lucide-react';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const { user, hasActiveSubscription, saveWatchProgress } = useAuth();
  const { openPaymentModal, packages } = useMovies();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('1080p FHD');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resumePrompt, setResumePrompt] = useState<number | null>(null);

  const isLocked = movie.isPremium && !hasActiveSubscription;

  // Check if user previously watched this movie to offer resume
  useEffect(() => {
    if (!user || !user.watchHistory) return;
    const previous = user.watchHistory.find((h) => h.movieId === movie.id);
    if (previous && previous.progressSeconds > 15 && previous.progressSeconds < previous.totalSeconds - 60) {
      setResumePrompt(previous.progressSeconds);
    }
  }, [user, movie.id]);

  // Handle controls auto-hide
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        skipTime(10);
      } else if (e.key === 'ArrowLeft') {
        skipTime(-10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen]);

  // Sync video time updates & save watch history every 5 seconds
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      setCurrentTime(cur);
      setDuration(dur);

      if (Math.floor(cur) % 5 === 0 && dur > 0) {
        saveWatchProgress(movie.id, cur, dur, movie.title, movie.posterUrl, movie.backdropUrl);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.8;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const resumeAt = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setResumePrompt(null);
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // If user doesn't have active subscription for a premium movie
  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full bg-[#121318] border border-amber-500/50 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-5 animate-in fade-in zoom-in-95">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl gold-gradient-bg flex items-center justify-center text-black mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
              VIP Premium Content
            </span>
            <h2 className="text-2xl font-black text-white font-['Cinzel',serif] mt-3">
              {movie.title}
            </h2>
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              This blockbuster movie requires an active CinePak subscription. Subscribe now starting at only <span className="text-amber-400 font-bold">PKR 199/month</span> to stream unlimited movies in HD & 4K.
            </p>
          </div>

          <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800 text-left text-xs space-y-1.5 text-neutral-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Full length movie in {movie.quality} with Dolby Surround</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Watch on TV, Laptop, Mobile & Tablet</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Supports JazzCash, Easypaisa, Cards & Raast</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                openPaymentModal(packages[1]);
              }}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Subscribe Now (PKR 299)
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setIsLoading(false);
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin shadow-lg" />
        </div>
      )}

      {/* Resume playback prompt banner */}
      {resumePrompt !== null && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-[#121318]/95 border border-amber-500/40 rounded-xl px-5 py-3 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-4">
          <div className="text-left">
            <p className="text-xs font-semibold text-white">
              Resume watching from <span className="text-amber-400 font-bold">{formatTime(resumePrompt)}</span>?
            </p>
            <p className="text-[10px] text-neutral-400">You previously watched part of this movie.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resumeAt(resumePrompt)}
              className="px-3 py-1 rounded-lg text-xs font-bold text-black gold-gradient-bg hover:brightness-110"
            >
              Resume
            </button>
            <button
              onClick={() => setResumePrompt(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Top Header Overlay */}
      <div 
        className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-400 transition-colors"
            title="Exit Player"
            aria-label="Exit Player"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white font-['Cinzel',serif] line-clamp-1">
              {movie.title}
            </h1>
            <p className="text-xs text-neutral-400">
              {movie.language} • {movie.releaseYear} • {selectedQuality}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/80 border border-neutral-700 text-xs text-amber-400 font-semibold">
            <Tv className="w-3.5 h-3.5" />
            CinePak Ultra Stream
          </span>
        </div>
      </div>

      {/* Bottom Controls HUD */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-20 space-y-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Timeline Slider */}
        <div className="relative group/timeline flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:h-2.5 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls: Play, Skip, Volume, Timestamps */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-2 sm:p-2.5 rounded-full gold-gradient-bg text-black hover:brightness-110 active:scale-95 transition-all shadow-md"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              aria-label="Play/Pause"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Rewind 10s (Left Arrow)"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Fast Forward 10s (Right Arrow)"
              aria-label="Fast forward 10 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 text-neutral-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                aria-label="Toggle Mute"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-xs text-neutral-400 font-mono pl-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Speed, Quality, Settings, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            
            {/* Playback speed buttons */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-900/80 px-2 py-1 rounded-lg border border-neutral-800 text-xs font-semibold">
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    playbackSpeed === speed ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Settings button */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
                title="Playback Settings"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Dropdown */}
              {showSettingsMenu && (
                <div className="absolute right-0 bottom-12 w-52 bg-[#121318] border border-neutral-800 rounded-xl p-3 shadow-2xl z-50 text-xs space-y-3">
                  <div>
                    <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block mb-1.5">
                      Quality
                    </span>
                    <div className="space-y-1">
                      {['4K UHD', '1080p FHD', '720p HD', '480p'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuality(q);
                            setShowSettingsMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded flex items-center justify-between ${
                            selectedQuality === q ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-2">
                    <span className="font-bold text-neutral-300 uppercase tracking-wider text-[10px] block mb-1.5">
                      Audio / Subtitles
                    </span>
                    <div className="text-[11px] text-neutral-400 space-y-1">
                      <p>Audio: <span className="text-white">{movie.language} (5.1 Dolby)</span></p>
                      <p>Subtitles: <span className="text-white">English [CC]</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
