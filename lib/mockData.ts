// Mock project data for demo
export interface Project {
  id: number;
  name: string;
  description: string;
  creator: string;
  creatorAddress: string;
  category: string;
  clonePrice: string; // "0" = free clone, otherwise paid
  productionFee: string; // revenue per unit produced
  totalClones: number;
  totalProduced: number;
  stars: number;
  tags: string[];
  image: string;
  files: string[];
  createdAt: string;
  // Revenue model type
  revenueModel: "sales" | "usage"; // sales = hardware sales, usage = DePIN usage share
  // Revenue history for chart
  revenueHistory: { month: string; amount: number }[];
  // On-chain project ID (0 = not deployed yet)
  onChainId: number;
  // Transaction logs
  txLogs: { time: string; action: string; amount: string; txHash: string }[];
}

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Smart Watering System Pro",
    description: "Automatic watering system based on soil moisture sensor with WiFi remote control and data reporting. Perfect for home gardens and small farms.",
    creator: "AlexMaker",
    creatorAddress: "0x1234...5678",
    category: "IoT",
    clonePrice: "0",
    productionFee: "0.002",
    totalClones: 156,
    totalProduced: 1240,
    stars: 89,
    tags: ["Arduino", "ESP32", "Sensor", "Smart Home"],
    image: "🌱",
    files: ["main.ino", "pcb_design.kicad", "case_3d.stl", "BOM.xlsx"],
    createdAt: "2024-01-15",
    revenueModel: "sales",
    onChainId: 1,
    revenueHistory: [
      { month: "Jan", amount: 120 },
      { month: "Feb", amount: 280 },
      { month: "Mar", amount: 450 },
      { month: "Apr", amount: 620 },
      { month: "May", amount: 890 },
      { month: "Jun", amount: 1240 }
    ],
    txLogs: [
      { time: "2h ago", action: "Clone", amount: "0 MON", txHash: "0x1a2b...3c4d" },
      { time: "5h ago", action: "Production", amount: "0.02 MON", txHash: "0x5e6f...7g8h" },
      { time: "1d ago", action: "Clone", amount: "0 MON", txHash: "0x9i0j...1k2l" }
    ]
  },
  {
    id: 2,
    name: "EnviroMonitor Station",
    description: "All-in-one environmental monitoring device tracking temperature, humidity, PM2.5, CO2. Supports DePIN data reporting for continuous revenue.",
    creator: "EcoBuilder",
    creatorAddress: "0xabcd...efgh",
    category: "DePIN",
    clonePrice: "0.02",
    productionFee: "0.005",
    totalClones: 89,
    totalProduced: 520,
    stars: 156,
    tags: ["Environment", "DePIN", "Data", "ESP32"],
    image: "🌡️",
    files: ["firmware.cpp", "sensor_board.kicad", "enclosure.step", "datasheet.pdf"],
    createdAt: "2024-02-20",
    revenueModel: "usage",
    onChainId: 2,
    revenueHistory: [
      { month: "Jan", amount: 50 },
      { month: "Feb", amount: 180 },
      { month: "Mar", amount: 420 },
      { month: "Apr", amount: 780 },
      { month: "May", amount: 1200 },
      { month: "Jun", amount: 1850 }
    ],
    txLogs: [
      { time: "1h ago", action: "Data Report", amount: "0.05 MON", txHash: "0xabc...def" },
      { time: "3h ago", action: "Data Report", amount: "0.03 MON", txHash: "0x123...456" },
      { time: "6h ago", action: "Clone", amount: "0.02 MON", txHash: "0x789...abc" }
    ]
  },
  {
    id: 3,
    name: "Mini 3D Printer Controller",
    description: "Open-source 3D printer mainboard compatible with Marlin firmware, supports TMC silent drivers.",
    creator: "PrinterPro",
    creatorAddress: "0x9876...5432",
    category: "3D Printing",
    clonePrice: "0",
    productionFee: "0.003",
    totalClones: 234,
    totalProduced: 890,
    stars: 201,
    tags: ["3D Printing", "STM32", "Marlin", "Open Hardware"],
    image: "🖨️",
    files: ["marlin_config.h", "motherboard.kicad", "BOM.csv", "assembly.md"],
    createdAt: "2024-03-10",
    revenueModel: "sales",
    onChainId: 3,
    revenueHistory: [
      { month: "Jan", amount: 200 },
      { month: "Feb", amount: 380 },
      { month: "Mar", amount: 520 },
      { month: "Apr", amount: 680 },
      { month: "May", amount: 790 },
      { month: "Jun", amount: 890 }
    ],
    txLogs: [
      { time: "30m ago", action: "Production", amount: "0.03 MON", txHash: "0xprod...123" },
      { time: "2h ago", action: "Clone", amount: "0 MON", txHash: "0xclone...456" }
    ]
  },
  {
    id: 4,
    name: "LoRa Gateway Node",
    description: "Low-power wide-area network gateway supporting LoRaWAN protocol. Deploy as DePIN node for network coverage rewards.",
    creator: "WirelessGeek",
    creatorAddress: "0xfedc...ba98",
    category: "DePIN",
    clonePrice: "0.025",
    productionFee: "0.008",
    totalClones: 67,
    totalProduced: 340,
    stars: 112,
    tags: ["LoRa", "DePIN", "Gateway", "IoT"],
    image: "📡",
    files: ["gateway_fw.c", "rf_board.kicad", "antenna.step", "setup_guide.pdf"],
    createdAt: "2024-04-05",
    revenueModel: "usage",
    onChainId: 4,
    revenueHistory: [
      { month: "Jan", amount: 80 },
      { month: "Feb", amount: 220 },
      { month: "Mar", amount: 450 },
      { month: "Apr", amount: 720 },
      { month: "May", amount: 1100 },
      { month: "Jun", amount: 1650 }
    ],
    txLogs: [
      { time: "15m ago", action: "Data Report", amount: "0.08 MON", txHash: "0xdata...789" },
      { time: "1h ago", action: "Data Report", amount: "0.06 MON", txHash: "0xdata...abc" }
    ]
  },
  {
    id: 5,
    name: "Mechanical Keyboard PCB",
    description: "65% layout mechanical keyboard PCB with QMK/VIA support, hot-swap sockets, RGB backlight.",
    creator: "KeyboardKing",
    creatorAddress: "0x1111...2222",
    category: "Consumer",
    clonePrice: "0",
    productionFee: "0.001",
    totalClones: 456,
    totalProduced: 2100,
    stars: 324,
    tags: ["Keyboard", "QMK", "PCB", "RGB"],
    image: "⌨️",
    files: ["qmk_config.c", "keyboard_pcb.kicad", "plate.dxf", "case.stl"],
    createdAt: "2024-05-18",
    revenueModel: "sales",
    onChainId: 5,
    revenueHistory: [
      { month: "Jan", amount: 500 },
      { month: "Feb", amount: 920 },
      { month: "Mar", amount: 1350 },
      { month: "Apr", amount: 1680 },
      { month: "May", amount: 1920 },
      { month: "Jun", amount: 2100 }
    ],
    txLogs: [
      { time: "10m ago", action: "Production", amount: "0.01 MON", txHash: "0xkb...123" },
      { time: "45m ago", action: "Production", amount: "0.02 MON", txHash: "0xkb...456" }
    ]
  },
  {
    id: 6,
    name: "Solar Charge Controller",
    description: "MPPT solar charge controller supporting 12V/24V batteries with max 20A charging current.",
    creator: "SolarEngineer",
    creatorAddress: "0x3333...4444",
    category: "Energy",
    clonePrice: "0.018",
    productionFee: "0.004",
    totalClones: 123,
    totalProduced: 670,
    stars: 98,
    tags: ["Solar", "MPPT", "Charging", "Renewable"],
    image: "☀️",
    files: ["mppt_fw.c", "power_board.kicad", "heatsink.step", "manual.pdf"],
    createdAt: "2024-06-22",
    revenueModel: "sales",
    onChainId: 6,
    revenueHistory: [
      { month: "Jan", amount: 150 },
      { month: "Feb", amount: 290 },
      { month: "Mar", amount: 410 },
      { month: "Apr", amount: 520 },
      { month: "May", amount: 610 },
      { month: "Jun", amount: 670 }
    ],
    txLogs: [
      { time: "2h ago", action: "Clone", amount: "0.018 MON", txHash: "0xsolar...789" },
      { time: "1d ago", action: "Production", amount: "0.04 MON", txHash: "0xsolar...abc" }
    ]
  }
];

export const categories = [
  { name: "All", count: 6 },
  { name: "IoT", count: 1 },
  { name: "DePIN", count: 2 },
  { name: "3D Printing", count: 1 },
  { name: "Consumer", count: 1 },
  { name: "Energy", count: 1 },
];
