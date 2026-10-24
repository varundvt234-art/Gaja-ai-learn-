import { TopicItem } from '../types';

export const STARTER_QUESTIONS: TopicItem[] = [
  {
    id: 'photosynthesis',
    title: 'What is photosynthesis?',
    subject: 'Biology & Plants',
    icon: 'Leaf',
    prompt: 'What is photosynthesis? How do plants turn sunlight into energy and oxygen?',
    badge: 'Popular',
  },
  {
    id: 'flower-id',
    title: 'Identify this flower',
    subject: 'Botany',
    icon: 'Flower2',
    prompt: 'How do botanists identify flowers and what visible characteristics should I look for in petals, stamen, and sepals?',
    badge: 'Vision Guide',
  },
  {
    id: 'electricity',
    title: 'How does electricity work?',
    subject: 'Physics & Tech',
    icon: 'Zap',
    prompt: 'How does electricity work? Explain electric current, voltage, resistance, and electron movement in simple terms.',
    badge: 'Fundamental',
  },
  {
    id: 'solar-system',
    title: 'Explain the solar system',
    subject: 'Astronomy',
    icon: 'Orbit',
    prompt: 'Explain the solar system: the Sun, inner rocky planets, outer gas giants, asteroid belt, and orbital motion.',
    badge: 'Cosmos',
  },
  {
    id: 'blue-sky',
    title: 'Why is the sky blue?',
    subject: 'Earth Science',
    icon: 'Sun',
    prompt: 'Why is the sky blue during the day and red during sunset? Explain Rayleigh scattering in an easy way.',
    badge: 'Everyday Wonder',
  },
  {
    id: 'human-heart',
    title: 'How does the human heart work?',
    subject: 'Human Biology',
    icon: 'Heart',
    prompt: 'How does the human heart work? Explain the four chambers, valves, and double circulatory system.',
    badge: 'Anatomy',
  },
];

export const EXPLORE_CATEGORIES = [
  {
    name: 'Biology & Living Things',
    icon: 'Dna',
    topics: [
      { id: 'cell-division', title: 'How Mitosis and Cell Division Work', prompt: 'How does cell division (mitosis) work, and why is it essential for life and growth?' },
      { id: 'dna-structure', title: 'The Double Helix: How DNA Stores Information', prompt: 'Explain the structure of DNA, nucleotide base pairs, and how genetic instructions code for living things.' },
      { id: 'immune-system', title: 'How the Immune System Fights Pathogens', prompt: 'How does the human immune system recognize, attack, and remember viruses and bacteria?' },
      { id: 'pollination', title: 'How Bees and Insects Pollinate Plants', prompt: 'Explain the process of pollination and why pollinators are critical for ecosystems and food crops.' },
    ],
  },
  {
    name: 'Physics & Chemistry',
    icon: 'Atom',
    topics: [
      { id: 'atom-structure', title: 'Inside an Atom: Protons, Neutrons & Electrons', prompt: 'What is an atom made of? Explain subatomic particles, atomic numbers, and the periodic table.' },
      { id: 'gravity', title: 'What is Gravity and How Does It Work?', prompt: 'What is gravity? Contrast Newton’s law of universal gravitation with Einstein’s spacetime curvature in simple words.' },
      { id: 'airplane-flight', title: 'How Do Heavy Airplanes Fly?', prompt: 'How do heavy airplanes fly? Explain lift, thrust, drag, weight, and Bernoulli’s principle simply.' },
      { id: 'light-waves', title: 'Is Light a Wave or a Particle?', prompt: 'Explain wave-particle duality and the electromagnetic spectrum in an intuitive, visual way.' },
    ],
  },
  {
    name: 'Technology & Electronics',
    icon: 'Cpu',
    topics: [
      { id: 'semiconductors', title: 'How Do Microchips and Transistors Work?', prompt: 'How does a silicon microchip work, and how do billions of microscopic transistors perform calculations?' },
      { id: 'internet-routing', title: 'How Data Travels Across the Internet', prompt: 'What actually happens when you press Enter in a browser? Trace data packets through fiber cables, DNS, and servers.' },
      { id: 'batteries', title: 'How Lithium-Ion Batteries Charge and Discharge', prompt: 'How do rechargeable lithium-ion batteries store electrical energy and move lithium ions between electrodes?' },
      { id: 'quantum-computing', title: 'What is a Quantum Computer and Qubit?', prompt: 'Explain quantum computing, superposition, and quantum entanglement in simple, beginner-friendly terms.' },
    ],
  },
  {
    name: 'Astronomy & Space',
    icon: 'Sparkles',
    topics: [
      { id: 'black-holes', title: 'What Happens Inside a Black Hole?', prompt: 'What is a black hole, how does it form from a dying star, and what is the event horizon?' },
      { id: 'star-lifecycle', title: 'The Life and Death of Stars', prompt: 'Explain the lifecycle of stars from nebulae to red giants, white dwarfs, and supernovae.' },
      { id: 'moon-tides', title: 'How the Moon Causes Ocean Tides', prompt: 'Why do ocean tides rise and fall twice a day? Explain tidal bulges and gravitational pull of the Moon and Sun.' },
      { id: 'exoplanets', title: 'How Astronomers Discover Alien Planets', prompt: 'How do space telescopes like Kepler and James Webb discover exoplanets orbiting distant stars?' },
    ],
  },
  {
    name: 'Earth, Geography & History',
    icon: 'Globe2',
    topics: [
      { id: 'plate-tectonics', title: 'Plate Tectonics: How Earthquakes and Mountains Form', prompt: 'Explain continental drift, plate tectonics, faults, and why the Himalayas continue to rise.' },
      { id: 'water-cycle', title: 'The Global Water Cycle and Weather Systems', prompt: 'Describe the complete hydrologic cycle: evaporation, transpiration, condensation, precipitation, and runoff.' },
      { id: 'pyramids', title: 'Engineering Feats: How Were the Pyramids Built?', prompt: 'What does historical and archaeological evidence tell us about how the Great Pyramids of Giza were engineered?' },
      { id: 'climate-zones', title: 'Why Earth Has Tropical, Temperate & Polar Climates', prompt: 'Why is the equator hot while the poles are frozen? Explain Earth’s axial tilt, sunlight angles, and seasons.' },
    ],
  },
  {
    name: 'Everyday Objects & Engineering',
    icon: 'Wrench',
    topics: [
      { id: 'microwave', title: 'How Does a Microwave Oven Heat Food?', prompt: 'How do microwave ovens work? Explain electromagnetic wave frequencies and water molecule excitation.' },
      { id: 'refrigerator', title: 'How Do Refrigerators Make Things Cold?', prompt: 'How does a refrigerator cool food using the vapor compression cycle, refrigerant liquid, and heat exchangers?' },
      { id: 'camera-sensor', title: 'How Digital Camera Sensors Capture Photos', prompt: 'How do digital camera sensors (CMOS/CCD) convert incoming light photons into digital pixels and colors?' },
      { id: 'touchscreen', title: 'How Do Capacitive Smartphone Touchscreens Work?', prompt: 'How does your phone screen know exactly where your finger touches without physical buttons?' },
    ],
  },
];
