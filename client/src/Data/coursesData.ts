export interface Course {
  id: number;
  title: string;
  price: string;
  duration: string;
  reviews: string;
  students: string;
  image: string;
  description: string;
  outline: string[];
}

export const coursesData: Course[] = [
  {
    id: 1,
    title: "The Complete Figma Masterclass",
    price: "$99",
    duration: "4 Weeks",
    reviews: "120+",
    students: "1.5k+",
    image: "https://picsum.photos/seed/course1/800/600",
    description: "Master the industry-leading design tool. From basic shapes to advanced prototyping and design systems.",
    outline: ["Introduction to Figma Interface", "Vector Networks & Pen Tool", "Auto Layout Mastery", "Components & Variants", "Prototyping & Micro-interactions", "Design Systems", "Handoff to Developers"]
  },
  {
    id: 2,
    title: "Advanced Digital Marketing",
    price: "$129",
    duration: "6 Weeks",
    reviews: "150+",
    students: "2.1k+",
    image: "https://picsum.photos/seed/course2/800/600",
    description: "Learn to scale businesses using SEO, SEM, Social Media strategies, and Analytics.",
    outline: ["Marketing Fundamentals", "SEO & Content Strategy", "Social Media Advertising (FB/Insta)", "Google Ads & PPC", "Email Marketing Automation", "Analytics & Reporting"]
  },
  {
    id: 3,
    title: "UI/UX & Web Design Principles",
    price: "$99",
    duration: "5 Weeks",
    reviews: "95+",
    students: "1.1k+",
    image: "https://picsum.photos/seed/course3/800/600",
    description: "Understand the psychology behind great design and how to build user-centric interfaces.",
    outline: ["User Research Methods", "User Personas & Journey Maps", "Wireframing & Lo-Fi Prototyping", "Visual Hierarchy & Typography", "Color Theory", "Usability Testing"]
  },
  {
    id: 4,
    title: "Brand Identity & Logo Design",
    price: "$149",
    duration: "8 Weeks",
    reviews: "85+",
    students: "800+",
    image: "https://picsum.photos/seed/course4/800/600",
    description: "Create memorable brands. Learn the process of logo design from concept to final presentation.",
    outline: ["Brand Strategy Fundamentals", "Mind Mapping & Sketching", "Adobe Illustrator Mastery", "Logo Types & Typography", "Color Psychology", "Brand Guidelines Creation", "Client Presentation"]
  },
  {
    id: 5,
    title: "Motion Graphics with After Effects",
    price: "$119",
    duration: "6 Weeks",
    reviews: "210+",
    students: "3.5k+",
    image: "https://picsum.photos/seed/course5/800/600",
    description: "Bring your designs to life. Learn keyframes, easing, and advanced motion techniques.",
    outline: ["After Effects Interface", "Keyframes & Easing", "Masking & Rotoscoping", "3D Layers & Camera", "Text Animation", "Character Rigging Basics", "Rendering & Exporting"]
  }
];