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
  focus: ['Perception', 'Localization', 'Planning'],
  summary:
    "I shipped Canada's first medium-speed SAE L4 shuttle, Transport Canada-authorized. Full-stack AV and robotics: machine-learning perception, factor-graph localization, real-time motion planning. Tech lead and code owner of the production stack.",
  location: 'Ottawa, Canada · open to relocation',
  email: 'anash1324@gmail.com',
  github: 'https://github.com/andrewnash',
  linkedin: 'https://www.linkedin.com/in/andrewnashnl/',
  resume: '/Andrew_Nash_Resume.pdf'
}

export const stats = [
  { value: '83.4 mAP', label: 'camera+LiDAR 3D detection @ 20 Hz' },
  { value: '0.5 → 0.05 m', label: 'lateral error, GTSAM sensor fusion' },
  { value: '50x', label: 'simulator speedup vs CARLA' }
]

export const roles: Role[] = [
  {
    company: 'Aurrigo',
    title: 'Staff ADS Engineer',
    start: 'Oct 2025',
    end: 'Present',
    location: 'Ottawa, Canada',
    bullets: [
      {
        head: 'Tech lead of 6 engineers',
        detail:
          'Across navigation, perception, localization and planning. Code owner of two $1M+ production deployments.',
        skills: []
      },
      {
        head: "Built navigation, perception, localization and calibration for Canada's first medium-speed SAE L4 shuttle",
        detail: 'Transport Canada-authorized.',
        skills: ['ROS', 'C++'],
        link: {
          label: 'press',
          href: 'https://www.autonomousvehicleinternational.com/news/mobility-solutions/aurrigo-debuts-winter-ready-autonomous-shuttle-in-canada.html'
        }
      },
      {
        head: 'Shipped PyTorch camera+LiDAR 3D detection + tracking at 83.4 mAP @ 20 Hz',
        detail: 'Paired with a classical safety channel for ISO 26262 diverse redundancy.',
        skills: ['PyTorch', 'Python', 'CUDA']
      },
      {
        head: 'Built a real-time ROS C++ Frenet motion planner',
        detail: 'Replaced legacy PID: 400+ parallel trajectories at 50 Hz, jerk-optimal selection against perception.',
        skills: ['ROS', 'C++']
      },
      {
        head: 'Cut lateral error 10x (0.5 m to 0.05 m), more than doubled top speed (15 to 35 km/h)',
        detail:
          'Custom GTSAM factors with dynamic GPS/LiDAR/IMU sensor fusion. Unlocked tunnel and GPS-denied terminals.',
        skills: ['GTSAM', 'C++']
      },
      {
        head: "Authored Aurrigo's end-to-end Python labelling data pipeline",
        detail: 'Annotation tool + auto-labeller lifting 2D foundation models to 3D LiDAR.',
        skills: ['Python', 'PyTorch']
      }
    ],
    tags: ['ROS', 'C++', 'PyTorch', 'CUDA', 'TensorRT', 'Git', 'Computer Vision']
  },
  {
    company: 'Aurrigo',
    title: 'ADS Team Lead, North America',
    start: 'Oct 2023',
    end: 'Oct 2025',
    location: 'Ottawa, Canada',
    bullets: [
      {
        head: "Led Aurrigo's first AV simulator from scratch",
        detail: '1000s of scenarios proving airport-customer safety. 50x speedup vs CARLA, faster than real time.',
        skills: ['Simulation', 'C++']
      },
      {
        head: "Solo-authored Aurrigo's C++ GTSAM iSAM2 SLAM and mapping",
        detail: 'glim-based GPU factor graph on gtsam_points. GPS-aligned LiDAR maps from all sensors.',
        skills: ['C++', 'GTSAM', 'CUDA']
      },
      {
        head: 'Doubled top autonomous speed (25 to 50+ km/h)',
        detail:
          '27x CUDA VGICP scan-match speedup, multi-LiDAR at 20 Hz, and custom Ackermann + crab-steer kinematic factors, on the same embedded hardware.',
        skills: ['CUDA', 'GTSAM', 'C++']
      }
    ],
    tags: ['ROS', 'C++', 'Python', 'GTSAM', 'UE4', 'CI/CD', 'Linux', 'Bash']
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
      'Streaming audio to LLM agent at ~1 s end-to-end latency: Deepgram STT, Gemini agent loop, 20+ MCP tools.',
      'Solo-architected: 98 REST routes, hybrid RAG, Svelte 5 PWA, Docker.'
    ],
    tags: ['FastAPI', 'LLM', 'RAG', 'MCP', 'GCP'],
    skills: ['Python'],
    links: []
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
    points: ['Placed 8th at the 2019 Pod Competition. Built full-stack pod telemetry.'],
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
