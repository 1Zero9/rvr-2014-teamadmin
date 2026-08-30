'use client';

import { useState } from 'react';
import {
  Car,
  Compass,
  ExternalLink,
  Footprints,
  Info,
  MapPin,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  type: 'Home Pitch' | 'Away / Neutral Complex' | 'Training Hub';
  surface: 'Natural Grass' | '4G All-Weather Astro' | 'Natural Grass & 4G Astro';
  footwear: string;
  address: string;
  parking: string;
  facilities: string[];
  mapsUrl: string;
  appleMapsUrl: string;
  notes: string;
}

const VENUES: Venue[] = [
  {
    id: 'rivervalley-park',
    name: 'Rivervalley Park (Home Pitches)',
    type: 'Home Pitch',
    surface: 'Natural Grass',
    footwear: 'Molded Studs (FG) or Soft Ground Studs (SG) in winter',
    address: 'Rivervalley Park, Rivervalley Heights, Swords, Co. Dublin, K67 E3F7',
    parking: 'Main car park at Rivervalley Community Centre / St. Finian’s Church.',
    facilities: ['Club Pavilion', 'Changing Rooms', 'Toilets', 'Coffee Shop nearby'],
    mapsUrl: 'https://maps.google.com/?q=Rivervalley+Park+Swords',
    appleMapsUrl: 'https://maps.apple.com/?q=Rivervalley+Park+Swords',
    notes: 'Home venue for RVR 2014 Saturday league matches (Pitches 1 & 2). Arrive 45 mins prior to kickoff.',
  },
  {
    id: 'brookdale',
    name: 'Brookdale Playing Fields',
    type: 'Home Pitch',
    surface: 'Natural Grass',
    footwear: 'Molded Studs (FG) / Soft Ground Studs',
    address: 'Brookdale Way, Rivervalley, Swords, Co. Dublin',
    parking: 'Street parking along designated bays. Please respect residential driveways.',
    facilities: ['Open grass pitches', 'Club container storage'],
    mapsUrl: 'https://maps.google.com/?q=Brookdale+Swords+Dublin',
    appleMapsUrl: 'https://maps.apple.com/?q=Brookdale+Swords+Dublin',
    notes: 'Secondary home pitch for selected cup ties and weekend blitzes.',
  },
  {
    id: 'alsaa',
    name: 'ALSAA Sports Complex',
    type: 'Away / Neutral Complex',
    surface: '4G All-Weather Astro',
    footwear: 'Astro Turf Trainers (TF) or Firm Ground (FG) Plastic Molded Studs (NO metal blades)',
    address: 'Old Airport Road, Toberbunny, Dublin Airport, Co. Dublin, K67 YV06',
    parking: 'Ample on-site parking at ALSAA (barrier pay-and-display or team voucher).',
    facilities: ['All-Weather Pitches', 'Indoor Sports Hall', 'Changing Rooms', 'Cafeteria'],
    mapsUrl: 'https://maps.google.com/?q=ALSAA+Sports+Complex+Dublin+Airport',
    appleMapsUrl: 'https://maps.apple.com/?q=ALSAA+Sports+Complex+Dublin+Airport',
    notes: 'Frequent location for winter fixtures, tournament blitzes, and evening league match-ups.',
  },
  {
    id: 'aul-complex',
    name: 'AUL Sports Complex (Clonshaugh)',
    type: 'Away / Neutral Complex',
    surface: 'Natural Grass & 4G Astro',
    footwear: 'Check specific pitch allocation on arrival (Astro molds or grass studs)',
    address: 'Clonshaugh Road, Clonshaugh, Dublin 17, D17 W599',
    parking: 'Large designated parking area inside the complex main gate.',
    facilities: ['Match Pitches 1-15', 'Full Dressing Rooms', 'Clubhouse & Coffee Bar'],
    mapsUrl: 'https://maps.google.com/?q=AUL+Complex+Clonshaugh+Dublin',
    appleMapsUrl: 'https://maps.apple.com/?q=AUL+Complex+Clonshaugh+Dublin',
    notes: 'Major DDSL Cup finals, tournament rounds, and representative matches venue.',
  },
  {
    id: 'ridgewood',
    name: 'Ridgewood Playing Fields',
    type: 'Training Hub',
    surface: 'Natural Grass',
    footwear: 'Molded Studs (FG)',
    address: 'Ridgewood Playing Pitches, Forest Road, Swords, Co. Dublin',
    parking: 'Tesco Express / Ridgewood community center car park.',
    facilities: ['Training grass area', 'Walking track perimeter'],
    mapsUrl: 'https://maps.google.com/?q=Ridgewood+Playing+Pitches+Swords',
    appleMapsUrl: 'https://maps.apple.com/?q=Ridgewood+Playing+Pitches+Swords',
    notes: 'Used for additional tactical drills and preseason conditioning camps.',
  },
];

export function VenuesSection() {
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all'
      ? VENUES
      : filter === 'home'
      ? VENUES.filter((v) => v.type === 'Home Pitch')
      : VENUES.filter((v) => v.type !== 'Home Pitch');

  return (
    <section className="public-section" id="venues">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Compass size={14} /> PITCH VENUES & DIRECTIONS
          </div>
          <h2>Match Locations & Pitch Guide</h2>
          <p>
            One-tap GPS directions, pitch surfaces, footwear recommendations, and parking tips for home and away fixtures.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-bar">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Venues
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'home' ? 'active' : ''}`}
            onClick={() => setFilter('home')}
          >
            Home Grounds (Rivervalley)
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'away' ? 'active' : ''}`}
            onClick={() => setFilter('away')}
          >
            Away & Complex Venues (AUL / ALSAA)
          </button>
        </div>

        {/* Venues Grid */}
        <div className="venues-grid">
          {filtered.map((venue) => (
            <article className="venue-card" key={venue.id}>
              <div className="venue-header">
                <div>
                  <span className={`venue-type-tag ${venue.type === 'Home Pitch' ? 'home' : 'neutral'}`}>
                    {venue.type}
                  </span>
                  <h3>{venue.name}</h3>
                </div>
                <span className={`surface-badge ${venue.surface.includes('Astro') ? 'astro' : 'grass'}`}>
                  {venue.surface}
                </span>
              </div>

              <p className="venue-notes">{venue.notes}</p>

              <div className="venue-info-stack">
                <div className="venue-info-row">
                  <MapPin size={16} />
                  <span>{venue.address}</span>
                </div>
                <div className="venue-info-row">
                  <Footprints size={16} />
                  <span>
                    <strong>Footwear:</strong> {venue.footwear}
                  </span>
                </div>
                <div className="venue-info-row">
                  <Car size={16} />
                  <span>
                    <strong>Parking:</strong> {venue.parking}
                  </span>
                </div>
              </div>

              <div className="venue-facilities-tags">
                {venue.facilities.map((fac, idx) => (
                  <span key={idx} className="fac-tag">
                    {fac}
                  </span>
                ))}
              </div>

              <div className="venue-actions">
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="venue-map-btn google"
                >
                  <Navigation size={15} /> Google Maps
                </a>
                <a
                  href={venue.appleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="venue-map-btn apple"
                >
                  <ExternalLink size={15} /> Apple Maps
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
