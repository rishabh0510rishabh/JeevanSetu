import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  title?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Take Emergency Photo',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (isOpen && !capturedPreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedPreview]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Unable to access camera. You can upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCapturedPreview(result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-capture-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg clay-card p-5 sm:p-6 text-slate-800 relative flex flex-col max-h-[95vh] border border-red-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="clay-btn bg-white hover:bg-slate-100 p-1.5 rounded-xl text-slate-500 hover:text-slate-800 cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Preview Container */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner flex items-center justify-center">
          {capturedPreview ? (
            <img
              src={capturedPreview}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          ) : cameraError ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-xs sm:text-sm text-slate-200 font-medium">{cameraError}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="clay-btn bg-white text-slate-800 px-4 py-2 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload From Device</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-red-400/40 rounded-2xl pointer-events-none" />
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {capturedPreview ? (
            <>
              <button
                onClick={handleRetake}
                className="clay-btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleConfirm}
                className="clay-btn-emerald flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black cursor-pointer shadow-emerald-500/30"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="clay-btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-bold cursor-pointer"
                title="Upload image from gallery"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <button
                onClick={handleSnap}
                disabled={!!cameraError}
                className="clay-btn-red flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black disabled:opacity-50 cursor-pointer shadow-red-500/30"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Snapshot</span>
              </button>

              <button
                onClick={toggleFacingMode}
                className="clay-btn bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 p-3 text-xs font-bold cursor-pointer"
                title="Switch Camera (Front/Rear)"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
