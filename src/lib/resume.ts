// Site content, mirrored from AndrewNashCV/main.tex. When the resume changes, update this file to match.

export const skills = ['C++', 'Python', 'ROS', 'PyTorch', 'CUDA', 'GTSAM', 'Simulation', 'RL'] as const
export type Skill = (typeof skills)[number]

export interface Link {
  label: string
  href: string
}

export interface Bullet {
  head: string
  detail: string
  skills: Skill[]
  link?: Link
}

export interface Role {
  company: string
  title: string
  start: string
  end: string
  location: string
  bullets: Bullet[]
  tags: string[]
}

export interface Internship {
  company: string
  role: string
  dates: string
  summary: string
  tags: string[]
}

export interface Project {
  name: string
  kicker: string
  when: string
  points: string[]
  tags: string[]
  skills: Skill[]
  links: Link[]
}

export const profile = {
  name: 'Andrew Nash',
  title: 'Staff ADS Engineer',
  company: 'Aurrigo',
  focus: ['Simulation', 'Localization', 'Planning', 'Perception'],
  summary:
    "I'm a self-driving tech lead and the core author of a Transport Canada-authorized SAE Level 4 autonomy stack: simulation, sensor fusion and localization, motion planning, and machine learning perception.",
  location: 'Ottawa, Canada · open to relocation',
  email: 'anash1324@gmail.com',
  github: 'https://github.com/andrewnash',
  linkedin: 'https://www.linkedin.com/in/andrewnashnl/',
  resume: '/Andrew_Nash_Resume.pdf'
}

export const stats = [
  { value: '83.4 mAP', label: 'camera-LiDAR 3D detection @ 20 Hz' },
  { value: '5 cm', label: 'lateral localization accuracy' },
  { value: '50x', label: 'airport digital twin vs CARLA' }
]

export const roles: Role[] = [
  {
    company: 'Aurrigo',
    title: 'Staff ADS Engineer – Autonomy Lead',
    start: 'Oct 2025',
    end: 'Present',
    location: 'Ottawa, Canada',
    bullets: [
      {
        head: "Led autonomy for Canada's first medium-speed autonomous shuttle",
        detail: 'Team of 6. Core author and code owner of two $1M+ production deployments.',
        skills: ['ROS', 'C++'],
        link: {
          label: 'press',
          href: 'https://www.ctvnews.ca/ottawa/article/autonomous-shuttle-bus-rolls-out-at-kanata-tech-park'
        }
      },
      {
        head: 'Built an airport digital twin 50x faster than CARLA',
        detail:
          "Real-time aircraft turnaround with vehicles, people and baggage. Every AV sensor simulated in CUDA, with LiDAR 6x faster than NVIDIA's renderer on the same GPU.",
        skills: ['Simulation', 'CUDA', 'C++']
      },
      {
        head: 'Authored production localization at 5 cm lateral accuracy',
        detail: 'Real-time GNSS, LiDAR and IMU sensor fusion, live at 5 sites on 4 vehicle platforms.',
        skills: ['GTSAM', 'C++']
      },
      {
        head: 'Authored a CUDA LiDAR perception pipeline',
        detail: 'Occupancy mapping, SLAM and obstacle clustering in real time: 5 ms per scan on 0.1 CPU core.',
        skills: ['CUDA', 'C++']
      },
      {
        head: 'Shipped camera-LiDAR 3D object detection at 83.4 mAP @ 20 Hz',
        detail:
          'Trained in PyTorch, deployed as TensorRT inference on the vehicle with an ISO 26262 redundant safety channel.',
        skills: ['PyTorch', 'CUDA']
      },
      {
        head: 'Architected the fleet dashboard',
        detail: 'Real-time WebGPU rendering of HD maps, live sensors, plans and vehicle views at a steady 60 FPS.',
        skills: []
      }
    ],
    tags: ['ROS', 'C++', 'Python', 'CUDA', 'PyTorch', 'TensorRT', 'GTSAM', 'Linux']
  },
  {
    company: 'Aurrigo',
    title: 'ADS Team Lead, North America',
    start: 'Oct 2023',
    end: 'Oct 2025',
    location: 'Ottawa, Canada',
    bullets: [
      {
        head: 'Solo-authored LiDAR SLAM and mapping for 50+ km/h autonomy',
        detail: 'C++ GTSAM factor graph built on GLIM, fusing LiDAR, IMU and GPS.',
        skills: ['GTSAM', 'C++', 'CUDA']
      },
      {
        head: 'Authored real-time C++ motion planning and control',
        detail: '400+ candidate trajectories at 50 Hz, selecting the smoothest safe path.',
        skills: ['ROS', 'C++']
      },
      {
        head: "Built Aurrigo's first AV simulator in Unreal Engine",
        detail: '1,000s of safety cases for airport customers.',
        skills: ['Simulation']
      }
    ],
    tags: ['ROS', 'C++', 'Python', 'GTSAM', 'SLAM', 'Unreal Engine', 'CI/CD']
  }
]

