"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Download,
  ArrowUpDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Check,
  PlugZap,
  CreditCard,
  Send,
  Database,
  BarChart3,
  Webhook,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { recordsFor, type RecordItem, plans, templates } from "@/lib/data";
import { Avatar, Badge, Modal, exportCSV } from "./ui";
export default function Management({
  section,
  notify,
}: {
  section: string;
  notify: (s: string) => void;
}) {
  const [rows, setRows] = useState<RecordItem[]>(() => recordsFor(section));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [reason, setReason] = useState("");
  const [reverse, setReverse] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`postcraft-v1-${section}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRows(parsed);
      }
    } catch {}
    setSearch(new URLSearchParams(window.location.search).get("search") || "");
  }, [section]);
  function save(next: RecordItem[]) {
    try {
      localStorage.setItem(`postcraft-v1-${section}`, JSON.stringify(next));
      const audit = JSON.parse(
        localStorage.getItem("postcraft-v1-audit") ||
          JSON.stringify(recordsFor("audit")),
      );
      localStorage.setItem(
        "postcraft-v1-audit",
        JSON.stringify([
          {
            id: `AUD-${Date.now()}`,
            name: `${section} updated`,
            status: "Success",
            detail: `Alex Morgan · ${reason || "Demo record saved"}`,
            date: new Date().toLocaleDateString(),
          },
          ...audit,
        ]),
      );
      setRows(next);
      notify("Demo changes saved to this browser.");
    } catch {
      notify("Could not save. Browser storage is unavailable.");
    }
  }
  const filtered = rows
    .filter(
      (r) =>
        `${r.name} ${r.email || ""} ${r.id} ${r.detail}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (filter === "All statuses" || r.status === filter),
    )
    .sort((a, b) =>
      reverse ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
    );
  const readOnly = [
    "payments",
    "subscriptions",
    "usage",
    "audit",
    "notifications",
  ].includes(section);
  return (
    <>
      <div className="card management-card">
        <div className="management-toolbar">
          <div className="input-search">
            <Search size={16} />
            <input
              aria-label="Search records"
              placeholder={`Search ${section}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Filter by status"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>All statuses</option>
            {Array.from(new Set(rows.map((r) => r.status))).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="toolbar-spacer" />
          <button
            className="button"
            onClick={() => exportCSV(section, filtered)}
          >
            <Download size={15} />
            Export
          </button>
          {!readOnly && (
            <button
              className="button primary"
              onClick={() => {
                setSelected({
                  id: `${section.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`,
                  name: "",
                  status: section === "cms" ? "Draft" : "Active",
                  date: "Oct 22, 2026",
                  detail: "",
                });
                setEditing(true);
                setReason("");
              }}
            >
              <Plus size={15} />
              Add{" "}
              {section === "categories"
                ? "category"
                : section === "cms"
                  ? "content"
                  : "record"}
            </button>
          )}
        </div>
        <div className="table-scroll">
          <table className="management-table">
            <thead>
              <tr>
                <th>
                  <button
                    className="sort-button"
                    onClick={() => setReverse(!reverse)}
                  >
                    Name <ArrowUpDown size={13} />
                  </button>
                </th>
                <th>Reference</th>
                <th>{section === "users" ? "Plan" : "Details"}</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 8, page * 8).map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <div className="person">
                      <Avatar name={r.name} index={i} />
                      <div>
                        <strong>{r.name}</strong>
                        {r.email && <small>{r.email}</small>}
                      </div>
                    </div>
                  </td>
                  <td className="muted">{r.id}</td>
                  <td>
                    {r.plan ? <Badge>{r.plan}</Badge> : r.detail}
                    {r.amount && <small className="amount">{r.amount}</small>}
                  </td>
                  <td>
                    <Badge>{r.status}</Badge>
                  </td>
                  <td className="muted">{r.date}</td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`View ${r.name}`}
                      onClick={() => {
                        setSelected(r);
                        setEditing(false);
                        setReason("");
                      }}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No matching records</h3>
              <p>Try another search or clear your filters.</p>
              <button
                className="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All statuses");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <div className="pagination">
          <span>
            Showing {filtered.length ? (page - 1) * 8 + 1 : 0}–
            {Math.min(page * 8, filtered.length)} of {filtered.length} records
          </span>
          <div>
            <button
              className="button compact"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <button
              className="button compact"
              disabled={page * 8 >= filtered.length}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <p className="demo-footnote">
        <ShieldCheck size={14} />
        Demo workspace · Sample records. Changes are stored on this device only.
      </p>
      {selected && (
        <Modal
          title={editing ? "Edit demo record" : selected.name}
          onClose={() => setSelected(null)}
        >
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save(
                  rows.some((r) => r.id === selected.id)
                    ? rows.map((r) => (r.id === selected.id ? selected : r))
                    : [selected, ...rows],
                );
                setSelected(null);
              }}
            >
              <label>
                Name
                <input
                  required
                  value={selected.name}
                  onChange={(e) =>
                    setSelected({ ...selected, name: e.target.value })
                  }
                />
              </label>
              {section === "users" && (
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={selected.email || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, email: e.target.value })
                    }
                  />
                </label>
              )}
              <label>
                {section === "cms" ? "Content (plain text)" : "Details"}
                <textarea
                  required
                  value={selected.detail}
                  onChange={(e) =>
                    setSelected({ ...selected, detail: e.target.value })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                >
                  {Array.from(
                    new Set([
                      selected.status,
                      ...(section === "cms"
                        ? ["Draft", "Published", "Archived"]
                        : section === "support"
                          ? [
                              "Open",
                              "In progress",
                              "Waiting for customer",
                              "Resolved",
                              "Closed",
                            ]
                          : ["Active", "Suspended", "Archived"]),
                    ]),
                  ).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {section === "users" && (
                <label>
                  Plan
                  <select
                    value={selected.plan || "Free"}
                    onChange={(e) =>
                      setSelected({ ...selected, plan: e.target.value })
                    }
                  >
                    {plans.map((p) => (
                      <option key={p.name}>{p.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Reason for change
                <input
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Required for the demo audit trail"
                />
              </label>
              <p className="form-note">
                Saving confirms these changes to the local demo record.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>
                <button className="button primary" type="submit">
                  Confirm and save
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="detail-grid">
                <span>Reference</span>
                <strong>{selected.id}</strong>
                <span>Status</span>
                <Badge>{selected.status}</Badge>
                <span>Details</span>
                <strong>{selected.detail}</strong>
                <span>Created</span>
                <strong>{selected.date}</strong>
                {selected.amount && (
                  <>
                    <span>Amount</span>
                    <strong>{selected.amount}</strong>
                  </>
                )}
              </div>
              <p className="form-note">
                This is a sample record. No live customer, provider, or payment
                data is connected.
              </p>
              <div className="modal-actions">
                <button className="button" onClick={() => setSelected(null)}>
                  Close
                </button>
                {!readOnly && (
                  <button
                    className="button primary"
                    onClick={() => setEditing(true)}
                  >
                    Edit record
                  </button>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
export function Plans({ notify }: { notify: (s: string) => void }) {
  const [items, setItems] = useState(plans);
  const [edit, setEdit] = useState<number | null>(null);
  useEffect(() => {
    try {
      const s = localStorage.getItem("postcraft-plans");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  return (
    <>
      <div className="plan-cards">
        {items.map((p, i) => (
          <section
            className={`card pricing-card ${i === 2 ? "featured" : ""}`}
            key={p.name}
          >
            {i === 2 && <span className="popular-label">MOST POPULAR</span>}
            <span className="plan-symbol">{["○", "◒", "✳", "◈"][i]}</span>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <div className="price">
              ₹{p.price.toLocaleString("en-IN")}
              <span>/ month</span>
            </div>
            <button
              className={`button ${i === 2 ? "primary" : ""}`}
              onClick={() => setEdit(i)}
            >
              Configure plan
            </button>
            <hr />
            {p.features.map((f) => (
              <div className="feature-line" key={f}>
                <Check size={16} />
                {f}
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className="card enterprise-card">
        <div>
          <h2>A plan for bigger possibilities.</h2>
          <p>
            Enterprise · Custom pricing, configurable limits, and dedicated
            support.
          </p>
        </div>
        <Badge>Contact sales</Badge>
      </div>
      <p className="demo-footnote">
        Demo pricing only. Changes apply to new demo subscriptions; existing
        terms are unchanged.
      </p>
      {edit !== null && (
        <Modal
          title={`Configure ${items[edit].name}`}
          onClose={() => setEdit(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem("postcraft-plans", JSON.stringify(items));
              setEdit(null);
              notify("Demo plan saved. Existing subscriptions are unchanged.");
            }}
          >
            <label>
              Monthly price (INR)
              <input
                type="number"
                required
                min="0"
                value={items[edit].price}
                onChange={(e) =>
                  setItems(
                    items.map((p, i) =>
                      i === edit ? { ...p, price: Number(e.target.value) } : p,
                    ),
                  )
                }
              />
            </label>
            <label>
              Features (one per line)
              <textarea
                value={items[edit].features.join("\n")}
                onChange={(e) =>
                  setItems(
                    items.map((p, i) =>
                      i === edit
                        ? { ...p, features: e.target.value.split("\n") }
                        : p,
                    ),
                  )
                }
              />
            </label>
            <p className="form-note">
              These are local demo entitlements. No payment provider will be
              updated.
            </p>
            <button className="button primary" type="submit">
              Save demo plan
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Integrations({ notify }: { notify: (s: string) => void }) {
  const [tested, setTested] = useState<string[]>([]);
  return (
    <>
      <div className="integration-banner">
        <PlugZap size={23} />
        <div>
          <h3>Your platform, connected.</h3>
          <p>
            Integration previews use simulated responses. No live services are
            configured.
          </p>
        </div>
        <Badge>Demo mode</Badge>
      </div>
      <div className="integration-grid">
        {[
          {
            name: "Razorpay",
            type: "Payments & subscriptions",
            icon: CreditCard,
          },
          { name: "Resend", type: "Transactional email delivery", icon: Send },
          { name: "Supabase", type: "Database & file storage", icon: Database },
          { name: "PostHog", type: "Product analytics", icon: BarChart3 },
          { name: "Webhooks", type: "Platform event delivery", icon: Webhook },
          {
            name: "Notifications",
            type: "In-app notification delivery",
            icon: Bell,
          },
        ].map((p) => (
          <section className="card integration-card" key={p.name}>
            <div className="integration-top">
              <span className="integration-icon">
                <p.icon size={25} />
              </span>
              <Badge>
                {tested.includes(p.name) ? "Demo checked" : "Not connected"}
              </Badge>
            </div>
            <h2>{p.name}</h2>
            <p>{p.type}</p>
            <hr />
            <div className="integration-bottom">
              <span>
                {tested.includes(p.name)
                  ? "Simulated check complete"
                  : "Credentials not configured"}
              </span>
              <button
                className="button compact"
                onClick={() => {
                  setTested([...tested, p.name]);
                  notify(
                    `${p.name}: simulated connection check passed. No network request was made.`,
                  );
                }}
              >
                Test demo
              </button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
export function Settings({ notify }: { notify: (s: string) => void }) {
  const [values, setValues] = useState({
    currency: "INR",
    timezone: "Asia/Kolkata",
    rate: "1000",
    retention: "90",
    maintenance: false,
    notifications: true,
  });
  useEffect(() => {
    try {
      const saved = localStorage.getItem("postcraft-settings");
      if (saved) setValues(JSON.parse(saved));
    } catch {}
  }, []);
  return (
    <form
      className="card settings-card"
      onSubmit={(e) => {
        e.preventDefault();
        localStorage.setItem("postcraft-settings", JSON.stringify(values));
        notify("Demo platform settings saved.");
      }}
    >
      <h2>General settings</h2>
      <p>Configure defaults for your demo platform.</p>
      <div className="settings-fields">
        <label>
          Default currency
          <select
            value={values.currency}
            onChange={(e) => setValues({ ...values, currency: e.target.value })}
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </label>
        <label>
          Default timezone
          <select
            value={values.timezone}
            onChange={(e) => setValues({ ...values, timezone: e.target.value })}
          >
            <option>Asia/Kolkata</option>
            <option>UTC</option>
            <option>America/New_York</option>
          </select>
        </label>
        <label>
          Global email rate limit (per hour)
          <input
            type="number"
            min="1"
            required
            value={values.rate}
            onChange={(e) => setValues({ ...values, rate: e.target.value })}
          />
        </label>
        <label>
          Log retention (days)
          <input
            type="number"
            min="7"
            max="3650"
            required
            value={values.retention}
            onChange={(e) =>
              setValues({ ...values, retention: e.target.value })
            }
          />
        </label>
      </div>
      <label className="toggle-row">
        <span>
          Maintenance mode
          <small>Preview a maintenance state in this demo.</small>
        </span>
        <input
          type="checkbox"
          checked={values.maintenance}
          onChange={(e) =>
            setValues({ ...values, maintenance: e.target.checked })
          }
        />
      </label>
      <label className="toggle-row">
        <span>
          Operational notifications
          <small>Receive platform updates in the notification center.</small>
        </span>
        <input
          type="checkbox"
          checked={values.notifications}
          onChange={(e) =>
            setValues({ ...values, notifications: e.target.checked })
          }
        />
      </label>
      <div className="settings-save">
        <button className="button primary" type="submit">
          Save changes
        </button>
      </div>
    </form>
  );
}
export function TemplateLibrary({ notify }: { notify: (s: string) => void }) {
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<(typeof templates)[number] | null>(
    null,
  );
  const [mobile, setMobile] = useState(false);
  const [items, setItems] = useState(templates);
  useEffect(() => {
    setSearch(new URLSearchParams(window.location.search).get("search") || "");
    try {
      const saved = localStorage.getItem("postcraft-templates");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);
  return (
    <>
      <div className="management-toolbar card">
        <div className="input-search">
          <Search size={16} />
          <input
            placeholder="Search templates..."
            aria-label="Search templates"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="toolbar-spacer" />
        <span className="muted">{items.length} curated templates</span>
      </div>
      <div className="template-library">
        {items
          .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
          .map((t) => (
            <button
              className="card template-tile"
              key={t.id}
              onClick={() => {
                setPreview(t);
                setMobile(false);
              }}
            >
              <div className={`template-preview ${t.color}`}>
                <div className="email-paper">
                  <div className="email-brand">{t.brand}</div>
                  <div className="email-headline">{t.headline}</div>
                  <div className="email-decoration">
                    <div />
                    <div />
                    <div />
                  </div>
                  <span className="email-cta">DISCOVER MORE →</span>
                </div>
              </div>
              <div className="template-meta">
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.category}</p>
                </div>
                <Badge>{t.status}</Badge>
              </div>
            </button>
          ))}
      </div>
      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(null)}>
          <div className="preview-controls">
            <button
              className={`button ${!mobile ? "primary" : ""}`}
              onClick={() => setMobile(false)}
            >
              Desktop
            </button>
            <button
              className={`button ${mobile ? "primary" : ""}`}
              onClick={() => setMobile(true)}
            >
              Mobile
            </button>
          </div>
          <div
            className={`template-preview large ${preview.color} ${mobile ? "mobile-preview" : ""}`}
          >
            <div className="email-paper">
              <div className="email-brand">{preview.brand}</div>
              <div className="email-headline">{preview.headline}</div>
              <p>Thoughtfully designed. Made to connect.</p>
              <div className="email-decoration">
                <div />
                <div />
                <div />
              </div>
              <span className="email-cta">DISCOVER MORE →</span>
            </div>
          </div>
          <div className="modal-actions">
            <button
              className="button"
              onClick={() => {
                const copy = {
                  ...preview,
                  id: `TPL-${Date.now()}`,
                  name: `${preview.name} (copy)`,
                  status: "Draft",
                };
                const next = [...items, copy];
                setItems(next);
                localStorage.setItem(
                  "postcraft-templates",
                  JSON.stringify(next),
                );
                setPreview(null);
                notify("Template duplicated as a local draft.");
              }}
            >
              Duplicate
            </button>
            <button
              className="button primary"
              onClick={() => {
                const next = items.map((t) =>
                  t.id === preview.id
                    ? {
                        ...t,
                        status:
                          t.status === "Published" ? "Draft" : "Published",
                      }
                    : t,
                );
                setItems(next);
                localStorage.setItem(
                  "postcraft-templates",
                  JSON.stringify(next),
                );
                setPreview(null);
                notify("Demo publication status updated.");
              }}
            >
              {preview.status === "Published"
                ? "Unpublish demo"
                : "Publish demo"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
