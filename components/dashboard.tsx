"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Send,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Ellipsis,
  CircleCheck,
  CircleAlert,
  LayoutTemplate,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { series, users, templates } from "@/lib/data";
import { Avatar, Badge, Trend } from "./ui";
export default function Dashboard({ range }: { range: string }) {
  const [chart, setChart] = useState("Revenue");
  const points = range === "Last 7 days" ? series.slice(-7) : series;
  return (
    <>
      <div className="welcome-strip">
        <div>
          <span className="live-dot" /> Your platform is running smoothly
          <span className="welcome-muted">
            All systems operational. You’re good to go.
          </span>
        </div>
        <Link href="/integrations">
          View system status <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="kpi-grid">
        {[
          {
            label: "Total users",
            value: "24,892",
            growth: "12.8%",
            note: "+2,824 this month",
            icon: Users,
            points: "0,35 10,31 20,34 30,21 40,24 50,15 60,18 70,8 80,12 90,2",
          },
          {
            label: "Monthly recurring revenue",
            value: "₹4,28,590",
            growth: "18.6%",
            note: "+₹67,215 this month",
            icon: CreditCard,
            points: "0,36 10,33 20,34 30,23 40,25 50,14 60,19 70,9 80,12 90,2",
          },
          {
            label: "Active subscriptions",
            value: "3,842",
            growth: "8.2%",
            note: "+291 this month",
            icon: Activity,
            points: "0,35 10,32 20,25 30,28 40,16 50,20 60,12 70,16 80,5 90,2",
          },
          {
            label: "Emails sent",
            value: "1.24M",
            growth: "24.5%",
            note: "98.6% delivery rate",
            icon: Send,
            points: "0,35 10,33 20,25 30,28 40,23 50,12 60,17 70,8 80,12 90,2",
          },
        ].map((k) => (
          <div className="card kpi" key={k.label}>
            <div className="kpi-label">
              <span>{k.label}</span>
              <k.icon size={17} />
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-foot">
              <div>
                <Trend value={k.growth} />
                <span className="comparison">vs. last month</span>
                <p>{k.note}</p>
              </div>
              <svg
                width="91"
                height="40"
                viewBox="0 0 92 42"
                aria-hidden="true"
              >
                <path
                  d={`M${k.points.replaceAll(" ", " L")} L90,42 L0,42 Z`}
                  fill="#e7f5ec"
                />
                <polyline
                  points={k.points}
                  fill="none"
                  stroke="#46a580"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-grid">
        <section className="card revenue-card">
          <div className="section-head">
            <div>
              <h2>
                Revenue overview <span className="info-dot">i</span>
              </h2>
              <p>A little growth, every day. Here’s the bigger picture.</p>
            </div>
            <button
              className="button compact"
              onClick={() =>
                setChart(chart === "Revenue" ? "New users" : "Revenue")
              }
            >
              {chart === "Revenue" ? "Monthly" : "User growth"}
              <ChevronDown size={13} />
            </button>
          </div>
          <div className="revenue-stat">
            <strong>{chart === "Revenue" ? "₹4,28,590" : "2,824"}</strong>
            <Trend value="18.6%" />
            <span>vs. previous period</span>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot" />
              This month
            </span>
            <span>
              <i className="legend-dot pale" />
              Last month
            </span>
          </div>
          <div className="main-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={points}
                margin={{ top: 12, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="mint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74b89c" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#74b89c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 4"
                  vertical={false}
                  stroke="#e9eceb"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={45}
                  tick={{ fill: "#526359", fontSize: 12 }}
                  tickFormatter={(d) => `Oct ${String(d).padStart(2, "0")}`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  tick={{ fill: "#526359", fontSize: 12 }}
                  tickFormatter={(v) =>
                    chart === "Revenue" ? `₹${v / 1000}k` : v
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e4e9e6",
                    fontSize: 12,
                  }}
                  formatter={(v) =>
                    chart === "Revenue"
                      ? `₹${Number(v).toLocaleString("en-IN")}`
                      : v
                  }
                  labelFormatter={(d) => `October ${d}, 2026 · Demo`}
                />
                {chart === "Revenue" && (
                  <Area
                  isAnimationActive={false}
                    type="monotone"
                    dataKey="previous"
                    stroke="#bad1c5"
                    strokeDasharray="5 5"
                    fill="transparent"
                    strokeWidth={2}
                  />
                )}
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey={chart === "Revenue" ? "current" : "users"}
                  stroke="#338866"
                  fill="url(#mint)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-footer">
            <span>
              <span className="small-dot" /> Estimated recurring revenue · INR
            </span>
            <Link href="/analytics">
              View revenue report <ArrowRight size={13} />
            </Link>
          </div>
        </section>
        <section className="card subscription-card">
          <div className="section-head">
            <div>
              <h2>Subscriptions by plan</h2>
              <p>A breakdown of your paying customers.</p>
            </div>
            <Link
              href="/subscriptions"
              className="icon-button"
              aria-label="View subscriptions"
            >
              <Ellipsis size={19} />
            </Link>
          </div>
          <div className="donut">
            <div>
              <span>Total subscribers</span>
              <strong>3,842</strong>
              <Trend value="8.2% this month" />
            </div>
          </div>
          <div className="plan-legend">
            {[
              ["Starter", "1,921", "50%"],
              ["Pro", "1,345", "35%"],
              ["Business", "576", "15%"],
            ].map(([name, count, percent], i) => (
              <div key={name}>
                <span>
                  <i
                    style={{ background: ["#285c49", "#74ac91", "#d6e8dc"][i] }}
                  />
                  {name}
                </span>
                <strong>{count}</strong>
                <span>{percent}</span>
              </div>
            ))}
          </div>
          <Link href="/subscriptions" className="card-bottom-link">
            Manage subscriptions <ArrowRight size={14} />
          </Link>
        </section>
      </div>
      <div className="middle-grid">
        <section className="card recent-users">
          <div className="section-head">
            <div>
              <h2>
                Recent users <span className="count-chip">+124 this week</span>
              </h2>
              <p>A warm welcome to the newest members.</p>
            </div>
            <Link className="text-link" href="/users">
              View all users <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u, i) => (
                  <tr key={u.id}>
                    <td>
                      <div className="person">
                        <Avatar name={u.name} index={i} />
                        <div>
                          <strong>{u.name}</strong>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge>{u.plan}</Badge>
                    </td>
                    <td>
                      <span
                        className={`status-text ${u.status === "Suspended" ? "muted" : ""}`}
                      >
                        <i />
                        {u.status}
                      </span>
                    </td>
                    <td className="muted">{u.date.replace(", 2026", "")}</td>
                    <td>
                      <Link
                        href={`/users?search=${encodeURIComponent(u.name)}`}
                        aria-label={`View ${u.name}`}
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card activity-card">
          <div className="section-head">
            <div>
              <h2>Recent activity</h2>
              <p>The latest across your platform.</p>
            </div>
            <Link
              className="icon-button"
              href="/audit"
              aria-label="View all activity"
            >
              <Ellipsis size={19} />
            </Link>
          </div>
          <div className="activity-list">
            {[
              {
                icon: CreditCard,
                title: "New Business subscription",
                desc: "Phoenix Baker upgraded to Business",
                time: "2 minutes ago",
                tone: "green",
              },
              {
                icon: LayoutTemplate,
                title: "A fresh template, published",
                desc: "“Autumn collection” is now live",
                time: "18 minutes ago",
                tone: "purple",
              },
              {
                icon: CircleAlert,
                title: "Payment needs attention",
                desc: "Invoice #INV-2030 · Drew Cano",
                time: "42 minutes ago",
                tone: "amber",
              },
              {
                icon: Users,
                title: "A growing community",
                desc: "We welcomed 124 new users this week",
                time: "1 hour ago",
                tone: "blue",
              },
            ].map((a) => (
              <Link
                href={a.tone === "amber" ? "/payments" : "/audit"}
                className="activity-item"
                key={a.title}
              >
                <div className={`activity-icon ${a.tone}`}>
                  <a.icon size={16} />
                </div>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.desc}</p>
                  <small>{a.time}</small>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/audit" className="card-bottom-link">
            View all activity <ArrowRight size={14} />
          </Link>
        </section>
      </div>
      <section className="card template-section">
        <div className="section-head">
          <div>
            <h2>Templates your customers love</h2>
            <p>A few favorites doing the heavy lifting.</p>
          </div>
          <Link className="text-link" href="/templates">
            Explore template library <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="template-grid">
          {templates.map((t) => (
            <Link
              className="template-tile"
              href={`/templates?search=${encodeURIComponent(t.name)}`}
              key={t.id}
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
                  <span className="email-cta">
                    {t.color === "sage"
                      ? "EXPLORE THE COLLECTION"
                      : "DISCOVER MORE"}{" "}
                    →
                  </span>
                </div>
                <span className="template-premium">
                  {t.color === "lavender" ? "Free" : "Premium"}
                </span>
              </div>
              <div className="template-meta">
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.category}</p>
                </div>
                <span>
                  <LayoutTemplate size={12} />
                  {t.uses}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <footer className="dashboard-footer">
        <span>© 2026 Postcraft. Crafted for better emails.</span>
        <span>
          <CircleCheck size={13} />
          All systems operational <span className="footer-divider">|</span>Last
          updated just now
        </span>
      </footer>
    </>
  );
}
