export interface FootballResource {
  id: string;
  title: string;
  creator: string;
  channelUrl?: string;
  youtubeId: string;
  embedUrl: string;
  category: '1v1' | 'mastery' | 'passing' | 'finishing' | 'defending' | 'speed_sc' | 'tactical';
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  duration: string;
  reps: string;
  description: string;
  coachingPoints: string[];
  focus: string;
  recommendedFor: string;
}

export const YOUTUBE_FOOTBALL_RESOURCES: FootballResource[] = [
  // --- 1V1 ATTACKING & DRIBBLING ---
  {
    id: 'unisport-5-effective-1v1',
    title: '5 Effective 1v1 Skills That Beat Every Defender',
    creator: 'Unisport',
    youtubeId: 'W1l2g9_kQ5c',
    embedUrl: 'https://www.youtube-nocookie.com/embed/W1l2g9_kQ5c',
    category: '1v1',
    difficulty: 'Intermediate',
    duration: '8 Mins',
    reps: '4 sets × 10 reps each move (both feet)',
    description:
      'Learn the five most practical and devastating 1v1 match skills used by elite wingers and attacking midfielders to break lines and unbalance defenders.',
    coachingPoints: [
      'Sell the dummy with a low shoulder drop and head fake',
      'Keep the ball tight to your instep until the moment of acceleration',
      'Explode into the space behind the defender with the first 3 strides',
      'Change tempo: slow approach -> sudden explosive burst',
    ],
    focus: '1v1 isolation, body feints, sudden change of acceleration',
    recommendedFor: 'Wingers, Strikers, Attacking Midfielders',
  },
  {
    id: 'allattack-la-croqueta',
    title: 'How to Master the "La Croqueta" (Iniesta Technique)',
    creator: 'AllAttack',
    youtubeId: 'n42s5Y3Fm4c',
    embedUrl: 'https://www.youtube-nocookie.com/embed/n42s5Y3Fm4c',
    category: '1v1',
    difficulty: 'Intermediate',
    duration: '6 Mins',
    reps: '3 sets × 15 shifts (left-to-right & right-to-left)',
    description:
      'The signature Andres Iniesta move: shift the ball from the inside of your dominant foot to the inside of your other foot in one continuous, fluid glide.',
    coachingPoints: [
      'Wait for the defender to commit their front foot before shifting',
      'Cushion the ball with soft ankles, avoid kicking it too far ahead',
      'Glide laterally before surging forward',
    ],
    focus: 'Tight space escape, central midfield bypass, close control',
    recommendedFor: 'Central Midfielders, Wingers',
  },
  {
    id: 'unisport-stepovers',
    title: 'Step-Over Mastery: Single & Double Variations',
    creator: 'Unisport',
    youtubeId: 'e13g64l29i8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/e13g64l29i8',
    category: '1v1',
    difficulty: 'Intermediate',
    duration: '7 Mins',
    reps: '4 sets × 8 explosive repetitions',
    description:
      'Master the timing, foot elevation, and hip rotation needed to execute world-class step-overs that force defenders onto their heels.',
    coachingPoints: [
      'Circle the foot cleanly in front of the ball, not over the top',
      'Drop your hips low on the stepping foot to fake a shot/pass',
      'Exit aggressively with the outside of your opposite foot',
    ],
    focus: 'Deception, rhythm change, attacking full-backs',
    recommendedFor: 'Wingers, Full-backs, Forwards',
  },

  // --- BALL MASTERY & 1000 TOUCHES ---
  {
    id: '7mlc-10min-ball-mastery',
    title: '10-Minute Daily Ball Mastery Routine (1,000 Touches)',
    creator: '7mlc (Michael Cunningham)',
    youtubeId: 'Q0vF0lKq5-4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Q0vF0lKq5-4',
    category: 'mastery',
    difficulty: 'Foundation',
    duration: '10 Mins',
    reps: 'Follow along in real-time (10 exercises × 45s work / 15s rest)',
    description:
      'High-density technical workout covering sole rolls, inside-outside taps, V-cuts, and Brazilian toe taps. Perfect for living room or back garden practice.',
    coachingPoints: [
      'Stay light on the balls of your feet with a springy posture',
      'Keep head up periodically to build peripheral vision',
      'Challenge yourself to increase touch frequency without losing precision',
    ],
    focus: 'Foot-eye coordination, touch consistency, ambidexterity',
    recommendedFor: 'All Squad Positions',
  },
  {
    id: 'coerver-box-footwork',
    title: 'Coerver Coaching: Essential Fast Footwork Drills',
    creator: 'Coerver Coaching',
    youtubeId: 'r48p_Y5E3c0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/r48p_Y5E3c0',
    category: 'mastery',
    difficulty: 'Foundation',
    duration: '9 Mins',
    reps: '3 sets × 60 seconds per pattern',
    description:
      'Classic Coerver ball mastery fundamentals: Sole rolls, scissors, drag-backs, and push-pull sequences used by European elite academies.',
    coachingPoints: [
      'Soft knees and rhythmic arm balancing',
      'Use all 6 surfaces of both boots (inside, outside, laces, sole, heel, toe)',
      'Aim for smooth rhythm before applying maximum speed',
    ],
    focus: 'Fast feet, neuromuscular coordination, ground agility',
    recommendedFor: 'All Squad Positions',
  },

  // --- PASSING & FIRST TOUCH ---
  {
    id: '7mlc-first-touch-mastery',
    title: '10 Exercises to Master Your First Touch & Receiving',
    creator: '7mlc',
    youtubeId: 'l2g_04t5eUQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/l2g_04t5eUQ',
    category: 'passing',
    difficulty: 'Intermediate',
    duration: '12 Mins',
    reps: '50 left foot + 50 right foot wall rebounds',
    description:
      'Structured wall and rebounder drills to train directional first touches, receiving across the body, and cushion control on bouncing balls.',
    coachingPoints: [
      'Cushion on impact by pulling foot slightly backward (giving with the ball)',
      'First touch should guide the ball 1 yard out of your feet into open grass',
      'Always glance over both shoulders before receiving',
    ],
    focus: 'Receiving under pressure, directional control, wall training',
    recommendedFor: 'Midfielders, Defenders, Strikers',
  },
  {
    id: 'become-elite-driven-pass',
    title: 'How to Hit a Low Driven Pass with Power & Accuracy',
    creator: 'Become Elite (Matt Sheldon)',
    youtubeId: 'jA1N0Xp2D_8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jA1N0Xp2D_8',
    category: 'passing',
    difficulty: 'Advanced',
    duration: '11 Mins',
    reps: '20 driven passes each foot over 20-30 meters',
    description:
      'Biomechanical breakdown of the low laces driven pass for fast pitch switches, piercing through-balls, and counter-attacks.',
    coachingPoints: [
      'Lock ankle completely rigid with toes pointed downward',
      'Strike directly through the center equator of the ball',
      'Keep chest and knee over the ball to keep the trajectory flat',
      'Land forward on your striking foot',
    ],
    focus: 'Passing range, switching play, ball velocity',
    recommendedFor: 'Centre Backs, Full-backs, Central Midfielders',
  },

  // --- FINISHING & STRIKING ---
  {
    id: 'allattack-curling-shots',
    title: 'How to Curl & Bend the Ball into the Top Corner',
    creator: 'AllAttack',
    youtubeId: 'fW_1u8hC7rE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/fW_1u8hC7rE',
    category: 'finishing',
    difficulty: 'Intermediate',
    duration: '10 Mins',
    reps: '4 sets × 6 curved strikes from left & right angles',
    description:
      'Step-by-step masterclass on wrapping the inside arch of your boot around the ball to generate top-spin curl into the side netting.',
    coachingPoints: [
      'Approach at a 45-degree angle to open the hip rotation',
      'Plant non-kicking foot pointing toward the corner flag',
      'Wrap instep around the outer half of the ball with an upward arc',
    ],
    focus: 'Curled finishing, free kicks, far-post placement',
    recommendedFor: 'Forwards, Wingers, Attacking Midfielders',
  },
  {
    id: 'unisport-1v1-finishing',
    title: 'How to Beat the Keeper in 1v1 Breakaways',
    creator: 'Unisport',
    youtubeId: 'k4m8X8_G1j0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/k4m8X8_G1j0',
    category: 'finishing',
    difficulty: 'Advanced',
    duration: '9 Mins',
    reps: '10 breakaway repetitions (low slot, chip, and round keeper)',
    description:
      'Composure guide when running through on goal: how to read the goalkeeper’s weight, disguise your finish, and roll the ball into the corners.',
    coachingPoints: [
      'Lift head early to see if the keeper is rushing or staying deep',
      'Disguise your eyes — look near post, slide far post',
      'Keep finish low along the grass where goalkeepers are slowest to dive',
    ],
    focus: 'Matchday composure, clinical finishing, breakaway execution',
    recommendedFor: 'Strikers, Wingers',
  },

  // --- DEFENDING & 1V1 DUELS ---
  {
    id: 'simplysoccer-1v1-defending',
    title: '1v1 Defending Masterclass: Body Shape, Jockeying & Tackles',
    creator: 'SimplySoccer',
    youtubeId: '04n3N8e5Q5I',
    embedUrl: 'https://www.youtube-nocookie.com/embed/04n3N8e5Q5I',
    category: 'defending',
    difficulty: 'Intermediate',
    duration: '12 Mins',
    reps: '4 sets × 45 seconds lateral jockeying & block tackles',
    description:
      'Learn how top defenders like Virgil van Dijk and Kyle Walker delay attackers, protect the danger zone, and win duels without fouling.',
    coachingPoints: [
      'Adopt a side-on boxer stance — never square up flat-footed',
      'Force the attacker wide onto their weaker foot or toward touchline support',
      'Do not lunge — wait for the attacker to take an uncontrolled heavy touch',
      'Use arm bar for legal shielding once you step across the attacker’s line',
    ],
    focus: 'Defensive shape, delaying attackers, interception timing',
    recommendedFor: 'Defenders, Defensive Midfielders, Full-backs',
  },

  // --- SPEED, AGILITY & S&C ---
  {
    id: 'become-elite-speed-agility',
    title: 'Speed & Agility Footwork Ladder Drills for Footballers',
    creator: 'Become Elite',
    youtubeId: 't37pW2N8e1I',
    embedUrl: 'https://www.youtube-nocookie.com/embed/t37pW2N8e1I',
    category: 'speed_sc',
    difficulty: 'Intermediate',
    duration: '14 Mins',
    reps: '6 ladder patterns × 3 runs each + 5m sprint exit',
    description:
      'Explosive fast-feet agility ladder routines that translate directly into sharp changes of direction and rapid first-step acceleration.',
    coachingPoints: [
      'Stay on the forefoot, heels never touching the turf',
      'Aggressive arm pumping in sync with rapid foot turnover',
      'Accelerate immediately upon exiting the final ladder rung',
    ],
    focus: 'Foot speed, lateral agility, acceleration mechanics',
    recommendedFor: 'All Squad Positions',
  },
  {
    id: 'fifa-11-warmup-routine',
    title: 'FIFA 11+ Complete Dynamic Warm-Up Program',
    creator: 'FIFA Medical & Sports Science',
    youtubeId: 'p2wK8c6eM74',
    embedUrl: 'https://www.youtube-nocookie.com/embed/p2wK8c6eM74',
    category: 'speed_sc',
    difficulty: 'Foundation',
    duration: '15 Mins',
    reps: 'Full 3-part program (Running, Core/Plyometrics, Running bursts)',
    description:
      'The scientifically proven injury-prevention warmup used across world football to activate hamstrings, groins, knees, and ankles.',
    coachingPoints: [
      'Maintain upright spine and controlled knee alignment over toes',
      'Land softly with bent knees during all jumping/hopping phases',
      'Gradually increase movement intensity throughout the 15 minutes',
    ],
    focus: 'Injury prevention, joint mobility, muscle activation',
    recommendedFor: 'Mandatory for All Players Pre-Match & Pre-Training',
  },

  // --- TACTICAL IQ & SCANNING ---
  {
    id: 'simplysoccer-scanning-iq',
    title: 'How to Scan Like Kevin De Bruyne & Xavi (360° Vision)',
    creator: 'SimplySoccer',
    youtubeId: 'u7f8E4m5Q1g',
    embedUrl: 'https://www.youtube-nocookie.com/embed/u7f8E4m5Q1g',
    category: 'tactical',
    difficulty: 'Advanced',
    duration: '10 Mins',
    reps: 'Scan rate target: 3 to 5 shoulder checks every 10 seconds',
    description:
      'How to train high-frequency head checks before receiving the ball to identify passing lanes, open space, and closing defenders early.',
    coachingPoints: [
      'Scan while the ball is traveling, not when it arrives at your feet',
      'Take mental snapshots of teammate positions and defensive pressure',
      'Know your next action before the ball touches your boot',
    ],
    focus: 'Decision-making speed, pitch awareness, spatial intelligence',
    recommendedFor: 'Midfielders, Centre Backs, Playmakers',
  },
];
