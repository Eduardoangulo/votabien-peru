import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SimpleAudioPlayerProps {
  audioId?: string; // Ya no es estrictamente necesario con useRef, pero lo dejo opcional
  audioUrl: string;
}

export default function SimpleAudioPlayer({
  audioUrl,
}: SimpleAudioPlayerProps) {
  // Usamos useRef para tener una referencia directa al elemento DOM del audio
  // Esto es mucho más seguro que document.getElementById
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Efecto para controlar el play/pause basado en el estado isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((e) => console.error("Error al reproducir:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // --- MANEJADORES DE EVENTOS ---

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // LA CLAVE: Verificar que no sea NaN Y que no sea Infinity
    if (
      audio.duration &&
      !isNaN(audio.duration) &&
      audio.duration !== Infinity
    ) {
      setDuration(audio.duration);
    }
  };

  // A veces la duración cambia después de cargar (común en MP3)
  const handleDurationChange = () => {
    const audio = audioRef.current;
    if (
      audio &&
      audio.duration &&
      !isNaN(audio.duration) &&
      audio.duration !== Infinity
    ) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0); // Opcional: reiniciar al final
  };

  // --- CONTROLES DE USUARIO ---

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const prevVolume = volume || 0.5;
      audio.volume = prevVolume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-4 border border-border/50">
      {/* Audio oculto con eventos vinculados DIRECTAMENTE en el JSX.
         Esto asegura que React capture los eventos sin necesidad de addEventListener manual.
      */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        className="hidden"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange} // Importante para MP3
        onEnded={handleEnded}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-row items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-md">
            <Volume2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Resumen en audio</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Playback speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium gap-1"
                >
                  <span className="hidden sm:inline text-muted-foreground">
                    Velocidad:
                  </span>
                  <span className="font-semibold">{playbackRate}x</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={`cursor-pointer ${rate === playbackRate ? "bg-accent" : ""}`}
                  >
                    <span className="font-medium">{rate}x</span>
                    {rate === 1 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Normal)
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Volume control */}
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-6 w-6 hover:bg-transparent"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <div className="hidden sm:flex items-center h-6">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Escucha el contenido analizando propuestas en seguridad ciudadana,
          minería ilegal, salud, economía y educación.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-row items-center gap-3">
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            className="h-9 w-9 flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              // Evitamos que max sea 0 o NaN
              max={duration > 0 ? duration : 100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="cursor-pointer"
              // Deshabilitar slider si no hay duración cargada
              disabled={duration === 0}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-12">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
