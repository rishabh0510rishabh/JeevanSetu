import { FirstAidProtocolItem, SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

export const OFFLINE_PROTOCOLS: FirstAidProtocolItem[] = [
  {
    id: 'burns',
    title: 'Thermal & Heat Burns',
    category: 'Burns',
    severity: 'MEDIUM',
    iconName: 'Flame',
    summary: 'First and second-degree burns from stoves, boiling liquids, or hot objects.',
    immediateAction: 'Cool the burn with cool running water for 10-20 minutes immediately.',
    steps: [
      'Immediately hold the burned area under gentle, cool running tap water for at least 10–20 minutes.',
      'Do NOT use ice, ice water, butter, oil, or toothpaste, as these cause further tissue damage.',
      'Carefully remove any tight rings, bracelets, or clothing around the burn before swelling begins.',
      'Cover loosely with a sterile, non-stick clean gauze or clean cling film wrap.',
      'Take over-the-counter pain reliever (e.g. ibuprofen or acetaminophen) if tolerated.',
      'Seek emergency medical help if the burn is larger than 3 inches, on face, hands, joints, or groin.'
    ],
    doNots: [
      'Never pop or puncture blisters.',
      'Never apply ice directly to burned skin.',
      'Never apply butter, grease, ointment, or kitchen remedies.',
      'Never forcefully peel off clothing stuck to the burn.'
    ],
    redFlags: [
      'Charred black, brown, or leathery white skin (Third-degree burn).',
      'Burn covers large surface area (more than palm of hand).',
      'Inhalation of smoke with difficulty breathing or coughing soot.',
      'Burn caused by high-voltage electricity or caustic chemicals.'
    ]
  },
  {
    id: 'cuts_bleeding',
    title: 'Severe Bleeding & Cuts',
    category: 'Laceration / Trauma',
    severity: 'HIGH',
    iconName: 'Bandage',
    summary: 'Deep lacerations, kitchen knife cuts, broken glass injuries.',
    immediateAction: 'Apply firm, continuous direct pressure with a clean cloth or sterile gauze.',
    steps: [
      'Protect yourself and use clean hands or disposable gloves if available.',
      'Press firmly and directly on the wound with a clean cloth, towel, or sterile gauze pad.',
      'Maintain continuous pressure for at least 5 to 10 minutes without lifting the cloth to check.',
      'If blood soaks through, add another cloth on top — DO NOT remove the original dressing.',
      'If the injury is on an arm or leg and bleeding is severe, keep the limb elevated above heart level if possible.',
      'Once bleeding slows, secure dressing with a bandage and seek medical evaluation if wound is deep or gaping.'
    ],
    doNots: [
      'Do not remove deeply embedded objects (like large glass shards or knives) — stabilize in place with bulky dressings.',
      'Do not wash deep, heavily bleeding wounds with harsh chemicals or alcohol.',
      'Do not release pressure every 30 seconds to look at the wound.'
    ],
    redFlags: [
      'Pulsing, spurting bright red blood (Arterial bleeding) — CALL 911/112 IMMEDIATELY.',
      'Bleeding does not stop after 10-15 minutes of direct firm pressure.',
      'Victim appears pale, dizzy, clammy, confused, or faints (Shock).',
      'Numbness or loss of sensation beyond the cut.'
    ]
  },
  {
    id: 'chemical_splash',
    title: 'Lab Chemical Splash (Eyes/Skin)',
    category: 'Chemical Exposure',
    severity: 'CRITICAL_EMERGENCY',
    iconName: 'FlaskConical',
    summary: 'Corrosive acids, bases, solvents splashed on skin or into eyes.',
    immediateAction: 'Flush affected area continuously with copious running water for at least 15–20 minutes. Call emergency services immediately.',
    steps: [
      'CALL EMERGENCY SERVICES / CAMPUS 911 IMMEDIATELY while beginning decontamination.',
      'If eye splash: Immediately go to eye-wash station or sink. Hold eyelids open and flush gently with continuous running water for at least 15-20 minutes.',
      'If skin splash: Remove contaminated clothing and jewelry immediately while showering or rinsing under continuous water.',
      'Locate the Safety Data Sheet (SDS) or chemical bottle label to inform paramedics of the chemical name.',
      'Do not attempt to chemically neutralize the spill (e.g. do not add vinegar to base or soda to acid) as heat will be generated.',
      'Keep flushing until professional paramedics take over.'
    ],
    doNots: [
      'Never rub your eyes.',
      'Do not attempt chemical neutralization.',
      'Do not delay flushing to search for neutralizing solutions.'
    ],
    redFlags: [
      'Any acid or base splash into eyes.',
      'Inhalation of toxic chemical vapors or burning in throat/chest.',
      'Loss of vision or extreme acute pain.'
    ]
  },
  {
    id: 'allergic_reaction',
    title: 'Allergic Reaction & Anaphylaxis',
    category: 'Allergic Reaction',
    severity: 'CRITICAL_EMERGENCY',
    iconName: 'AlertTriangle',
    summary: 'Reactions to food (nuts/shellfish), insect stings, or medication.',
    immediateAction: 'If throat swelling, wheezing, or dizziness occurs, use an EpiPen auto-injector immediately and call 911.',
    steps: [
      'Check for red flags of Anaphylaxis: difficulty breathing, swelling of lips/tongue/throat, widespread hives, vomiting, or dizziness.',
      'If the person carries an Epinephrine auto-injector (EpiPen), administer it into the outer mid-thigh immediately.',
      'CALL 911 / 112 IMMEDIATELY — anaphylaxis is a medical emergency that requires hospital monitoring even after epinephrine.',
      'Have the person lie down flat with legs elevated (or sit up if breathing is difficult).',
      'For mild local hives without breathing trouble, an oral antihistamine may be taken under medical guidance.'
    ],
    doNots: [
      'Do not allow the person to stand up suddenly after an anaphylactic episode.',
      'Do not wait to see if symptoms get worse before using the EpiPen.'
    ],
    redFlags: [
      'Tightness in throat, hoarse voice, or difficulty swallowing.',
      'Wheezing or shortness of breath.',
      'Dizziness, fainting, or rapid weak pulse.'
    ]
  },
  {
    id: 'choking',
    title: 'Choking (Heimlich Maneuver)',
    category: 'Airway Obstruction',
    severity: 'CRITICAL_EMERGENCY',
    iconName: 'LifeBuoy',
    summary: 'Airway blocked by food or object; unable to speak or breathe.',
    immediateAction: 'If unable to cough or speak, perform 5 back blows followed by 5 abdominal thrusts (Heimlich).',
    steps: [
      'Ask: "Are you choking? Can you speak or cough?" If they can cough forcefully, encourage them to keep coughing.',
      'If they cannot speak, breathe, or make sound (silent hands to throat):',
      'Stand behind them, lean them forward, and give 5 firm back blows between shoulder blades with the heel of your hand.',
      'If still blocked, wrap arms around waist, make a fist above navel, grasp with other hand, and give 5 quick upward abdominal thrusts.',
      'Repeat alternating 5 back blows and 5 abdominal thrusts until object is expelled or person becomes unconscious.',
      'If person goes unconscious: Lower to floor, call 911, and begin CPR compressions.'
    ],
    doNots: [
      'Do not perform abdominal thrusts on pregnant individuals or infants (use chest thrusts instead).',
      'Do not do blind finger sweeps in the mouth.'
    ],
    redFlags: [
      'Inability to speak, cry, or cough.',
      'Blue or gray lips and fingernails.',
      'Loss of consciousness.'
    ]
  },
  {
    id: 'sprain_fracture',
    title: 'Sprains, Strains & Fractures',
    category: 'Orthopedic Injury',
    severity: 'LOW',
    iconName: 'Activity',
    summary: 'Twisted ankle, fallen on campus stairs, wrist injury, suspected broken bone.',
    immediateAction: 'Apply R.I.C.E. protocol: Rest, Ice, Compression, Elevation. Immobilize if broken.',
    steps: [
      'Rest: Stop activity immediately and avoid putting weight on the injured limb.',
      'Immobilize: If bone deformity or bone piercing skin is visible, DO NOT move limb. Splint in place.',
      'Ice: Apply cold pack wrapped in a cloth for 15-20 minutes at a time (never direct ice on bare skin).',
      'Compress: Wrap with an elastic compression bandage snugly, but not tight enough to cut off circulation.',
      'Elevate: Prop the injured limb up above the level of the heart to minimize swelling.'
    ],
    doNots: [
      'Do not attempt to realign or pop back a deformed bone or dislocated joint.',
      'Do not apply direct heat or hot water in the first 48 hours.'
    ],
    redFlags: [
      'Visible bone piercing through skin (Open fracture) — Call 911.',
      'Complete inability to bear weight or move fingers/toes.',
      'Cold, pale, or blue toes/fingers below the injury site.'
    ]
  },
  {
    id: 'fainting_syncope',
    title: 'Fainting & Loss of Consciousness',
    category: 'Neurological / Cardiovascular',
    severity: 'HIGH',
    iconName: 'UserX',
    summary: 'Sudden temporary loss of consciousness, dizziness, or collapse.',
    immediateAction: 'Lay person flat on back and elevate legs 12 inches (30 cm). Loosen tight clothing.',
    steps: [
      'Check responsiveness and breathing. If not breathing normally, begin CPR immediately and call 911.',
      'If breathing normally: Keep person lying on back and elevate legs about 12 inches to restore blood flow to brain.',
      'Loosen tight collars, ties, belts, or restrictive clothing.',
      'Ensure plenty of fresh air. Do not crowd around the person.',
      'If the person vomits or is drowsy, roll them onto their side into the Recovery Position.',
      'Keep them lying down for at least 10–15 minutes before slowly helping them sit up.'
    ],
    doNots: [
      'Do not splash cold water on their face.',
      'Do not give food or drink while they are semi-conscious.',
      'Do not allow them to stand up quickly.'
    ],
    redFlags: [
      'Unconsciousness lasts longer than 1 minute.',
      'Fainting accompanied by chest pain, shortness of breath, or seizure.',
      'Head injury sustained during the fall.'
    ]
  },
  {
    id: 'heat_exhaustion',
    title: 'Heat Exhaustion & Heat Stroke',
    category: 'Environmental Hazard',
    severity: 'HIGH',
    iconName: 'Sun',
    summary: 'Overheating from outdoor sports or hot dorms without ventilation.',
    immediateAction: 'Move to shade/AC, cool skin with wet cloths or fanning, sip cool water.',
    steps: [
      'Move person immediately to a cool, air-conditioned room or shady area.',
      'Loosen or remove excess clothing.',
      'Apply cool, wet cloths or mist water on skin while fanning vigorously.',
      'Place cold packs on neck, armpits, and groin.',
      'If conscious and not vomiting, give small sips of cool water or electrolyte drink.',
      'If confusion, hot dry skin, vomiting, or seizure occurs, this is HEAT STROKE — Call 911 immediately!'
    ],
    doNots: [
      'Do not give ice-cold water too quickly (can cause stomach cramps).',
      'Do not give caffeinated or alcoholic drinks.'
    ],
    redFlags: [
      'Body temperature above 104°F (40°C).',
      'Confusion, agitation, slurred speech, or delirium.',
      'Hot, red, dry skin with absence of sweating.'
    ]
  }
];
