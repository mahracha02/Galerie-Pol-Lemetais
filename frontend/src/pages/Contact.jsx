import { motion } from "framer-motion";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import circle from '../assets/photos/icons/circle.png';

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const Contact = () => {
  const position = [43.6045, 1.4442];
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      setTimeout(() => {
        setSubmitStatus({ type: 'success', message: 'Votre message a été envoyé avec succès !' });
        setFormData({ nom: '', email: '', telephone: '', message: '', consent: false });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#0C0C0C] pb-24">
      {/* CONTACT HEADER + FORM */}
      <div className="w-full flex flex-col items-center">
        <div className="max-w-5xl w-full flex flex-col items-center pt-12 px-4">
          <div className="flex items-center mb-10 justify-center">
            <img src={circle} alt="circle icon" className="w-7 h-7 mr-3" />
            <h1 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] uppercase text-[#0C0C0C]" style={{ color: '#0C0C0C', fontFamily: 'Kenyan Coffee, sans-serif', letterSpacing: 1 }}>
              Contact
            </h1>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-xl bg-[#0C0C0C] border border-[#FFFFFF] p-10 mx-auto">
              <p className="mb-8 text-[#A8A8A8] text-base">Renseignez vos informations personnelles afin que l'on puisse vous recontacter.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[#FFFFFF] mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#505050] border border-[#FFFFFF] text-[#FFFFFF] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#FFFFFF] mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#505050] border border-[#FFFFFF] text-[#FFFFFF] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#FFFFFF] mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#505050] border border-[#FFFFFF] text-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#FFFFFF] mb-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 bg-[#505050] border border-[#FFFFFF] text-[#FFFFFF] focus:outline-none"
                    required
                  ></textarea>
                </div>
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mr-2 mt-1 border border-[#FFFFFF] bg-[#505050] text-[#972924] focus:ring-0"
                    required
                  />
                  <label htmlFor="consent" className="text-[0.8rem] md:text-[0.9rem] lg:text-[0.9rem] text-[#A8A8A8]">
                    J'accepte que mes données personnelles soient collectées et traitées  conformément à la politique de confidentialité.<br />
                    Aucune donnée  personnelle n'est conservée sans mon autorisation explicite.
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 bg-[#972924] text-[#FFFFFF] font-bold text-base transition disabled:opacity-60"
                  style={{ border: 'none' }}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {submitStatus.message && (
                  <div className={`mt-2 text-center text-sm ${submitStatus.type === 'success' ? 'text-[#FFFFFF]' : 'text-[#972924]'}`}>{submitStatus.message}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* NOUS LOCALISER SECTION */}
      <div className="w-full flex flex-col items-center mt-24">
        <div className="p-12 bg-[#0C0C0C] flex flex-col items-center w-full">
          <div className="flex items-center justify-center">
            <img src={circle} alt="circle icon" className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 mr-3" />
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] uppercase text-[#FFFFFF]" style={{ fontFamily: 'Kenyan Coffee, sans-serif', letterSpacing: 1 }}>
              Nous localiser
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center mt-8 w-full max-w-4xl">
            <div className="w-full md:w-[20rem] h-[260px] border rounded border-[#FFFFFF] flex-shrink-0 mx-auto">
              <MapContainer center={position} zoom={15} className="h-full w-full" style={{ background: '#0C0C0C' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} icon={customIcon}>
                  <Popup>Galerie Pol Lemétais</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="bg-[#0C0C0C] border border-[#FFFFFF] p-6 w-full md:w-[420px] flex-shrink-0 mx-auto">
              <div className="mb-2">
                <span className="text-[#972924] text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] font-bold" style={{ fontFamily: 'Kenyan Coffee, sans-serif' }}>Galerie Pol Lemétais</span>
              </div>
              <div className="text-[#FFFFFF] text-base mb-2">
                24 rue du Rempart Saint Etienne<br />
                31000 TOULOUSE<br /> <br/>
                Ouvert du jeudi au samedi<br />
                de 14h à 16h et sur rendez-vous
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
