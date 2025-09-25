import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { SpaPage } from './components/SpaPage';
import { AdminPage } from './components/AdminPage';
import { AdminSpaEdit } from './components/AdminSpaEdit';
import { AdminLeadsPage } from './components/AdminLeadsPage';
import { AdminLeadDetails } from './components/AdminLeadDetails';
import { AdminCitiesPage } from './components/AdminCitiesPage';
import { AdminCategoriesPage } from './components/AdminCategoriesPage';
import { AdminPurposesPage } from './components/AdminPurposesPage';
import { AdminAmenitiesPage } from './components/AdminAmenitiesPage';
import { AdminServicesPage } from './components/AdminServicesPage';
import { ContactsPage } from './components/ContactsPage';
import { OfferPage } from './components/OfferPage';
import { Header } from './components/Header';
import { AdminHeader } from './components/AdminHeader';
import { Footer } from './components/Footer';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/spa/:id" element={<SpaPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/spa/new" element={<AdminSpaEdit />} />
          <Route path="/admin/spa/:id/edit" element={<AdminSpaEdit />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/leads/:id" element={<AdminLeadDetails />} />
          <Route path="/admin/cities" element={<AdminCitiesPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/purposes" element={<AdminPurposesPage />} />
          <Route path="/admin/amenities" element={<AdminAmenitiesPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/offer" element={<OfferPage />} />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}