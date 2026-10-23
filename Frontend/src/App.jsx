import { useEffect } from "react"
import { Routes, Route, Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollProgress from "./components/ScrollProgress"
import PageBackground from "./components/PageBackground"
import RequireRole from "./components/RequireRole"
import GuestRoute from "./components/GuestRoute"
import DashboardShell from "./components/dashboard/DashboardShell"
import InstitutionShell from "./components/institution/InstitutionShell"
import AdminShell from "./components/admin/AdminShell"
import { ScrollTrigger } from "./lib/gsap"

// Marketing
import Home from "./pages/Home"
import Platform from "./pages/Platform"
import Domains from "./pages/Domains"
import Pricing from "./pages/Pricing"
import About from "./pages/About"
import Team from "./pages/Team"
import Careers from "./pages/Careers"
import Contact from "./pages/Contact"
import Docs from "./pages/Docs"
import Blog from "./pages/Blog"
import Research from "./pages/Research"
import Legal from "./pages/Legal"
import NotFound from "./pages/NotFound"

// Auth
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import VerifyEmail from "./pages/VerifyEmail"
import InstitutionRegister from "./pages/InstitutionRegister"

// Student
import StudentOverview from "./pages/dashboard/Overview"
import StudentProductions from "./pages/dashboard/Productions"
import StudentAgents from "./pages/dashboard/Agents"
import StudentWarehouse from "./pages/dashboard/Warehouse"
import StudentPremium from "./pages/dashboard/Premium"
import StudentSettings from "./pages/dashboard/Settings"

// Institution
import InstOverview from "./pages/institution/Overview"
import InstMembers from "./pages/institution/Members"
import InstAgents from "./pages/institution/Agents"
import InstProductions from "./pages/institution/Productions"
import InstBilling from "./pages/institution/Billing"
import InstSettings from "./pages/institution/Settings"

// Admin
import AdminOverview from "./pages/admin/Overview"
import AdminUsers from "./pages/admin/Users"
import AdminInstitutions from "./pages/admin/Institutions"
import AdminSubscriptions from "./pages/admin/Subscriptions"
import AdminPayments from "./pages/admin/Payments"
import AdminPlans from "./pages/admin/Plans"
import AdminAudit from "./pages/admin/Audit"

function ScrollManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 400)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    window.addEventListener("load", refresh)
    return () => {
      clearTimeout(t)
      window.removeEventListener("load", refresh)
    }
  }, [])

  return null
}

function MarketingLayout() {
  return (
    <>
      <PageBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function AuthLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        {/* Marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/research" element={<Research />} />
          <Route path="/privacy" element={<Legal doc="privacy" />} />
          <Route path="/terms" element={<Legal doc="terms" />} />
          <Route path="/security" element={<Legal doc="security" />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Public auth + B2B onboarding */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/auth/reset" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/auth/verify" element={<VerifyEmail />} />
          <Route path="/institutions/register" element={<GuestRoute><InstitutionRegister /></GuestRoute>} />
        </Route>

        {/* Student */}
        <Route
          path="/dashboard"
          element={
            <RequireRole roles={["student"]}>
              <DashboardShell />
            </RequireRole>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="productions" element={<StudentProductions />} />
          <Route path="agents" element={<StudentAgents />} />
          <Route path="warehouse" element={<StudentWarehouse />} />
          <Route path="premium" element={<StudentPremium />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* Institution */}
        <Route
          path="/institution"
          element={
            <RequireRole roles={["institution"]}>
              <InstitutionShell />
            </RequireRole>
          }
        >
          <Route index element={<InstOverview />} />
          <Route path="members" element={<InstMembers />} />
          <Route path="agents" element={<InstAgents />} />
          <Route path="productions" element={<InstProductions />} />
          <Route path="billing" element={<InstBilling />} />
          <Route path="settings" element={<InstSettings />} />
        </Route>

        {/* Admin console */}
        <Route
          path="/admin"
          element={
            <RequireRole roles={["admin"]}>
              <AdminShell />
            </RequireRole>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="institutions" element={<AdminInstitutions />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>
      </Routes>
    </>
  )
}
