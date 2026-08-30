'use client';

import { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { FootballResource, YOUTUBE_FOOTBALL_RESOURCES } from '../lib/youtube-resources';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: '1v1', label: '⚡ 1v1 & Dribbling' },
  { id: 'mastery', label: '🔥 Ball Mastery' },
  { id: 'passing', label: '🎯 Passing & Touch' },
  { id: 'finishing', label: '💥 Striking & Finishing' },
  { id: 'defending', label: '🛡️ 1v1 Defending' },
  { id: 'speed_sc', label: '🚀 Speed & S&C' },
  { id: 'tactical', label: '🧠 Tactical IQ' },
];

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<FootballResource | null>(null);
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);

  // Load completed drills from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rvr_practiced_drills');
      if (saved) {
        setCompletedDrills(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleDrillPracticed = (drillId: string) => {
    setCompletedDrills((prev) => {
      const next = prev.includes(drillId)
        ? prev.filter((id) => id !== drillId)
        : [...prev, drillId];
      try {
        localStorage.setItem('rvr_practiced_drills', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const filteredResources = YOUTUBE_FOOTBALL_RESOURCES.filter((res) => {
    const matchesCategory = activeCategory === 'all' || res.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.focus.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="public-section" id="skills">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Sparkles size={14} /> FREE YOUTUBE FOOTBALL VAULT
          </div>
          <h2>Pro Drills & Skills Video Library</h2>
          <p>
            Master 1v1 moves, 1,000-touch routines, finishing technique, and match tactical habits with free step-by-step masterclasses from top global creators.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="skills-progress-card">
          <div className="flex items-center gap-3">
            <div className="trophy-badge">
              <Trophy size={22} className="text-amber-500" />
            </div>
            <div>
              <strong>Squad Practice Tracker: {completedDrills.length} / {YOUTUBE_FOOTBALL_RESOURCES.length} Drills Mastered</strong>
              <p className="text-xs text-slate-500">Track your home training progress and build muscle memory for matchday.</p>
            </div>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(completedDrills.length / YOUTUBE_FOOTBALL_RESOURCES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="skills-filter-controls">
          <div className="skills-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search drills, moves, techniques (e.g. Croqueta, Finishing, Scanning)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Resources Grid */}
        <div className="skills-grid">
          {filteredResources.map((item) => {
            const isDone = completedDrills.includes(item.id);
            return (
              <div
                key={item.id}
                className={`skill-card ${isDone ? 'is-completed' : ''}`}
                onClick={() => setSelectedResource(item)}
              >
                <div className="skill-card-media">
                  {/* YouTube Thumbnail Preview */}
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.title}
                    className="skill-thumb-img"
                    loading="lazy"
                  />
                  <div className="play-overlay">
                    <div className="play-circle">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <span className="duration-pill">
                    <Clock size={11} /> {item.duration}
                  </span>
                  <span className="creator-badge">
                    <Video size={11} /> {item.creator}
                  </span>
                  {isDone && (
                    <span className="mastered-badge">
                      <CheckCircle2 size={12} /> Practiced
                    </span>
                  )}
                </div>

                <div className="skill-card-body">
                  <div className="skill-header-meta">
                    <span className={`diff-badge ${item.difficulty.toLowerCase()}`}>
                      {item.difficulty}
                    </span>
                    <span className="reps-tag">{item.reps}</span>
                  </div>

                  <h3>{item.title}</h3>
                  <p className="skill-desc">{item.description}</p>

                  <div className="skill-focus-box">
                    <Target size={13} className="text-blue-500 shrink-0" />
                    <span><strong>Focus:</strong> {item.focus}</span>
                  </div>

                  <div className="skill-card-foot">
                    <button
                      type="button"
                      className="watch-tutorial-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResource(item);
                      }}
                    >
                      <Play size={13} fill="currentColor" /> Watch Video Tutorial
                    </button>

                    <button
                      type="button"
                      className={`mark-done-icon-btn ${isDone ? 'done' : ''}`}
                      title={isDone ? 'Mark as not practiced' : 'Mark as practiced'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDrillPracticed(item.id);
                      }}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="empty-drills-state">
            <Video size={36} className="text-slate-400" />
            <h3>No drills match your filter</h3>
            <p>Try searching for a different skill or clear your category filter.</p>
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Selected Video Player Lightbox Modal */}
        {selectedResource && (
          <div
            className="video-modal-overlay"
            onClick={() => setSelectedResource(null)}
          >
            <div
              className="video-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="video-modal-header">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="creator-pill">
                      <Video size={12} /> {selectedResource.creator}
                    </span>
                    <span className={`diff-badge ${selectedResource.difficulty.toLowerCase()}`}>
                      {selectedResource.difficulty}
                    </span>
                    <span className="duration-pill-modal">
                      <Clock size={12} /> {selectedResource.duration}
                    </span>
                  </div>
                  <h3>{selectedResource.title}</h3>
                </div>
                <button
                  type="button"
                  className="close-modal-btn"
                  onClick={() => setSelectedResource(null)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* YouTube Embed Player */}
              <div className="video-frame-wrap">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedResource.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedResource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                />
              </div>

              {/* Coaching Cues & Target Reps */}
              <div className="video-modal-details">
                <div className="coaching-points-col">
                  <h4>
                    <Flame size={16} className="text-amber-500" />
                    Key Coaching Points & Technical Cues
                  </h4>
                  <ul className="points-list">
                    {selectedResource.coachingPoints.map((pt, i) => (
                      <li key={i}>
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="drill-meta-col">
                  <div className="meta-card">
                    <strong>Recommended Repetitions</strong>
                    <p>{selectedResource.reps}</p>
                  </div>
                  <div className="meta-card">
                    <strong>Tactical Application</strong>
                    <p>{selectedResource.recommendedFor}</p>
                  </div>

                  <button
                    type="button"
                    className={`modal-practice-toggle-btn ${
                      completedDrills.includes(selectedResource.id) ? 'practiced' : ''
                    }`}
                    onClick={() => toggleDrillPracticed(selectedResource.id)}
                  >
                    <CheckCircle2 size={16} />
                    {completedDrills.includes(selectedResource.id)
                      ? 'Drill Completed! (Click to Undo)'
                      : 'Mark Drill as Practiced'}
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
