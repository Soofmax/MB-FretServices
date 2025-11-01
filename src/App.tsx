import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Destinations from './pages/Destinations';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import FreightMaritime from './pages/FreightMaritime';
import NotFound from './pages/NotFound';
import LangLayout from './components/LangLayout';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Default language redirect */}
        <Route path="/" element={<Navigate to="/fr" replace />} />
        {/* Legacy redirect for old slug without language */}
        <Route path="/fret-maritime" element={<Navigate to="/fr/services/fret-maritime" replace />} />
        {/* Language-scoped routes */}
        <Route path="/:lng" element={<LangLayout />}>
          <Route index element={<Home />} />
          {/* FR canonical slugs */}
          <Route path="services" element={<Services />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="contact" element={<Contact />} />
          <Route path="mentions-legales" element={<Legal />} />
          <Route path="services/fret-maritime" element={<FreightMaritime />} />
          {/* Backward-compat legal slug */}
          <Route path="legal" element={<Legal />} />
          {/* EN localized slugs (aliases) */}
          <Route path="legal-notice" element={<Legal />} />
          <Route path="services/maritime-freight" element={<FreightMaritime />} />
          {/* PT localized slugs (aliases) */}
          <Route path="servicos" element={<Services />} />
          <Route path="destinos" element={<Destinations />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="aviso-legal" element={<Legal />} />
          <Route path="servicos/frete-maritimo" element={<FreightMaritime />} />
          {/* ES localized slugs (aliases) */}
          <Route path="servicios" element={<Services />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="aviso-legal" element={<Legal />} />
          <Route path="servicios/transporte-maritimo" element={<FreightMaritime />} />
          {/* TR localized slugs (aliases, ASCII) */}
          <Route path="hizmetler" element={<Services />} />
          <Route path="iletisim" element={<Contact />} />
          <Route path="yasal-uyari" element={<Legal />} />
          <Route path="hizmetler/deniz-tasimaciligi" element={<FreightMaritime />} />
          {/* IT localized slugs (aliases) */}
          <Route path="servizi" element={<Services />} />
          <Route path="destinazioni" element={<Destinations />} />
          <Route path="contatti" element={<Contact />} />
          <Route path="note-legali" element={<Legal />} />
          <Route path="servizi/trasporto-marittimo" element={<FreightMaritime />} />
          {/* DE localized slugs (aliases) */}
          <Route path="leistungen" element={<Services />} />
          <Route path="ziele" element={<Destinations />} />
          <Route path="kontakt" element={<Contact />} />
          <Route path="impressum" element={<Legal />} />
          <Route path="leistungen/seefracht" element={<FreightMaritime />} />
          {/* SW localized slugs (aliases) */}
          <Route path="huduma" element={<Services />} />
          <Route path="vituo" element={<Destinations />} />
          <Route path="mawasiliano" element={<Contact />} />
          <Route path="huduma/usafirishaji-wa-baharini" element={<FreightMaritime />} />
          {/* AR localized slugs (aliases) */}
          <Route path="خدمات" element={<Services />} />
          <Route path="وجهات" element={<Destinations />} />
          <Route path="اتصال" element={<Contact />} />
          <Route path="إشعار-قانوني" element={<Legal />} />
          <Route path="خدمات/الشحن-البحري" element={<FreightMaritime />} />
          {/* Redirect legacy path under language */}
          <Route path="fret-maritime" element={<Navigate to="services/fret-maritime" replace />} />
          {/* 404 for unknown routes within language */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Catch-all: show 404 for unknown root-level paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;