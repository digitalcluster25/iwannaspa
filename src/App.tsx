import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { CatalogPage } from './components/CatalogPage'
import { SpaPage } from './components/SpaPage'
import { AdminPage } from './components/AdminPage'
import { AdminSpaEdit } from './components/AdminSpaEdit'
import { AdminLeadsPage } from './components/AdminLeadsPage'
import { AdminLeadDetails } from './components/AdminLeadDetails'
import { AdminCitiesPage } from './components/AdminCitiesPage'
import { AdminCategoriesPage } from './components/AdminCategoriesPage'
import { AdminPurposesPage } from './components/AdminPurposesPage'
import { AdminAmenitiesPage } from './components/AdminAmenitiesPage'
import { AdminServicesPage } from './components/AdminServicesPage'
import { ContactsPage } from './components/ContactsPage'
import { OfferPage } from './components/OfferPage'
import { AuthPage } from './components/AuthPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { KokonutNav } from './components/KokonutNav'
import { AdminHeader } from './components/AdminHeader'
import { PublicLayout } from './components/PublicLayout'
import { HomePageMenu } from './components/HomePageMenu'
import { Footer } from './components/Footer'
import { Toaster } from 'sonner'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/adminko')
  const isAuthRoute = location.pathname === '/auth'
  const isHomePage = location.pathname === '/'

  // Админка с отдельным layout
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AdminHeader />
        <main className="flex-1">
          <Routes>
            <Route
              path="/adminko"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/spa/new"
              element={
                <ProtectedRoute>
                  <AdminSpaEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/spa/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminSpaEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/leads"
              element={
                <ProtectedRoute>
                  <AdminLeadsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/leads/:id"
              element={
                <ProtectedRoute>
                  <AdminLeadDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/cities"
              element={
                <ProtectedRoute>
                  <AdminCitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/categories"
              element={
                <ProtectedRoute>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/purposes"
              element={
                <ProtectedRoute>
                  <AdminPurposesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/amenities"
              element={
                <ProtectedRoute>
                  <AdminAmenitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminko/services"
              element={
                <ProtectedRoute>
                  <AdminServicesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    )
  }

  // Auth страница без layout
  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    )
  }

  // Публичная часть с семантичной структурой
  return (
    <>
      <header>
        <HomePageMenu />
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/catalog"
            element={<Navigate to="/catalog/" replace />}
          />
          <Route path="/catalog/" element={<CatalogPage />} />
          <Route path="/spa/:id" element={<SpaPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <Toaster position="top-right" richColors />
    </Router>
  )
}