export const internships: Internship[] = [
  {
    company: 'Nasdaq (Verafin)',
    role: 'Machine Learning Engineer',
    dates: 'May – Aug 2021',
    summary: 'Lifted gradient-boosting fraud-detection model precision by 6 pp at fixed recall.',
    tags: ['Python', 'XGBoost', 'LightGBM', 'AWS']
  },
  {
    company: 'Bank of Canada',
    role: 'Data Science Developer',
    dates: 'Sept 2020 – Apr 2021',
    summary: 'Built anomaly-detection models automating economist data-review workflows.',
    tags: ['Python', 'Scikit-Learn', 'Tableau']
  },
  {
    company: 'IBM',
    role: 'NLP Developer',
    dates: 'Jan – Apr 2020',
    summary: 'Improved enterprise semantic matching by 8% via weighted word embeddings.',
    tags: ['Python', 'NLP', 'Keras', 'Kubernetes']
  },
  {
    company: 'Royal Bank of Canada',
    role: 'Full Stack Data Scientist',
    dates: 'May – Aug 2019',
    summary: 'Built a full-stack semantic search prototype with an NLP backend and web frontend.',
    tags: ['Python', 'BERT', 'Flask', 'React']
  },
  {
    company: 'BlackBerry QNX',
    role: 'NLP Developer',
    dates: 'Sept – Dec 2018',
    summary: 'Applied NLP classifiers to automate software-license tagging across QNX repos.',
    tags: ['Python', 'NLP', 'FastText', 'Docker']
  }
]

export const projects: Project[] = [
  {
    name: 'Sage',
    kicker: 'Real-time D&D AI co-pilot',
    when: 'Side project',
    points: [
      'Live voice agent: per-player streaming speech-to-text, an LLM over 53 MCP tools and hybrid RAG.',
      'Distilled a 66M DistilBERT gate from the LLM that decides when to speak, in 70 ms on CPU.',
      'Fine-tuned Qwen LoRAs from 1.7B to 27B to frontier-API card quality.'
    ],
    tags: ['PyTorch', 'LLM', 'LoRA', 'RAG', 'MCP', 'FastAPI'],
    skills: ['Python', 'PyTorch'],
    links: [
      { label: 'realtime voice', href: '/sage-realtime-voice/' },
      { label: 'distillation', href: '/sage-distilbert-gate/' },
      { label: 'fine-tuning', href: '/sage-finetune-vs-api/' }
    ]
  },
  {
    name: 'IGVC',
    kicker: 'Autonomous vehicle competition',
    when: '2023',
    points: ['Trained custom transformer BEV prediction models from Unreal Engine data.', 'Design placed 2nd internationally.'],
    tags: ['ROS', 'Unreal Engine', 'C++', 'PyTorch'],
    skills: ['ROS', 'C++', 'PyTorch', 'Simulation'],
    links: [{ label: 'write-up', href: '/igvc/' }]
  },
  {
    name: 'SR AUV',
    kicker: 'Autonomous underwater vehicle',
    when: '2021',
    points: ['Real-world tested, flying end-to-end autonomously using PPO RL.', 'Awarded best 2021 capstone project.'],
    tags: ['Unity', 'C#', 'TensorFlow', 'TPU', 'RL'],
    skills: ['RL', 'Simulation'],
    links: [{ label: 'write-up', href: '/srauv/' }]
  },
  {
    name: 'SpaceX Hyperloop',
    kicker: 'Pod competition',
    when: '2019',
    points: ['Top 2.6% worldwide, 3rd in North America. Built full-stack pod telemetry.'],
    tags: ['C++', 'Flask', 'JS', 'Protobuf', 'CAN'],
    skills: ['C++'],
    links: []
  }
]

export const publications = [
  {
    title: "Herd's Eye View",
    venue: 'AIIDE-2023',
    when: '2023',
    summary: 'Improving game-AI agent learning with collaborative perception. MSc thesis.',
    tags: ['Unity', 'RL', 'Transformer', 'PyTorch'],
    skills: ['RL', 'PyTorch'] as Skill[],
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2306.06544' },
      { label: 'write-up', href: '/hev/' }
    ]
  }
]

export const education = [
  {
    degree: 'MSc Computer Science (Thesis)',
    school: 'Memorial University of Newfoundland',
    when: '2021 – 2023',
    note: "4.0 GPA. Thesis: Herd's Eye View (AIIDE-2023)."
  },
  {
    degree: 'BEng Computer Engineering (Co-op)',
    school: 'Memorial University of Newfoundland',
    when: '2016 – 2021',
    note: 'Capstone: SR AUV, best 2021 capstone.'
  }
]
