import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CircleNotch, Warning } from "@phosphor-icons/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { fetchSubscriptionAnalytics } from "../../lib/admin"
import SubscriptionsNav from "../../components/admin/SubscriptionsNav"

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"
const fmtUsdt = (n) => `${Number(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT`
const shorten = (id = "") => (id.length > 26 ? `${id.slice(0, 16)}…${id.slice(-6)}` : id)

const FALLBACK_COLORS = {
  accent: "#6367FF",
  ink: "#433f39",
  ink500: "#8c877f",
  line: "#e2dfd8",
  paper: "#fbf9f5",
}

const readCssVar = (name, fallback) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function Tile({ label, value, hint }) {
  return (
    <div className="border border-line bg-paper p-5">
      <p className="eyebrow">{label}</p>
      <p className="display mt-3 text-step-2 tabular text-ink-950">{value}</p>
      {hint && <p className="mt-1 text-[0.74rem] text-ink-500">{hint}</p>}
    </div>
  )
}

function Panel({ title, children, className = "" }) {
  return (
    <section className={`border border-line bg-paper ${className}`}>
      <header className="border-b border-line px-5 py-3">
        <h2 className="display text-step-1 text-ink-950">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function SubscriptionAnalytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [colors, setColors] = useState(FALLBACK_COLORS)

  useEffect(() => {
    fetchSubscriptionAnalytics().then(setData).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    setColors({
      accent: readCssVar("--color-accent", FALLBACK_COLORS.accent),
      ink: readCssVar("--color-ink-900", FALLBACK_COLORS.ink),
      ink500: readCssVar("--color-ink-500", FALLBACK_COLORS.ink500),
      line: readCssVar("--color-line", FALLBACK_COLORS.line),
      paper: readCssVar("--color-paper", FALLBACK_COLORS.paper),
    })
  }, [])

  const totals = data?.totals
  const tooltipStyle = {
    background: colors.paper,
    border: `1px solid ${colors.line}`,
    borderRadius: 3,
    fontSize: 12,
    color: colors.ink,
  }
  const axisTick = { fill: colors.ink500, fontSize: 11 }
  const PIE_COLORS = [colors.accent, "#8A8DFF", "#4B4FE0", "#B9BCFF", "#D9DAFF"]
  const statusRows = totals
    ? [
        { name: "active", count: totals.active, fill: "#3f7a52" },
        { name: "trialing", count: totals.trialing, fill: colors.accent },
        { name: "canceled", count: totals.canceled, fill: "#a8a49b" },
        { name: "expired", count: totals.expired, fill: "#b3402e" },
      ]
    : []

  return (
    <>
      <div>
        <p className="eyebrow">Subscriptions</p>
        <h1 className="display mt-3 text-step-3 text-ink-950">Revenue & analytics</h1>
      </div>
      <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-600">
        Every billing account, its plan and its money in one place. Figures update the moment a
        plan or subscription changes.
      </p>

      <SubscriptionsNav />

      {error && (
        <p role="alert" className="mt-6 flex items-start gap-2 text-step--1 text-red-700">
          <Warning size={16} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {!data && !error && (
        <p className="mt-6 text-step--1 text-ink-500">
          <CircleNotch size={16} weight="bold" className="inline animate-spin" aria-hidden="true" /> Loading
        </p>
      )}

      {totals && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Tile label="Active subscriptions" value={totals.active} hint={`${totals.subscriptions} billing accounts total`} />
            <Tile label="Trialing" value={totals.trialing} hint={`${data.trialsEndingSoon.length} ending within 7 days`} />
            <Tile label="MRR" value={fmtUsdt(totals.mrrMonthlyUsdt)} hint="active plans, monthly value" />
            <Tile label="Revenue collected" value={fmtUsdt(totals.revenueUsdt)} hint={`${totals.paidPayments} confirmed payments`} />
            <Tile label="Last 30 days" value={fmtUsdt(totals.revenue30dUsdt)} hint="confirmed payments" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Panel title="Revenue — last 6 months">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueByMonth} margin={{ top: 8, right: 12, bottom: 0, left: -6 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.accent} stopOpacity={0.32} />
                        <stop offset="100%" stopColor={colors.accent} stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={colors.line} strokeDasharray="3 6" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: colors.line }} tick={axisTick} />
                    <YAxis width={56} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ stroke: colors.line }}
                      formatter={(value) => [`${value} USDT`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke={colors.accent}
                      strokeWidth={2}
                      fill="url(#revenueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Subscriptions by plan">
              {data.byPlan.length ? (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.byPlan}
                        dataKey="count"
                        nameKey="name"
                        innerRadius="58%"
                        outerRadius="84%"
                        paddingAngle={2}
                        stroke="none"
                      >
                        {data.byPlan.map((entry, i) => (
                          <Cell key={entry.planId} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value, name) => [`${value} account${value === 1 ? "" : "s"}`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ color: colors.ink, fontSize: 12 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-step--1 text-ink-500">No subscriptions yet.</p>
              )}
            </Panel>

            <Panel title="New subscriptions — last 6 months">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.newSubsByMonth} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
                    <CartesianGrid stroke={colors.line} strokeDasharray="3 6" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: colors.line }} tick={axisTick} />
                    <YAxis width={40} allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: colors.line, opacity: 0.35 }}
                      formatter={(value) => [`${value} new`, "Subscriptions"]}
                    />
                    <Bar dataKey="count" fill={colors.accent} radius={[3, 3, 0, 0]} maxBarSize={38} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Subscriptions by status">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={statusRows}
                    margin={{ top: 8, right: 24, bottom: 0, left: 10 }}
                  >
                    <CartesianGrid stroke={colors.line} strokeDasharray="3 6" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={{ stroke: colors.line }}
                      tick={axisTick}
                    />
                    <YAxis type="category" dataKey="name" width={72} tickLine={false} axisLine={false} tick={axisTick} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ fill: colors.line, opacity: 0.35 }}
                      formatter={(value) => [`${value} account${value === 1 ? "" : "s"}`, "subscriptions"]}
                    />
                    <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={26}>
                      {statusRows.map((row) => (
                        <Cell key={row.name} fill={row.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Trials ending in 7 days">
              {data.trialsEndingSoon.length ? (
                <ul className="divide-y divide-line">
                  {data.trialsEndingSoon.map((t) => (
                    <li key={t.accountId} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <Link
                        to={`/admin/subscriptions/${encodeURIComponent(t.accountId)}`}
                        className="font-mono text-[0.72rem] text-ink-800 underline decoration-line-2 underline-offset-4 hover:decoration-accent-ink"
                      >
                        {shorten(t.accountId)}
                      </Link>
                      <span className="text-step--1 text-ink-600">{t.planName}</span>
                      <span className="text-step--1 tabular text-ink-500">{fmtDate(t.trialEndsAt)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-step--1 text-ink-500">Nothing ending soon.</p>
              )}
            </Panel>

            <Panel title="Recent payments">
              {data.recentPayments.length ? (
                <ul className="divide-y divide-line">
                  {data.recentPayments.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <span className="font-mono text-[0.72rem] text-ink-800">{p.reference}</span>
                      <span className="text-step--1 text-ink-600">{p.planName ?? p.planId}</span>
                      <span className="text-step--1 tabular text-ink-900">
                        {p.matchedTotal ?? p.expectedAmount} {p.asset}
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500">{p.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-step--1 text-ink-500">No payments recorded.</p>
              )}
            </Panel>

            <Panel title="Recent changes" className="xl:col-span-2">
              {data.recentChanges.length ? (
                <ul className="divide-y divide-line">
                  {data.recentChanges.map((e, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0">
                      <span className="text-step--1 text-ink-900">{e.action}</span>
                      <span className="font-mono text-[0.68rem] text-ink-500">{shorten(e.targetId ?? "")}</span>
                      <span className="font-mono text-[0.68rem] text-ink-400">
                        {e.actor ?? "admin"} · {fmtDate(e.at)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-step--1 text-ink-500">No changes recorded yet.</p>
              )}
            </Panel>
          </div>
        </>
      )}
    </>
  )
}
