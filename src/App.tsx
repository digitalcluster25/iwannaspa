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
import { AdminCountriesPage } from './components/AdminCountriesPage'
import { AdminCountryEdit } from './components/AdminCountryEdit'
import { AdminServicesPage } from './components/AdminServicesPage'
import { AdminAmenitiesPage } from './components/AdminAmenitiesPage'
import { AdminBrandsPage } from './components/AdminBrandsPage'
import { AdminUsersPage } from './components/AdminUsersPage'
import { BusinessPage } from './components/BusinessPage'
import { BusinessRegisterPage } from './components/BusinessRegisterPage'
import { BusinessLoginPage } from './components/BusinessLoginPage'
import { BusinessPendingPage } from './components/BusinessPendingPage'
import { ContactsPage } from './components/ContactsPage'
import { OfferPage } from './components/OfferPage'
import { UserAuthPage } from './components/UserAuthPage'
import { ProfilePage } from './components/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedUserRoute } from './components/ProtectedUserRoute'
import { VendorRoute } from './components/VendorRoute'
import { AuthenticatedLayout } from './components/layout/authenticated-layout'
import { HomePageMenu } from './components/HomePageMenu'
import { Footer } from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/adminko')
  const isAuthRoute = location.pathname === '/user-auth'
  const isHomePage = location.pathname === '/'

  // Админка с новым shadcn-admin дизайном
  if (isAdminRoute) {
    return (
      <AuthenticatedLayout>
        <Routes>
          <Route path="/adminko" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/spa/new" element={
            <ProtectedRoute>
              <AdminSpaEdit />
            </ProtectedRoute>
          } />
          <Route path="/adminko/spa/:id/edit" element={
            <ProtectedRoute>
              <AdminSpaEdit />
            </ProtectedRoute>
          } />
          <Route path="/adminko/leads" element={
            <ProtectedRoute>
              <AdminLeadsPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/leads/:id" element={
            <ProtectedRoute>
              <AdminLeadDetails />
            </ProtectedRoute>
          } />
          <Route path="/adminko/cities" element={
            <ProtectedRoute>
              <AdminCitiesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/categories" element={
            <ProtectedRoute>
              <AdminCategoriesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/purposes" element={
            <ProtectedRoute>
              <AdminPurposesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/countries" element={
            <ProtectedRoute>
              <AdminCountriesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/countries/new" element={
            <ProtectedRoute>
              <AdminCountryEdit />
            </ProtectedRoute>
          } />
          <Route path="/adminko/countries/:id/edit" element={
            <ProtectedRoute>
              <AdminCountryEdit />
            </ProtectedRoute>
          } />
          <Route path="/adminko/services" element={
            <ProtectedRoute>
              <AdminServicesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/amenities" element={
            <ProtectedRoute>
              <AdminAmenitiesPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/brands" element={
            <ProtectedRoute>
              <AdminBrandsPage />
            </ProtectedRoute>
          } />
          <Route path="/adminko/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthenticatedLayout>
    )
  }

  // Auth страница без layout
  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/user-auth" element={<UserAuthPage />} />
      </Routes>
    )
  }

  // Публичная часть с семантичной структурой
  return (
    <>
      {!isHomePage && (
        <header>
          <HomePageMenu />
        </header>
      )}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/business/register" element={<BusinessRegisterPage />} />
          <Route path="/business/login" element={<BusinessLoginPage />} />
          <Route path="/business/pending" element={<BusinessPendingPage />} />
          <Route
            path="/catalog"
            element={<Navigate to="/catalog/" replace />}
          />
          <Route path="/catalog/" element={<CatalogPage />} />
          <Route path="/spa/:id" element={<SpaPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/user-auth" element={<UserAuthPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <ProfilePage />
              </ProtectedUserRoute>
            }
          />
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
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  )
}
