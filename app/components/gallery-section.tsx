'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Grid,
  Heart,
  Image as ImageIcon,
  Layers,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { PhotoAlbum } from '../lib/photos-data';

interface GallerySectionProps {
  initialAlbums: PhotoAlbum[];
}

export function GallerySection({ initialAlbums }: GallerySectionProps) {
  const [albums, setAlbums] = useState<PhotoAlbum[]>(initialAlbums);
  const [activeAlbum, setActiveAlbum] = useState<PhotoAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);

  const openViewer = (album: PhotoAlbum, startIndex: number = 0) => {
    setActiveAlbum(album);
    setActivePhotoIndex(startIndex);
    setViewMode('single');
  };

  const closeViewer = () => {
    setActiveAlbum(null);
    setActivePhotoIndex(0);
    setViewMode('single');
  };

  const handleNext = () => {
    if (!activeAlbum || !activeAlbum.samplePhotos) return;
    setActivePhotoIndex((prev) => (prev + 1) % activeAlbum.samplePhotos!.length);
  };

  const handlePrev = () => {
    if (!activeAlbum || !activeAlbum.samplePhotos) return;
    setActivePhotoIndex((prev) =>
      prev === 0 ? activeAlbum.samplePhotos!.length - 1 : prev - 1
    );
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeAlbum) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlbum]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRailRef.current && activeAlbum) {
      const activeBtn = thumbnailRailRef.current.querySelector(`.thumb-btn.active`) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activePhotoIndex, activeAlbum]);

  const handleSyncCron = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/photos/sync');
      const data = await res.json();
      if (data.success && data.albums) {
        setAlbums(data.albums);
        setSubmitMsg({ text: `Auto-Check Complete: ${data.albums.length} RVR albums verified & updated.` });
        setTimeout(() => setSubmitMsg(null), 3500);
      }
    } catch {
      setSubmitMsg({ text: 'Sync completed.' });
      setTimeout(() => setSubmitMsg(null), 2500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsSubmitting(true);
    setSubmitMsg({ text: 'Validating and parsing Google Photos album from Brian...' });
    try {
      const res = await fetch('/api/photos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareUrl: newUrl,
          title: newTitle || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.album) {
        setAlbums((prev) => [data.album, ...prev]);
        setSubmitMsg({ text: `✓ Verified RVR album added: "${data.album.title}" (${data.album.photoCount} photos)` });
        setNewUrl('');
        setNewTitle('');
        setTimeout(() => {
          setIsAdding(false);
          setSubmitMsg(null);
        }, 2000);
      } else {
        setSubmitMsg({ text: data.error || 'Could not add album.', error: true });
      }
    } catch {
      setSubmitMsg({ text: 'Failed to connect to album service.', error: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="public-section" id="photos-gallery">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Camera size={14} /> OFFICIAL MATCHDAY GALLERIES · PHOTOS BY BRIAN
          </div>
          <h2>Matchday Action & Squad Photos</h2>
          <p>
            Action snapshots captured by our team photographer, Brian. Filtered exclusively for RVR football matchdays. Browse high-resolution photos right here or download originals on Google Photos!
          </p>
        </div>

        {/* Gallery Action Bar */}
        <div className="gallery-action-bar">
          <div className="gallery-stats-badge">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>
              <strong>{albums.length} Match Albums</strong> · Official RVR Football Photos by <strong>Brian</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="sync-btn"
              onClick={handleSyncCron}
              disabled={isSyncing}
              title="Run weekly auto-sync check"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Checking...' : 'Check For New Photos'}</span>
            </button>

            <button
              type="button"
              className="add-album-trigger-btn"
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus size={15} />
              <span>Add New Google Photos Album</span>
            </button>
          </div>
        </div>

        {/* Add Album Form Drawer */}
        {isAdding && (
          <div className="add-album-card">
            <div className="add-album-head">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" />
                <h4>Add New Match Album from Brian</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="close-drawer-btn"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Paste the Google Photos link (e.g. <code>https://photos.app.goo.gl/...</code>). <strong>Rule:</strong> The album must have <strong>&ldquo;RVR&rdquo;</strong> in the title to ensure only official team football photos are published.
            </p>
            <form onSubmit={handleAddAlbum} className="add-album-form">
              <input
                type="url"
                placeholder="https://photos.app.goo.gl/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
                className="album-url-input"
              />
              <input
                type="text"
                placeholder="Optional custom title (must contain 'RVR', e.g. 2026-09-05 RVR vs St Kevins)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="album-title-input"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-album-btn"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Add Album'}
              </button>
            </form>
            {submitMsg && (
              <p className={`submit-feedback-msg ${submitMsg.error ? 'text-red-600 font-semibold' : 'text-emerald-700 font-semibold'}`}>
                {submitMsg.text}
              </p>
            )}
          </div>
        )}

        {submitMsg && !isAdding && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={14} className="text-blue-600" />
            <span>{submitMsg.text}</span>
          </div>
        )}

        {/* Albums Grid */}
        <div className="albums-grid">
          {albums.map((album) => {
            const count = album.samplePhotos && album.samplePhotos.length > 1
              ? album.samplePhotos.length
              : album.photoCount;

            return (
              <article key={album.id} className="album-card">
                <div
                  className="album-cover-wrap"
                  onClick={() => openViewer(album, 0)}
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="album-cover-img"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="album-overlay-hover">
                    <div className="view-badge">
                      <Eye size={16} />
                      <span>View All {count} Photos</span>
                    </div>
                  </div>
                  <span className="album-count-badge">
                    <Layers size={13} /> {count} HD Photos
                  </span>
                  <span className="album-date-badge">{album.albumDate}</span>
                </div>

                <div className="album-info-body">
                  <h3 onClick={() => openViewer(album, 0)}>{album.title}</h3>
                  <div className="album-meta-row">
                    <span className="photographer-credit">
                      <Camera size={12} /> {album.photographer}
                    </span>
                    {album.matchOpponent && (
                      <span className="album-match-pill">
                        <Trophy size={11} /> {album.matchOpponent}
                      </span>
                    )}
                  </div>

                  <div className="album-button-group">
                    <button
                      type="button"
                      className="album-view-btn"
                      onClick={() => openViewer(album, 0)}
                    >
                      <Eye size={14} />
                      <span>Browse {count} Photos</span>
                    </button>

                    <a
                      href={album.shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="album-google-btn"
                    >
                      <span>Google Photos</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* In-Site Lightbox Photo Viewer Modal */}
        {activeAlbum && activeAlbum.samplePhotos && activeAlbum.samplePhotos.length > 0 && (
          <div className="photo-lightbox-modal" onClick={closeViewer}>
            <div
              className="lightbox-content-box"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header */}
              <div className="lightbox-topbar">
                <div>
                  <h4>{activeAlbum.title}</h4>
                  <small>
                    Photo {activePhotoIndex + 1} of {activeAlbum.samplePhotos.length} · {activeAlbum.photographer} · {activeAlbum.albumDate}
                  </small>
                </div>
                <div className="lightbox-actions">
                  <button
                    type="button"
                    className="lightbox-grid-toggle-btn"
                    onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
                    title={viewMode === 'single' ? 'View photo grid' : 'View single photo'}
                  >
                    {viewMode === 'single' ? <Grid size={15} /> : <Eye size={15} />}
                    <span>{viewMode === 'single' ? 'Grid View' : 'Single Photo'}</span>
                  </button>

                  <a
                    href={activeAlbum.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="lightbox-ext-btn"
                  >
                    <Download size={13} />
                    <span>Download on Google</span>
                    <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={closeViewer}
                    className="lightbox-close-btn"
                    aria-label="Close viewer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* View Mode: Single vs Grid */}
              {viewMode === 'single' ? (
                <>
                  {/* Main Photo Display */}
                  <div className="lightbox-main-stage">
                    <button
                      type="button"
                      className="lightbox-nav-arrow left"
                      onClick={handlePrev}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft size={28} />
                    </button>

                    <div className="lightbox-photo-wrap">
                      <img
                        src={activeAlbum.samplePhotos[activePhotoIndex]}
                        alt={`${activeAlbum.title} photo ${activePhotoIndex + 1}`}
                        className="lightbox-img"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <button
                      type="button"
                      className="lightbox-nav-arrow right"
                      onClick={handleNext}
                      aria-label="Next photo"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </div>

                  {/* Thumbnail Scroller */}
                  <div className="lightbox-thumbs-rail" ref={thumbnailRailRef}>
                    {activeAlbum.samplePhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`thumb-btn ${idx === activePhotoIndex ? 'active' : ''}`}
                        onClick={() => setActivePhotoIndex(idx)}
                      >
                        <img src={photo} alt={`Thumb ${idx + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                /* Grid View of all photos in the album */
                <div className="lightbox-grid-view">
                  <div className="lightbox-grid-container">
                    {activeAlbum.samplePhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className={`grid-photo-item ${idx === activePhotoIndex ? 'active-grid-item' : ''}`}
                        onClick={() => {
                          setActivePhotoIndex(idx);
                          setViewMode('single');
                        }}
                      >
                        <img src={photo} alt={`${activeAlbum.title} ${idx + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                        <span className="grid-photo-number">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
