export interface FirstAidPreset {
  id: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_EMERGENCY';
  textPrompt: string;
  tag: string;
  sampleDescription: string;
}

export interface WarningSignPreset {
  id: string;
  title: string;
  hazardType: string;
  originalText: string;
  sourceLangHint: string;
  simulatedVisual: string;
  targetLangSuggestion: string;
}

export const FIRST_AID_PRESETS: FirstAidPreset[] = [
  {
    id: 'chem_splash',
    title: 'Lab Acid Splash in Eye',
    category: 'Chemical Exposure',
    severity: 'CRITICAL_EMERGENCY',
    textPrompt: 'I accidentally splashed hydrochloric acid into my left eye during chemistry lab. It is burning intensely and my eye is red and watering.',
    tag: 'Lab Emergency',
    sampleDescription: 'Corrosive chemical ocular exposure requiring immediate 15-20 min eye wash & 911 alert.'
  },
  {
    id: 'knife_cut',
    title: 'Deep Kitchen Knife Cut',
    category: 'Laceration / Trauma',
    severity: 'HIGH',
    textPrompt: 'I slipped while cutting bread in the dorm kitchen. Deep laceration on my palm, bleeding continuously through paper towels.',
    tag: 'Dorm Accident',
    sampleDescription: 'Deep knife wound with active bleeding requiring continuous direct pressure.'
  },
  {
    id: 'stove_burn',
    title: 'Boiling Water Burn on Hand',
    category: 'Burns',
    severity: 'MEDIUM',
    textPrompt: 'Spilled boiling ramen water over my hand and wrist. The skin is bright red, blister forming, and throbbing with pain.',
    tag: 'Kitchen Burn',
    sampleDescription: 'Second-degree scald burn requiring 15+ mins cool running water and sterile dressing.'
  },
  {
    id: 'food_allergy',
    title: 'Peanut Food Allergy Reaction',
    category: 'Allergic Reaction',
    severity: 'HIGH',
    textPrompt: 'I ate a cookie at the dining hall that might contain nuts. My lips are swelling, throat feels scratchy, and I have itchy hives on my neck.',
    tag: 'Dining Allergy',
    sampleDescription: 'Early signs of food allergy / anaphylaxis requiring EpiPen availability check and contact alert.'
  },
  {
    id: 'ankle_sprain',
    title: 'Sprained Ankle on Library Stairs',
    category: 'Orthopedic Injury',
    severity: 'LOW',
    textPrompt: 'Tripped and twisted my ankle going down the library steps. It popped, swelled up, and hurts to put weight on it.',
    tag: 'Campus Fall',
    sampleDescription: 'Acute ankle inversion sprain requiring RICE protocol.'
  }
];

export const WARNING_SIGN_PRESETS: WarningSignPreset[] = [
  {
    id: 'chem_biohazard',
    title: 'Flammable & Corrosive Lab Notice',
    hazardType: 'DANGER',
    originalText: 'DANGER: HIGHLY FLAMMABLE LIQUIDS AND CORROSIVE CHEMICALS. NO OPEN FLAMES OR SPARKS. EYE PROTECTION AND RESPIRATOR MANDATORY IN THIS ZONE. IN CASE OF SPILL, EVACUATE IMMEDIATELY AND PULL EMERGENCY SHOWER.',
    sourceLangHint: 'English',
    simulatedVisual: '☣️ ⚠️ 🔥 DANGER: HIGHLY FLAMMABLE & CORROSIVE',
    targetLangSuggestion: 'hi'
  },
  {
    id: 'fire_evac',
    title: 'Fire Emergency Evacuation Route',
    hazardType: 'WARNING',
    originalText: 'EMERGENCY EVACUATION NOTICE: IN CASE OF FIRE ALARM, DO NOT USE ELEVATORS. PROCEED VIA NORTH STAIRWELL TO DESIGNATED ASSEMBLY AREA B ON CAMPUS QUAD. ASSIST INDIVIDUALS WITH DISABILITIES.',
    sourceLangHint: 'English',
    simulatedVisual: '🚨 🏃 EMERGENCY EVACUATION — STAIRS ONLY',
    targetLangSuggestion: 'zh'
  },
  {
    id: 'laser_radiation',
    title: 'High-Power Laser Radiation Zone',
    hazardType: 'DANGER',
    originalText: 'CAUTION: CLASS 4 LASER OPERATING. INVISIBLE AND VISIBLE LASER RADIATION. AVOID DIRECT EYE OR SKIN EXPOSURE TO DIRECT OR SCATTERED BEAMS. WEAR CERTIFIED OD7+ SAFETY GOGGLES.',
    sourceLangHint: 'English',
    simulatedVisual: '⚡ 🕶️ CLASS 4 LASER RADIATION AREA',
    targetLangSuggestion: 'es'
  },
  {
    id: 'high_voltage',
    title: 'High Voltage Electrical Substation',
    hazardType: 'DANGER',
    originalText: 'DANGER: 13,800 VOLTS HIGH VOLTAGE EQUIPMENT. AUTHORIZED PERSONNEL ONLY. CONTACT WITH LIVE PARTS WILL CAUSE SEVERE SHOCK, BURNS, OR FATALITY.',
    sourceLangHint: 'English',
    simulatedVisual: '⚡ ☠️ DANGER: HIGH VOLTAGE 13.8kV',
    targetLangSuggestion: 'fr'
  }
];
