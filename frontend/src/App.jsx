import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/appRoutes'
import CursorGrid from './components/CursorGrid/CursorGrid'

// Marketing/public pages can afford a more noticeable effect; dashboard
// and data-dense pages (tables, forms, charts) stay subdued so the
// background doesn't compete with real numbers and content.
const PROMINENT_ROUTES = ['/', '/learning', '/calculators', '/contact'];

function App() {
  const location = useLocation();
  // Settings may not be loaded yet (public pages, or before DashboardLayout
  // has fetched them) — undefined is treated as "motion allowed", matching
  // the backend schema's own reduceMotion:false default.
  const { settings } = useSelector((state) => state.settings);
  const reduceMotion = settings?.appearance?.reduceMotion === true;

  const isProminent = PROMINENT_ROUTES.includes(location.pathname);

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#171F1E',
            color: '#E2E8F0',
            border: '1px solid #293533',
            fontSize: '0.875rem',
            // Notification toasts pack title + message into one string
            // separated by \n — this is what makes that render as two
            // lines instead of collapsing to a single line.
            whiteSpace: 'pre-line',
          },
          success: {
            iconTheme: { primary: '#00bba7', secondary: '#171F1E' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#171F1E' },
          },
        }}
      />
      <CursorGrid
        className="app-cursor-grid"
        trackWindow
        disabled={reduceMotion}
        cellSize={70}
        color="#00bba7"
        radius={isProminent ? 160 : 120}
        maxOpacity={isProminent ? 0.6 : 0.35}
      />
      <AppRoutes/>
    </>
  )
}

export default App