"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  LayoutTemplate,
  FolderOpen,
  Layers,
  CreditCard,
  ReceiptText,
  Send,
  MailCheck,
  ChartNoAxesCombined,
  PanelsTopLeft,
  LifeBuoy,
  Bell,
  ShieldCheck,
  History,
  PlugZap,
  Settings,
  ChevronsUpDown,
  Search,
  PanelLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Download,
  CalendarDays,
  Plus,
  X,
  Check,
  LogOut,
  Command,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Dashboard from "./dashboard";
import Management, {
  Plans,
  Integrations,
  Settings as SettingsPage,
  TemplateLibrary,
} from "./management";
import { Avatar, Modal, exportCSV } from "./ui";
import { users } from "@/lib/data";
const groups = [
  {
    label: "WORKSPACE",
    items: [
      ["overview", "Overview", LayoutDashboard],
      ["users", "Users", Users],
      ["workspaces", "Workspaces", Building2],
      ["templates", "Templates", LayoutTemplate],
      ["categories", "Template categories", FolderOpen],
    ],
  },
  {
    label: "BILLING & USAGE",
    items: [
      ["plans", "Subscription plans", Layers],
      ["subscriptions", "Subscriptions", CreditCard],
      ["payments", "Payments & invoices", ReceiptText],
      ["campaigns", "Email campaigns", Send],
      ["usage", "Email usage & logs", MailCheck],
      ["analytics", "Analytics & revenue", ChartNoAxesCombined],
    ],
  },
  {
    label: "PLATFORM",
    items: [
      ["cms", "Website CMS", PanelsTopLeft],
      ["support", "Support tickets", LifeBuoy],
      ["notifications", "Notifications", Bell],
      ["roles", "Admin users & roles", ShieldCheck],
      ["audit", "Audit logs", History],
      ["integrations", "Integrations", PlugZap],
      ["settings", "System settings", Settings],
    ],
  },
] as const;
const descriptions: Record<string, string> = {
  overview: "A clear picture of your platform. All in one place.",
  users: "Manage your community and help every customer thrive.",
  workspaces: "A home for every team, brand, and big idea.",
  templates: "Beautiful emails start with a thoughtful template.",
  categories: "Keep your template library organized and easy to explore.",
  plans: "The right features, at the right price.",
  subscriptions: "Keep track of your customers’ subscription journeys.",
  payments: "A clear view of every payment and invoice.",
  campaigns: "Every campaign, from the first draft to the final delivery.",
  usage: "Understand your email volume and delivery performance.",
  analytics: "Turn platform activity into a clearer picture of growth.",
  cms: "Keep your website fresh, relevant, and distinctly yours.",
  support: "A little help goes a long way.",
  notifications: "Stay in the loop with your platform.",
  roles: "The right access for the people behind your platform.",
  audit: "A transparent history of administrative activity.",
  integrations: "All the services that keep your platform moving.",
  settings: "Make Postcraft work your way.",
};
export default function AdminApp() {
  const path = usePathname();
  const router = useRouter();
  const section = path.split("/")[1] || "overview";
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [range, setRange] = useState("Last 30 days");
  const [toast, setToast] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [quick, setQuick] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const nav = groups.flatMap((g) => [...g.items]);
  const title = nav.find((n) => n[0] === section)?.[1] || "Page not found";
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobile(false);
        setProfile(false);
        setNotifications(false);
        setQuick(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  if (signedOut)
    return (
      <div className="login-page">
        <div className="card login-card">
          <div className="brand">
            <span className="brand-mark">
              <Send size={24} />
            </span>
            postcraft<span className="brand-period">.</span>
          </div>
          <span className="eyebrow">ADMIN WORKSPACE</span>
          <h1>Welcome back.</h1>
          <p>
            Explore the Postcraft administration demo. No account or password is
            required.
          </p>
          <button
            className="button primary"
            onClick={() => setSignedOut(false)}
          >
            Enter demo workspace <ArrowUpRight size={16} />
          </button>
          <small>Static demonstration · No live account access</small>
        </div>
      </div>
    );
  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      {mobile && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Send size={22} />
          </span>
          <span className="brand-name">
            postcraft<span className="brand-period">.</span>
          </span>
        </Link>
        <div className="workspace-switch">
          <div className="workspace-logo">
            <Layers size={17} />
          </div>
          <div>
            <strong>Admin workspace</strong>
            <span>
              Super Admin <i>DEMO</i>
            </span>
          </div>
          <ChevronsUpDown size={14} />
        </div>
        <nav>
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map(([id, label, Icon]) => (
                <Link
                  href={id === "overview" ? "/" : `/${id}`}
                  className={`nav-item ${section === id ? "active" : ""}`}
                  key={id}
                  title={label}
                  onClick={() => setMobile(false)}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {id === "support" && <b className="nav-count">8</b>}
                  {id === "overview" && <i className="nav-active-dot" />}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box">
            <span>
              <Sparkles size={15} />A little help?
            </span>
            <p>Everything you need to get going.</p>
            <button
              onClick={() => {
                router.push("/support");
                setMobile(false);
              }}
            >
              Visit help center <ArrowUpRight size={13} />
            </button>
          </div>
          <button
            className="sidebar-profile"
            onClick={() => setProfile(!profile)}
          >
            <Avatar name="Alex Morgan" />
            <span>
              <strong>Alex Morgan</strong>
              <small>Super Admin</small>
            </span>
            <ChevronsUpDown size={15} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button desktop-toggle"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeft size={18} />
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <PanelLeft size={18} />
            </button>
            <span className="breadcrumb-divider" />
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="global-search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </button>
            <Link className="visit-site" href="/cms">
              View website <ExternalLink size={13} />
            </Link>
            <div className="popover-anchor">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                <i />
              </button>
              {notifications && (
                <div className="popover notifications-popover">
                  <h3>
                    Notifications <span className="demo-label">DEMO</span>
                  </h3>
                  <p>A new Business subscription</p>
                  <small>Phoenix Baker · 2 minutes ago</small>
                  <hr />
                  <p>Payment needs your attention</p>
                  <small>Invoice #INV-2030 · 42 minutes ago</small>
                  <Link
                    href="/notifications"
                    onClick={() => setNotifications(false)}
                  >
                    View all notifications <ArrowUpRight size={13} />
                  </Link>
                </div>
              )}
            </div>
            <button
              className="profile-trigger"
              aria-label="Admin profile"
              onClick={() => setProfile(!profile)}
            >
              <Avatar name="Alex Morgan" />
            </button>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                YOUR PLATFORM, AT A GLANCE{" "}
                <span className="demo-label">DEMO DATA</span>
              </div>
              <h1>
                {title}
                {section === "overview" && (
                  <span className="heading-dot">.</span>
                )}
              </h1>
              <p>
                {descriptions[section] ||
                  "Choose a page from the sidebar to continue."}
              </p>
            </div>
            <div className="heading-actions">
              {["overview", "analytics"].includes(section) ? (
                <>
                  <div className="date-select">
                    <CalendarDays size={15} />
                    <select
                      aria-label="Reporting date range"
                      value={range}
                      onChange={(e) => setRange(e.target.value)}
                    >
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  <button
                    className="button"
                    onClick={() => {
                      exportCSV("platform-report", [
                        {
                          metric: "Total users",
                          value: 24892,
                          source: "Demo fixture",
                        },
                        {
                          metric: "Estimated MRR INR",
                          value: 428590,
                          source: "Demo fixture",
                        },
                        {
                          metric: "Active subscriptions",
                          value: 3842,
                          source: "Demo fixture",
                        },
                      ]);
                      setToast("Sample platform report exported.");
                    }}
                  >
                    <Download size={15} />
                    Export report
                  </button>
                </>
              ) : null}
              <div className="popover-anchor">
                <button
                  className="button primary"
                  onClick={() => setQuick(!quick)}
                >
                  <Plus size={16} />
                  Quick actions
                  <ChevronDown size={13} />
                </button>
                {quick && (
                  <div className="popover quick-popover">
                    {[
                      ["Browse templates", "templates"],
                      ["Manage customers", "users"],
                      ["Configure a plan", "plans"],
                      ["Review support tickets", "support"],
                    ].map(([label, href]) => (
                      <Link
                        key={href}
                        href={`/${href}`}
                        onClick={() => setQuick(false)}
                      >
                        {label}
                        <ArrowUpRight size={13} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {section === "overview" || section === "analytics" ? (
            <>
              <Dashboard range={range} />
              {section === "analytics" && (
                <div className="card metric-definitions">
                  <h2>About these demo metrics</h2>
                  <p>
                    MRR is the monthly-normalized value of active recurring
                    subscriptions. Revenue is collected eligible payments,
                    excluding failed and refunded payments. Provider spending
                    and profit are unavailable. All figures here are
                    illustrative fixtures.
                  </p>
                </div>
              )}
            </>
          ) : section === "plans" ? (
            <Plans notify={setToast} />
          ) : section === "integrations" ? (
            <Integrations notify={setToast} />
          ) : section === "settings" ? (
            <SettingsPage notify={setToast} />
          ) : section === "templates" ? (
            <TemplateLibrary notify={setToast} />
          ) : nav.some((n) => n[0] === section) ? (
            <Management key={section} section={section} notify={setToast} />
          ) : (
            <Link className="button" href="/">
              Back to overview
            </Link>
          )}
        </main>
      </div>
      {profile && (
        <div className="profile-popover popover">
          <Avatar name="Alex Morgan" />
          <h3>Alex Morgan</h3>
          <p>alex@postcraft.com</p>
          <span className="demo-label">SUPER ADMIN · DEMO SESSION</span>
          <hr />
          <Link href="/settings" onClick={() => setProfile(false)}>
            <Settings size={15} />
            Workspace settings
          </Link>
          <button
            onClick={() => {
              setProfile(false);
              setSignedOut(true);
            }}
          >
            <LogOut size={15} />
            Leave demo
          </button>
        </div>
      )}
      {searchOpen && (
        <Modal
          title="Search your workspace"
          onClose={() => setSearchOpen(false)}
        >
          <div className="input-search modal-search">
            <Search size={18} />
            <input
              autoFocus
              placeholder="Find a page or customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Command size={14} />
          </div>
          <div className="search-results">
            {nav
              .filter(([, label]) =>
                label.toLowerCase().includes(query.toLowerCase()),
              )
              .map(([id, label, Icon]) => (
                <Link
                  key={id}
                  href={`/${id === "overview" ? "" : id}`}
                  onClick={() => setSearchOpen(false)}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  <ChevronRight size={14} />
                </Link>
              ))}
            {query &&
              users
                .filter((u) =>
                  (u.name + " " + u.email)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((u) => (
                  <Link
                    key={u.id}
                    href={`/users?search=${encodeURIComponent(u.name)}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Users size={17} />
                    <span>
                      {u.name}
                      <small>{u.email}</small>
                    </span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
