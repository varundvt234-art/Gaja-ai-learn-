import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw, Check, AlertCircle, Sparkles, Smartphone, UploadCloud } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nativeInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [flashAnimation, setFlashAnimation] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      setStream(null);
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setIsInitializing(true);
    setErrorMsg(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Direct webcam access not supported in this environment.');
      }

      let mediaStream: MediaStream | null = null;

      // Attempt 1: with ideal facingMode
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
          },
          audio: false,
        });
      } catch (firstErr: any) {
        console.warn('FacingMode constraint failed, falling back to simple video: true', firstErr);
        // Attempt 2: minimal video constraint
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (!mediaStream) {
        throw new Error('Failed to acquire video stream from camera.');
      }

      setStream(mediaStream);
      setCameraActive(true);

      // Connect to video element if already mounted
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((playErr) => console.warn('Video play error:', playErr));
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera access was blocked by browser permissions. You can allow it in your address bar, or use the Native Camera button below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera hardware was detected on your device.');
      } else {
        setErrorMsg(err.message || 'Unable to start camera.');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Sync stream to video element whenever stream changes or video element mounts
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => console.warn('Auto play:', e));
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setErrorMsg(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Fallback safety timeout: if initializing takes longer than 4s, clear spinner
  useEffect(() => {
    if (!isOpen || !isInitializing) return;
    const timer = setTimeout(() => {
      if (isInitializing && !cameraActive) {
        setIsInitializing(false);
        setErrorMsg('Camera preview is taking longer than expected. Tap "Use Native Camera App" below.');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, isInitializing, cameraActive]);

  const handleCapture = () => {
    if (!videoRef.current) return;

    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  // Handle native device camera capture (always works on all mobile & desktop browsers)
  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        onCapture(base64, file.type || 'image/jpeg');
        onClose();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage, 'image/jpeg');
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Hidden native camera input fallback */}
      <input
        ref={nativeInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeFileChange}
        className="hidden"
      />

      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Take a Photo</h3>
              <p className="text-[11px] text-slate-400">Capture any flower, leaf, organ, circuit, or object</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative w-full aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {flashAnimation && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-out fade-out duration-200" />
          )}

          {errorMsg ? (
            <div className="p-6 text-center max-w-sm flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-2.5" />
              <p className="text-white font-medium text-xs sm:text-sm mb-1">{errorMsg}</p>
              <p className="text-[11px] text-slate-400 mb-4">
                You can trigger your device camera app directly or retry permissions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
                <button
                  type="button"
                  onClick={() => nativeInputRef.current?.click()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open Device Camera App</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Retry Preview
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  setIsInitializing(false);
                  videoRef.current?.play().catch(() => {});
                }}
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Viewfinder Target Graphic */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="w-52 h-52 border-2 border-white/30 rounded-2xl relative">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>

              {isInitializing && (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white gap-2 z-20">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-300">Connecting to device camera...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
          {capturedImage ? (
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Analyze This Photo</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <button
                type="button"
                onClick={toggleCamera}
                title="Switch Camera (Front / Rear)"
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCapture}
                disabled={Boolean(errorMsg || isInitializing)}
                title="Capture Photo"
                className="w-16 h-16 rounded-full bg-white p-1 flex items-center justify-center hover:scale-105 active:scale-90 transition-all shadow-xl shadow-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="w-13 h-13 rounded-full border-2 border-slate-900 bg-amber-400 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-900" />
                </div>
              </button>

              {/* Native Camera App Direct Trigger Button */}
              <button
                type="button"
                onClick={() => nativeInputRef.current?.click()}
                title="Open Phone Camera App Directly"
                className="p-3 rounded-2xl bg-slate-800 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Camera App</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
