import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';
import { Button } from './Button';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  downloadName?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  downloadName
}) => {
  // Set initial zoom based on screen size - smaller for mobile
  const getInitialZoom = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 0.3 : 0.5; // 30% for mobile, 50% for desktop
    }
    return 0.5;
  };

  const [zoom, setZoom] = useState(getInitialZoom());
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(0.5);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(getInitialZoom());
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 0.6) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 0.6) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName || `${title.replace(/\s+/g, '_')}_preview.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleFullscreen = () => {
    window.open(imageUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-4 bg-black bg-opacity-50 text-white">
          <h2 className="text-sm sm:text-lg font-semibold truncate">{title}</h2>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Button
              onClick={handleZoomOut}
              variant="secondary"
              size="sm"
              icon={<ZoomOut className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Zoom Out</span>
            </Button>
            <Button
              onClick={handleZoomIn}
              variant="secondary"
              size="sm"
              icon={<ZoomIn className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Zoom In</span>
            </Button>
            <Button
              onClick={handleRotate}
              variant="secondary"
              size="sm"
              icon={<RotateCw className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Rotate</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              size="sm"
            >
              Reset
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              icon={<Download className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button
              onClick={handleFullscreen}
              variant="secondary"
              size="sm"
              icon={<Maximize2 className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Open in Tab</span>
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              icon={<X className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={title}
              className="max-w-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                cursor: zoom > 0.6 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              draggable={false}
            />
          </div>
        </div>

        {/* Footer with zoom info */}
        <div className="p-2 bg-black bg-opacity-50 text-white text-center text-xs sm:text-sm">
          <span className="block sm:inline">Zoom: {Math.round(zoom * 100)}%</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">Rotation: {rotation}°</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">
            {zoom > 0.6 ? 'Click and drag to pan' : 'Zoom in to enable panning'}
          </span>
        </div>
      </div>
    </div>
  );
};
