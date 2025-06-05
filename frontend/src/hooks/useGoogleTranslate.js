import { useEffect } from 'react';

export const setCookie = (cName, cValue, exDays) => {
    let d = new Date(),
        expires = exDays;
    if (typeof exDays === 'number') {
        d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
        expires = "expires=" + d.toUTCString();
    }
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

export function useGoogleTranslateScript() {
    useEffect(() => {
        const addScript = document.createElement('script');
        addScript.setAttribute(
            'src',
            '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        );
        document.body.appendChild(addScript);

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'fr',
                    includedLanguages: 'en,fr,es,de,it',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            );

            // Masquer la barre de traduction Google et supprimer tous les styles indésirables
            const style = document.createElement('style');
            style.innerHTML = `
                .goog-te-banner-frame {
                    display: none !important;
                }
                .goog-te-menu-value:hover {
                    text-decoration: none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                }
                .goog-te-gadget .goog-te-combo {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                body {
                    top: 0 !important;
                }
                .skiptranslate {
                    display: none !important;
                }
                /* Supprimer les styles de survol et les effets indésirables */
                .goog-te-spinner-pos {
                    display: none !important;
                }
                .goog-te-spinner-animation {
                    display: none !important;
                }
                .goog-te-spinner {
                    display: none !important;
                }
                .goog-te-spinner-img {
                    display: none !important;
                }
                .goog-te-gadget-icon {
                    display: none !important;
                }
                .goog-te-gadget-simple {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    font-size: 0 !important;
                    display: inline-block !important;
                    cursor: pointer !important;
                    zoom: 1 !important;
                }
                .goog-te-gadget-simple:hover {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .goog-te-gadget-simple:focus {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .goog-te-gadget-simple:active {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .goog-te-menu2 {
                    background-color: white !important;
                    border: 1px solid #ccc !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                }
                .goog-te-menu2-item {
                    color: #333 !important;
                    background-color: white !important;
                }
                .goog-te-menu2-item:hover {
                    background-color: #f5f5f5 !important;
                }
                .goog-te-menu2-item:focus {
                    background-color: #f5f5f5 !important;
                }
                .goog-te-menu2-item:active {
                    background-color: #f5f5f5 !important;
                }
                .goog-te-menu2-item div {
                    color: #333 !important;
                }
                .goog-te-menu2-item:link {
                    text-decoration: none !important;
                }
                .goog-te-menu2-item:visited {
                    text-decoration: none !important;
                }
                .goog-te-menu2-item:hover {
                    text-decoration: none !important;
                }
                .goog-te-menu2-item:active {
                    text-decoration: none !important;
                }
                .goog-te-menu2-item:focus {
                    text-decoration: none !important;
                }
                .goog-te-menu2-item:link {
                    color: #333 !important;
                }
                .goog-te-menu2-item:visited {
                    color: #333 !important;
                }
                .goog-te-menu2-item:hover {
                    color: #333 !important;
                }
                .goog-te-menu2-item:active {
                    color: #333 !important;
                }
                .goog-te-menu2-item:focus {
                    color: #333 !important;
                }
                .goog-te-menu2-item div {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:hover {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:focus {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:active {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:link {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:visited {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:hover {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:active {
                    color: #333 !important;
                }
                .goog-te-menu2-item div:focus {
                    color: #333 !important;
                }
                /* Supprimer la couleur violette sur le texte traduit */
                .goog-text-highlight, 
                .goog-text-highlight:hover,
                .goog-text-highlight:focus,
                .goog-text-highlight:active,
                .goog-text-highlight:visited,
                .goog-text-highlight:link {
                    background-color: transparent !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    box-shadow: none !important;
                }
                /* Supprimer les styles de surbrillance Google Translate */
                .goog-te-highlight,
                .goog-te-highlight:hover,
                .goog-te-highlight:focus,
                .goog-te-highlight:active,
                .goog-te-highlight:visited,
                .goog-te-highlight:link {
                    background-color: transparent !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    box-shadow: none !important;
                }
            `;
            document.head.appendChild(style);
        };

        return () => {
            const script = document.querySelector('script[src*="translate.google.com"]');
            if (script) {
                script.remove();
            }
        };
    }, []);
}

export const changeLanguage = (lang) => {
    // Sauvegarder l'URL actuelle avant de changer la langue
    const currentUrl = window.location.href;
    
    // Définir le cookie de traduction
    setCookie('googtrans', `/fr/${lang}`, 'Session');
    
    // Attendre un court instant avant de recharger
    setTimeout(() => {
        // Vérifier si l'URL actuelle est différente de l'URL sauvegardée
        if (window.location.href !== currentUrl) {
            window.location.href = currentUrl;
        } else {
            window.location.reload();
        }
    }, 100);
}; 