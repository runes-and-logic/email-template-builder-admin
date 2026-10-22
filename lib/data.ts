export type RecordItem = {
  id: string;
  name: string;
  email?: string;
  plan?: string;
  status: string;
  date: string;
  detail: string;
  amount?: string;
};
export const users: RecordItem[] = [
  {
    id: "USR-1024",
    name: "Olivia Rhye",
    email: "olivia@acme.com",
    plan: "Pro",
    status: "Active",
    date: "Oct 22, 2026",
    detail: "Acme Studio",
  },
  {
    id: "USR-1023",
    name: "Phoenix Baker",
    email: "phoenix@layers.design",
    plan: "Business",
    status: "Active",
    date: "Oct 22, 2026",
    detail: "Layers",
  },
  {
    id: "USR-1022",
    name: "Lana Steiner",
    email: "lana@sisyphus.com",
    plan: "Free",
    status: "Active",
    date: "Oct 21, 2026",
    detail: "Sisyphus",
  },
  {
    id: "USR-1021",
    name: "Demi Wilkinson",
    email: "demi@catalog.studio",
    plan: "Starter",
    status: "Active",
    date: "Oct 21, 2026",
    detail: "Catalog",
  },
  {
    id: "USR-1020",
    name: "Drew Cano",
    email: "drew@circooles.com",
    plan: "Pro",
    status: "Suspended",
    date: "Oct 20, 2026",
    detail: "Circooles",
  },
  {
    id: "USR-1019",
    name: "Natali Craig",
    email: "natali@hourglass.app",
    plan: "Business",
    status: "Active",
    date: "Oct 19, 2026",
    detail: "Hourglass",
  },
  {
    id: "USR-1018",
    name: "Andi Lane",
    email: "andi@quotient.co",
    plan: "Free",
    status: "Active",
    date: "Oct 18, 2026",
    detail: "Quotient",
  },
];
export const templates = [
  {
    id: "TPL-001",
    name: "The Sunday Edit",
    category: "Newsletter",
    brand: "THE SUNDAY EDIT",
    headline: "A little inspiration.\nA fresh perspective.",
    color: "peach",
    uses: "2,840",
    status: "Published",
  },
  {
    id: "TPL-002",
    name: "New season essentials",
    category: "E-commerce",
    brand: "FORM & FIELD",
    headline: "Less, but\nbetter.",
    color: "sage",
    uses: "2,156",
    status: "Published",
  },
  {
    id: "TPL-003",
    name: "Welcome aboard",
    category: "Welcome email",
    brand: "layers",
    headline: "Good things\nstart here.",
    color: "lavender",
    uses: "1,932",
    status: "Published",
  },
  {
    id: "TPL-004",
    name: "Product launch",
    category: "Marketing",
    brand: "OFFSCRIPT",
    headline: "Meet your\nnext favorite.",
    color: "sand",
    uses: "1,624",
    status: "Draft",
  },
];
export const series = [
  12, 18, 14, 25, 21, 23, 34, 26, 31, 29, 41, 35, 39, 33, 45, 40, 47, 42, 53,
  46, 55, 50, 59, 53, 62, 56, 67, 61, 72, 68,
].map((v, i) => ({
  day: i + 1,
  current: v * 1000,
  previous: (v * 0.64 + Math.sin(i) * 5) * 1000,
  users: Math.round(v * 2.8),
}));
export const plans = [
  {
    name: "Free",
    price: 0,
    description: "The essentials to get started",
    features: [
      "10 saved templates",
      "3 HTML exports / month",
      "Basic template library",
      "1 workspace seat",
    ],
  },
  {
    name: "Starter",
    price: 299,
    description: "For growing creators",
    features: [
      "50 saved templates",
      "50 HTML exports / month",
      "Custom brand colors",
      "100 test emails / month",
    ],
  },
  {
    name: "Pro",
    price: 799,
    description: "Everything for ambitious teams",
    features: [
      "Unlimited templates",
      "Unlimited HTML exports",
      "Premium template library",
      "Version history & analytics",
    ],
  },
  {
    name: "Business",
    price: 1999,
    description: "Built for collaboration at scale",
    features: [
      "Everything in Pro",
      "5 team seats",
      "Multiple workspaces",
      "API access & priority support",
    ],
  },
];
export function recordsFor(section: string): RecordItem[] {
  if (section === "users") return users;
  if (section === "workspaces")
    return users.map((u, i) => ({
      ...u,
      id: `WS-${100 + i}`,
      name: u.detail,
      detail: `${i + 1} members · ${12 + i * 7} templates`,
    }));
  if (section === "subscriptions")
    return users.map((u, i) => ({
      ...u,
      id: `SUB-${2050 + i}`,
      name: u.name,
      detail: "Monthly · Renews Nov 22, 2026",
      status: i === 4 ? "Past due" : "Active",
      amount: u.plan === "Business" ? "₹1,999" : "₹799",
    }));
  if (section === "payments")
    return users.map((u, i) => ({
      ...u,
      id: `INV-${2026 + i}`,
      name: u.name,
      detail: "Razorpay · UPI",
      status: i === 4 ? "Failed" : "Paid",
      amount: u.plan === "Business" ? "₹1,999" : "₹799",
    }));
  if (section === "campaigns")
    return [
      "October newsletter",
      "Your next favorite is here",
      "Welcome to the family",
      "The weekend edit",
      "A little something for you",
      "Fall collection launch",
    ].map((name, i) => ({
      id: `CAM-${300 + i}`,
      name,
      status: ["Completed", "Scheduled", "Sending", "Draft"][i % 4],
      detail: `${users[i].detail} · ${1200 + i * 342} recipients`,
      date: "Oct 22, 2026",
    }));
  if (section === "usage")
    return [
      "Delivered",
      "Accepted",
      "Delivered",
      "Bounced",
      "Failed",
      "Delivered",
      "Opened",
    ].map((status, i) => ({
      id: `MSG-${87521 + i}`,
      name: `October newsletter #${i + 1}`,
      status,
      detail: `Resend · ${users[i].detail}`,
      date: "Oct 22, 2026",
    }));
  if (section === "categories")
    return [
      "Marketing",
      "E-commerce",
      "Welcome Emails",
      "Transactional",
      "Newsletters",
      "Education",
      "Events",
    ].map((name, i) => ({
      id: `CAT-${i + 1}`,
      name,
      status: "Active",
      detail: `${24 + i * 8} templates · /${name.toLowerCase().replaceAll(" ", "-")}`,
      date: "Oct 20, 2026",
    }));
  if (section === "cms")
    return [
      "Homepage hero",
      "Why Postcraft",
      "Customer stories",
      "Frequently asked questions",
      "Privacy policy",
      "October changelog",
    ].map((name, i) => ({
      id: `CMS-${i + 1}`,
      name,
      status: i === 5 ? "Draft" : "Published",
      detail: [
        "Homepage",
        "Features",
        "Testimonials",
        "FAQ",
        "Legal",
        "Announcements",
      ][i],
      date: "Oct 20, 2026",
    }));
  if (section === "support")
    return [
      "Need help with HTML export",
      "Invoice billing address update",
      "Adding a team member",
      "Template rendering in Outlook",
      "How do I upgrade my plan?",
    ].map((name, i) => ({
      id: `TKT-${1042 + i}`,
      name,
      status: ["Open", "In progress", "Waiting for customer", "Resolved"][
        i % 4
      ],
      detail: `${users[i].name} · ${i === 0 ? "High" : "Normal"} priority`,
      date: "Oct 22, 2026",
    }));
  if (section === "roles")
    return [
      {
        id: "ADM-01",
        name: "Alex Morgan",
        email: "alex@postcraft.com",
        status: "Active",
        detail: "Super Admin",
        date: "Jan 02, 2026",
      },
      {
        id: "ADM-02",
        name: "Sarah Chen",
        email: "sarah@postcraft.com",
        status: "Active",
        detail: "Support Admin",
        date: "Mar 14, 2026",
      },
      {
        id: "ADM-03",
        name: "James Wilson",
        email: "james@postcraft.com",
        status: "Active",
        detail: "Billing Admin",
        date: "Apr 02, 2026",
      },
    ];
  if (section === "audit")
    return [
      "Template published",
      "Plan updated",
      "User reactivated",
      "Workspace reviewed",
      "Settings updated",
    ].map((name, i) => ({
      id: `AUD-${991 + i}`,
      name,
      status: "Success",
      detail: `Alex Morgan · ${["TPL-001", "PLAN-Pro", "USR-1020", "WS-102", "SET-001"][i]}`,
      date: "Oct 22, 2026",
    }));
  return [
    "Your weekly platform summary is ready",
    "A new Business subscription",
    "Payment needs your attention",
    "New support ticket received",
  ].map((name, i) => ({
    id: `NTF-${i}`,
    name,
    status: i === 0 ? "Unread" : "Read",
    detail: "Platform notification",
    date: "Oct 22, 2026",
  }));
}
