import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      "accueil": "Accueil",
      "expositions": "Expositions",
      "evenements": "Événements",
      "artistes": "Artistes",
      "contact": "Contact",
      "boutique": "Boutique",
      
      // Page d'accueil
      "bienvenue": "Bienvenue à la Galerie Pol Lemétais",
      "decouvrir": "Découvrir nos expositions",
      
      // Expositions
      "expo_actuelles": "Expositions actuelles",
      "expo_passees": "Expositions passées",
      "expo_futures": "Expositions à venir",
      
      // Événements
      "prochains_evenements": "Prochains événements",
      "evenements_passes": "Événements passés",
      
      // Artistes
      "nos_artistes": "Nos artistes",
      "biographie": "Biographie",
      "oeuvres": "Œuvres",
      
      // Contact
      "nous_contacter": "Nous contacter",
      "adresse": "Adresse",
      "telephone": "Téléphone",
      "email": "Email",
      "message": "Message",
      "envoyer": "Envoyer",
      
      // Footer
      "mentions_legales": "Mentions légales",
      "cgu": "CGU",
      "confidentialite": "Politique de confidentialité",
      "newsletter": "Newsletter",
      "inscription": "S'inscrire",
      "droits_reserves": "Tous droits réservés"
    }
  },
  en: {
    translation: {
      // Navigation
      "accueil": "Home",
      "expositions": "Exhibitions",
      "evenements": "Events",
      "artistes": "Artists",
      "contact": "Contact",
      "boutique": "Shop",
      
      // Home page
      "bienvenue": "Welcome to Galerie Pol Lemétais",
      "decouvrir": "Discover our exhibitions",
      
      // Exhibitions
      "expo_actuelles": "Current exhibitions",
      "expo_passees": "Past exhibitions",
      "expo_futures": "Upcoming exhibitions",
      
      // Events
      "prochains_evenements": "Upcoming events",
      "evenements_passes": "Past events",
      
      // Artists
      "nos_artistes": "Our artists",
      "biographie": "Biography",
      "oeuvres": "Works",
      
      // Contact
      "nous_contacter": "Contact us",
      "adresse": "Address",
      "telephone": "Phone",
      "email": "Email",
      "message": "Message",
      "envoyer": "Send",
      
      // Footer
      "mentions_legales": "Legal notice",
      "cgu": "Terms of use",
      "confidentialite": "Privacy policy",
      "newsletter": "Newsletter",
      "inscription": "Subscribe",
      "droits_reserves": "All rights reserved"
    }
  },
  es: {
    translation: {
      // Navigation
      "accueil": "Inicio",
      "expositions": "Exposiciones",
      "evenements": "Eventos",
      "artistes": "Artistas",
      "contact": "Contacto",
      "boutique": "Tienda",
      
      // Home page
      "bienvenue": "Bienvenido a Galerie Pol Lemétais",
      "decouvrir": "Descubre nuestras exposiciones",
      
      // Exhibitions
      "expo_actuelles": "Exposiciones actuales",
      "expo_passees": "Exposiciones pasadas",
      "expo_futures": "Próximas exposiciones",
      
      // Events
      "prochains_evenements": "Próximos eventos",
      "evenements_passes": "Eventos pasados",
      
      // Artists
      "nos_artistes": "Nuestros artistas",
      "biographie": "Biografía",
      "oeuvres": "Obras",
      
      // Contact
      "nous_contacter": "Contáctenos",
      "adresse": "Dirección",
      "telephone": "Teléfono",
      "email": "Correo electrónico",
      "message": "Mensaje",
      "envoyer": "Enviar",
      
      // Footer
      "mentions_legales": "Aviso legal",
      "cgu": "Términos de uso",
      "confidentialite": "Política de privacidad",
      "newsletter": "Boletín",
      "inscription": "Suscribirse",
      "droits_reserves": "Todos los derechos reservados"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 