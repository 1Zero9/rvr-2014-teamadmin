'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Apple,
  Check,
  CheckCircle2,
  Droplets,
  Heart,
  Sparkles,
  Utensils,
  XCircle,
  Zap,
} from 'lucide-react';

const MEAL_TIMELINE = [
  {
    phase: '3–4 Hours Pre-Match',
    title: 'The Fuel Foundation',
    purpose: 'Fill muscle glycogen stores without causing digestive sluggishness.',
    meals: [
      'Porridge made with milk, topped with banana, honey and berries',
      'Wholemeal pasta or brown rice with grilled chicken & mild tomato sauce',
      'Poached or scrambled eggs on 2 slices of wholemeal toast with avocado',
      'Baked potato with baked beans and light grated cheese',
    ],
    hydration: '500ml water sipped gradually over the morning.',
  },
  {
    phase: '60–90 Mins Pre-Match',
    title: 'Quick-Release Energy Booster',
    purpose: 'Top up blood glucose without filling the stomach.',
    meals: [
      '1 ripe banana or apple slices with a dab of peanut butter',
      'Oat flapjack bar or homemade banana bread',
      'Slice of toast with jam or pure honey',
      'Small box of raisins or dried cranberries',
    ],
    hydration: '250ml water or diluted isotonic cordial up to 30 mins before kickoff.',
  },
  {
    phase: 'Half-Time Interval',
    title: 'Refueling & Electrolytes',
    purpose: 'Rapid glycogen restoration to maintain sprint capacity for the 2nd half.',
    meals: [
      'Fresh orange slices (classic matchday hydration & vitamin C)',
      '1–2 energy jelly babies / sports drops for instant glucose',
      'Small banana bite',
    ],
    hydration: '3–4 large mouthfuls of water (approx 150ml). Avoid gulping large volumes.',
  },
  {
    phase: '30 Mins Post-Match',
    title: 'The 3-R Recovery (Rehydrate, Refuel, Rebuild)',
    purpose: 'Repair muscle micro-tears and replenish depleted glycogen.',
    meals: [
      'Flavored chocolate milk (ideal 4:1 carb-to-protein ratio for youth recovery)',
      'Chicken breast wrap with salad & hummus',
      'Greek yogurt bowl with granola and sliced fruit',
      'Smoothie with banana, berries, milk, and oats',
    ],
    hydration: '500ml water plus electrolyte tablet if hot matchday.',
  },
];

const FOODS_TO_AVOID = [
  'Greasy fried foods, chips, or fast food within 24 hours of kickoff',
  'Fizzy carbonated drinks or high-caffeine energy drinks (strictly prohibited)',
  'Heavy creamy sauces or large amounts of cheese immediately before playing',
  'Excessive candy/chocolate right before warmup (causes rapid sugar crash)',
];

export function NutritionSection() {
  const [activePhase, setActivePhase] = useState(0);

  const current = MEAL_TIMELINE[activePhase];

  return (
    <section className="public-section alt-bg" id="nutrition">
      <div className="section-container">
        <div className="section-head">
          <div className="section-pill">
            <Apple size={14} /> PLAYER NUTRITION & HYDRATION
          </div>
          <h2>Fueling Young Champions (RVR 2014)</h2>
          <p>
            Evidence-based sports nutrition tailored for youth football: when to eat, what to drink, and how to recover fast.
          </p>
        </div>

        {/* Timeline Selector */}
        <div className="nutrition-timeline-nav">
          {MEAL_TIMELINE.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`timeline-step-btn ${activePhase === index ? 'active' : ''}`}
              onClick={() => setActivePhase(index)}
            >
              <span className="step-num">{index + 1}</span>
              <div className="step-text">
                <span className="step-phase">{item.phase}</span>
                <strong>{item.title}</strong>
              </div>
            </button>
          ))}
        </div>

        {/* Active Phase Card */}
        <div className="nutrition-card">
          <div className="nutrition-card-header">
            <div>
              <span className="phase-pill">{current.phase}</span>
              <h3>{current.title}</h3>
              <p className="purpose-text">{current.purpose}</p>
            </div>
            <div className="hydration-quick-badge">
              <Droplets size={20} />
              <div>
                <small>Hydration Goal</small>
                <strong>{current.hydration}</strong>
              </div>
            </div>
          </div>

          <div className="meal-options-box">
            <h4>Recommended Fuel Options:</h4>
            <div className="meal-options-grid">
              {current.meals.map((meal, i) => (
                <div className="meal-option-item" key={i}>
                  <div className="meal-bullet">
                    <Utensils size={15} />
                  </div>
                  <span>{meal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Rule Cards: Do & Don'ts */}
        <div className="rules-grid">
          <div className="rule-card positive">
            <div className="rule-card-head">
              <CheckCircle2 size={20} />
              <h4>Matchday Golden Rules</h4>
            </div>
            <ul>
              <li>
                <Check size={14} /> <strong>Hydrate the day before:</strong> Don&apos;t wait until Saturday morning to start drinking water.
              </li>
              <li>
                <Check size={14} /> <strong>Eat familiar foods:</strong> Never experiment with brand-new foods on matchday morning.
              </li>
              <li>
                <Check size={14} /> <strong>Small sips over large gulps:</strong> Prevents stomach sloshing during high-intensity sprints.
              </li>
              <li>
                <Check size={14} /> <strong>Sleep 9–10 hours:</strong> Growth hormone release and mental alertness depend on consistent rest.
              </li>
            </ul>
          </div>

          <div className="rule-card negative">
            <div className="rule-card-head">
              <XCircle size={20} />
              <h4>Foods to Avoid on Matchday</h4>
            </div>
            <ul>
              {FOODS_TO_AVOID.map((item, idx) => (
                <li key={idx}>
                  <AlertTriangle size={14} /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
