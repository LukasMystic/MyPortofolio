// Curated content that the CMS does not hold yet.
//
// Your CV, experience, certifications and the project write-ups still come
// from the API (and can be edited in /admin). This file holds what the site
// needs to say first and say precisely: the one-line positioning, the Apple
// Developer Academy apps, and the research highlights. Edit freely; every
// fact here is taken from the GitHub profile README.

export const profile = {
  // Hero: two short lines, nothing more.
  headline: 'Machine learning,\nmade into apps.',
  intro: 'AI engineer and iOS developer at the Apple Developer Academy.',
  role: 'AI engineer and iOS developer',
  availability: 'Open to AI/ML, data science and full-stack roles.',
  portfolioUrl: 'https://stanleypt.vercel.app',
  // Longer version, used on the About page and in meta descriptions.
  bio: 'I build machine learning systems and the software around them: the model, the API, the interface, and the thing that finally ships. Computer Science at BINUS University, Research Assistant across NLP and computer vision, and a Junior iOS Developer at the Apple Developer Academy.',
};

// Big numbers, small labels. From the GitHub profile README.
export const stats = [
  { value: 4, suffix: '+', label: 'Papers accepted' },
  { value: 3, suffix: '', label: 'Apps for iPhone and iPad' },
  { value: 100, suffix: 'K+', label: 'Samples in research datasets' },
  { value: 191, suffix: '', label: 'Learners trained' },
];

export const now = [
  { label: 'Apple Developer Academy @ BINUS', detail: 'Junior iOS Developer, Cohort 9' },
  { label: 'BINUS University', detail: 'Research Assistant in NLP, computer vision and model evaluation' },
  { label: 'Undergraduate thesis', detail: 'Detecting prompt injection from inside the model, against an adaptive attacker' },
];

// Apps from the Apple Developer Academy. `symbol` picks a glyph in components/Glyph.jsx,
// `tint` is the app-icon colour. Add `screenshot: '/images/jatayuk.png'` (put the file in
// public/images) and the card will show it instead of the icon tile.
export const academyApps = [
  {
    name: 'JataYuk',
    category: 'Education · AR',
    summary: 'An AR science lab for kids.',
    description:
      'Place the elephant-toothpaste experiment on a real table, change the yeast, peroxide and temperature, and watch the foam respond. The foam is a GPU fluid simulation (SPH) written in Metal and meshed every frame, and the app runs on a small Composable Architecture core.',
    frameworks: ['SwiftUI', 'ARKit', 'RealityKit', 'Metal'],
    url: 'https://github.com/LukasMystic/JataYuk',
    symbol: 'flask',
    tint: ['#34C759', '#248A3D'],
  },
  {
    name: 'Cubby',
    category: 'Kids · Storybook game',
    summary: 'A storybook game about consent.',
    description:
      'A page-curl storybook leads into a small world you walk with a joystick, where each character tells you how they like to be greeted.',
    frameworks: ['SwiftUI', 'SpriteKit', 'AVFoundation', 'TipKit'],
    url: 'https://github.com/LukasMystic/Cubby',
    symbol: 'book',
    tint: ['#FF9F0A', '#C93400'],
  },
  {
    name: 'Zen Buddy',
    category: 'AR · Voice',
    summary: 'An AR dog that responds to your voice.',
    description:
      'Say sit, shake, roll over or play dead. On-device speech recognition triggers the matching animation, with barks timed to each move.',
    frameworks: ['SwiftUI', 'RealityKit', 'ARKit', 'Speech'],
    url: 'https://github.com/LukasMystic/Zen-Buddy',
    symbol: 'pawprint',
    tint: ['#5E5CE6', '#3634A3'],
  },
];

export const research = [
  {
    title: 'Prompt-injection detection from hidden states',
    venue: 'Undergraduate thesis',
    description:
      "Catching prompt injection by reading an LLM's own hidden states during the forward pass it already runs. Every version is pre-registered and evaluated against an adaptive attacker, with attack success checked on real generations.",
    stack: 'PyTorch · Transformers · Llama 3 · Qwen3',
    url: 'https://github.com/LukasMystic/MSLSAM',
  },
  {
    title: 'Poverty clusters across Java’s regencies',
    venue: 'ICoDiT 2026 · Springer CCIS · two papers',
    description:
      'How the choice of spatial neighbours and permutation count changes which poverty clusters you find. Every table reproduces byte for byte from one script.',
    stack: 'R · spatial statistics',
    url: 'https://github.com/LukasMystic/java-poverty-lisa-sensitivity',
  },
  {
    title: 'Stacking ensembles for sentiment analysis',
    venue: 'ICCSCI 2025 · Elsevier',
    description: 'Research I led: a stacking ensemble that raises decision-tree accuracy on sentiment classification.',
    stack: 'scikit-learn · TF-IDF · SMOTE',
    url: 'https://www.sciencedirect.com/science/article/pii/S1877050925027139',
  },
  {
    title: 'Building damage from satellite imagery',
    venue: 'Doctoral research team',
    description: 'Post-disaster segmentation and damage classification on Maxar imagery. 95.3% peak footprint accuracy.',
    stack: 'TensorFlow · U-Net · Attention · SAM',
  },
];

export const tools = [
  {
    group: 'Apple platforms',
    items: ['Swift', 'SwiftUI', 'UIKit', 'ARKit', 'RealityKit', 'Metal', 'SpriteKit', 'AVFoundation', 'Speech', 'Vision', 'Core Motion', 'Combine', 'TipKit', 'Xcode'],
  },
  {
    group: 'Machine learning',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Transformers', 'CLIP', 'U-Net', 'RAG'],
  },
  {
    group: 'Languages',
    items: ['Python', 'Swift', 'C', 'C#', 'Java', 'JavaScript', 'TypeScript', 'R', 'Dart', 'PHP'],
  },
  {
    group: 'Web and back end',
    items: ['React', 'Next.js', 'Node.js', 'Express', 'Django', 'FastAPI', 'Laravel', 'MongoDB', 'MySQL'],
  },
  {
    group: 'Also',
    items: ['Flutter', 'Unity', 'Arduino', 'Git', 'Figma'],
  },
];
