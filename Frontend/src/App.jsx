import { useEffect } from "react"
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom"
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
import { useAuth, homeForRole } from "./lib/auth"

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
import StudentPremium from "./pages/dashboard/Premium"
import StudentSettings from "./pages/dashboard/Settings"
import StudentDictionary from "./pages/dashboard/Courses"
import StudentCourseDetail from "./pages/dashboard/CourseDetail"

// Institution
import InstOverview from "./pages/institution/Overview"
import InstMembers from "./pages/institution/Members"
import InstModules from "./pages/institution/Modules"
import InstModuleEditor from "./pages/institution/ModuleEditor"
import InstModuleSection from "./pages/institution/ModuleSection"
import InstModuleLesson from "./pages/institution/ModuleLesson"
import InstAgents from "./pages/institution/Agents"
import InstProductions from "./pages/institution/Productions"
import InstBilling from "./pages/institution/Billing"
import InstSettings from "./pages/institution/Settings"

// Admin
import AdminOverview from "./pages/admin/Overview"
import AdminUsers from "./pages/admin/Users"
import AdminInstitutions from "./pages/admin/Institutions"
import AdminSubscriptions from "./pages/admin/Subscriptions"
import AdminSubscriptionDetail from "./pages/admin/SubscriptionDetail"
import AdminSubscriptionAnalytics from "./pages/admin/SubscriptionAnalytics"
import AdminPlanEditor from "./pages/admin/PlanEditor"
import AdminCourses from "./pages/admin/Courses"
import AdminCourseEditor from "./pages/admin/CourseEditor"
import AdminCourseSection from "./pages/admin/CourseSection"
import AdminCourseLesson from "./pages/admin/CourseLesson"
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

/**
 * Marketing pages are for visitors. A signed-in user belongs in their own
 * console, so any public page sends them straight to their dashboard.
 */
function MarketingLayout() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to={homeForRole(user.role)} replace />

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

        {/* Split-screen auth — full-bleed, no navbar/footer */}
        <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />

        {/* Public auth + B2B onboarding */}
        <Route element={<AuthLayout />}>
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
          <Route path="courses" element={<StudentDictionary />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route path="premium" element={<StudentPremium />} />
          <Route path="settings" element={<StudentSettings />} />
          {/* Generation belongs to the institution and platform sides. */}
          <Route path="productions" element={<Navigate to="/dashboard" replace />} />
          <Route path="agents" element={<Navigate to="/dashboard" replace />} />
          <Route path="warehouse" element={<Navigate to="/dashboard" replace />} />
          <Route path="dictionary" element={<Navigate to="/dashboard/courses" replace />} />
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
          <Route path="modules" element={<InstModules />} />
          <Route path="modules/new" element={<InstModuleEditor />} />
          <Route path="modules/:courseId" element={<InstModuleEditor />} />
          <Route path="modules/:courseId/sections/:sectionIndex" element={<InstModuleSection />} />
          <Route
            path="modules/:courseId/sections/:sectionIndex/lessons/:lessonIndex"
            element={<InstModuleLesson />}
          />
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
          <Route path="subscriptions">
            <Route index element={<AdminSubscriptionAnalytics />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="plans/:planId" element={<AdminPlanEditor />} />
            <Route path="accounts" element={<AdminSubscriptions />} />
            <Route path=":accountId" element={<AdminSubscriptionDetail />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<AdminCourseEditor />} />
          <Route path="courses/:courseId" element={<AdminCourseEditor />} />
          <Route path="courses/:courseId/sections/:sectionIndex" element={<AdminCourseSection />} />
          <Route
            path="courses/:courseId/sections/:sectionIndex/lessons/:lessonIndex"
            element={<AdminCourseLesson />}
          />
          <Route path="payments" element={<Navigate to="/admin/subscriptions/payments" replace />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>
      </Routes>
    </>
  )
}
