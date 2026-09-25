import { Suspense, lazy, type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "../components/layouts/main-layout";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "@/context/use-auth";

// Lazy pages (code splitting)
const Home = lazy(() => import("../pages/home/home"));
const Login = lazy(() => import("../pages/auth/login"));
const Register = lazy(() => import("../pages/auth/register"));
const ForgotPassword = lazy(() => import("../pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("../pages/auth/reset-password"));
const VerifyEmail = lazy(() => import("../pages/auth/verify-email"));
const ResendVerification = lazy(
  () => import("../pages/auth/resend-verification"),
);
const VerifyEmailPending = lazy(
  () => import("../pages/auth/verify-email-pending"),
);
const NotFound = lazy(() => import("../pages/misc/not-found"));
const Settings = lazy(() => import("../pages/settings/settings"));

// ─── Loading Fallback ──────────────────────────────────

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 4,
    }}
  >
    <CircularProgress />
  </Box>
);

// 🔐 Private Route Wrapper

/**
 * PrivateRoute – requires authentication only.
 * Redirects to "/login" if not logged in.
 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthReady } = useAuth();
  if (!isAuthReady) return <LoadingFallback />;
  return user ? children : <Navigate to={`/login`} replace />;
};

/**
 * AuthRoute – for unauthenticated users only.
 * Redirects to "/" if already logged in.
 */
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return <LoadingFallback />;
  return user ? <Navigate to="/" replace /> : children;
};

/**
 * VerifiedRoute – requires authentication AND verified email.
 * Redirects to "/login" if not logged in.
 * Redirects to "/verify-email-pending" if email not verified.
 */
// const VerifiedRoute = ({ children }: { children: JSX.Element }) => {
//   const { user, isAuthReady } = useAuth();
//   if (!isAuthReady) return <LoadingFallback />;
//   if (!user) return <Navigate to="/login" replace />;
//   if (!user.isEmailVerified) return <Navigate to="/verify-email-pending" replace />;
//   return children;
// };

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* Auth routes */}

        {/* ── Public (no auth required) ── */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ── Auth pages (redirect if already logged in) ── */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/resend-verification"
          element={
            <AuthRoute>
              <ResendVerification />
            </AuthRoute>
          }
        />

        {/* Private routes with layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Nested routes */}
          <Route index element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* ── Verification pending (auth required) ── */}
        <Route
          path="/verify-email-pending"
          element={
            <PrivateRoute>
              <VerifyEmailPending />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
