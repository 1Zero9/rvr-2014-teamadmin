'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Eye, Sparkles, X } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  category: 'matches' | 'tournaments' | 'training' | 'socials';
  date: string;
  caption: string;
  aspect: string;
  bgColor: string;
  accent: string;
}

const PHOTOS: Photo[] = [
  {
    id: '1',
    title: 'Saturday DDSL League Opener',
    category: 'matches',
    date: 'Rivervalley Park · Pitch 1',
    caption: 'Great team press and quick transition play in the second half under the September sun.',
    aspect: '3/2',
    bgColor: 'linear-gradient(135deg, #071a33 0%, #153c70 100%)',
    accent: '#3b82f6',
  },
  {
    id: '2',
    title: 'Fingal Cup Semi-Final Victory',
    category: 'tournaments',
    date: 'AUL Complex Dublin',
    caption: 'Squad celebrating after a hard-fought 2-1 victory to advance into the Cup Final.',
    aspect: '4/3',
    bgColor: 'linear-gradient(135deg, #063428 0%, #0d5f47 100%)',
    accent: '#10b981',
  },
  {
    id: '3',
    title: 'Tuesday Evening Agility & Shooting',
    category: 'training',
    date: 'Rivervalley Astro',
    caption: 'High intensity 1v1 finishing drills focusing on inside-curl strikes into the corner netting.',
    aspect: '1/1',
    bgColor: 'linear-gradient(135deg, #2b1a4a 0%, #4a287e 100%)',
    accent: '#8b5cf6',
  },
  {
    id: '4',
    title: 'End-of-Year Presentation & Awards',
    category: 'socials',
    date: 'Rivervalley Community Pavilion',
    caption: 'Celebrating our players’ commitment, respect, and incredible team progress throughout the season.',
    aspect: '3/2',
    bgColor: 'linear-gradient(135deg, #422006 0%, #78350f 100%)',
    accent: '#f59e0b',
  },
  {
    id: '5',
    title: 'Defensive Line Drill & High Press',
    category: 'training',
    date: 'Pitch 2 Training Area',
    caption: 'Working on compact defensive shape and triggering the midfield trap when opponents play wide.',
    aspect: '4/3',
    bgColor: 'linear-gradient(135deg, #0b2942 0%, #1a4971 100%)',
    accent: '#0ea5e9',
  },
  {
    id: '6',
    title: 'Swords Summer Blitz Trophy Lift',
    category: 'tournaments',
    date: 'ALSAA Sports Complex',
    caption: 'Undefeated blitz run against 6 local squads — proud day for Rivervalley Rangers AFC!',
    aspect: '3/2',
    bgColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accent: '#6366f1',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Moments' },
  { id: 'matches', label: 'Matchday Action' },
  { id: 'tournaments', label: 'Cups & Blitzes' },
  { id: 'training', label: 'Training Sessions' },
  { id: 'socials', label: 'Team Socials' },
];

export function GallerySection() {
  const [filter, setFilter] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  const filteredPhotos =
    filter === 'all'
      ? PHOTOS
      : PHOTOS.filter((p) => p.category === filter);

  return (
    <section className="public-section" id="photos">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Camera size={14} /> TEAM PHOTO GALLERY
          </div>
          <h2>Matchday Memories & Highlights</h2>
          <p>
            Action snapshots, tournament celebrations, training milestones, and squad camaraderie for RVR 2014.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-tab ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredPhotos.map((photo) => (
            <article
              key={photo.id}
              className="gallery-card"
              onClick={() => setActivePhoto(photo)}
            >
              <div
                className="gallery-image-box"
                style={{ background: photo.bgColor }}
              >
                <div className="gallery-badge-crest">
                  <Image
                    src="/rvr-white.png"
                    width={40}
                    height={40}
                    alt="RVR badge"
                  />
                </div>
                <div className="gallery-hover-overlay">
                  <Eye size={24} />
                  <span>View Details</span>
                </div>
              </div>

              <div className="gallery-card-content">
                <div className="gallery-card-top">
                  <span className="gallery-cat-tag">{photo.category}</span>
                  <small>{photo.date}</small>
                </div>
                <h3>{photo.title}</h3>
                <p>{photo.caption}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="modal-backdrop" onClick={() => setActivePhoto(null)}>
            <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gallery-modal-header">
                <div>
                  <span className="modal-tag">{activePhoto.date}</span>
                  <h3>{activePhoto.title}</h3>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setActivePhoto(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className="gallery-modal-preview"
                style={{ background: activePhoto.bgColor }}
              >
                <Image
                  src="/rvr-white.png"
                  width={90}
                  height={90}
                  alt="RVR Crest"
                  className="modal-crest-center"
                />
                <div className="preview-watermark">RVR 2014 SQUAD HIGHLIGHT</div>
              </div>

              <div className="gallery-modal-body">
                <p>{activePhoto.caption}</p>
                <div className="gallery-modal-footer">
                  <span>Rivervalley Rangers AFC · 2026/27 Season</span>
                  <button
                    type="button"
                    className="gallery-close-btn"
                    onClick={() => setActivePhoto(null)}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
