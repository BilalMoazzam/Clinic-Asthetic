import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-surface-container py-16 px-4 md:px-10 border-t border-outline mt-auto">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-3xl font-headline text-on-surface mb-6">{settings.brandName || 'VLAS'}</div>
            <p className="text-on-surface-variant text-sm font-normal leading-relaxed mb-8 max-w-xs">
              The digital curator of luxury aesthetic solutions. Redefining elegance through science and serenity.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'public', href: '#' },
                { icon: 'camera_alt', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i}
                  className="w-10 h-10 rounded-full bg-surface border border-outline flex items-center justify-center transition-all hover:border-primary hover:text-primary shadow-sm" 
                  href={social.href}
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-headline text-lg mb-6 text-on-surface">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Special Offers', path: '/exclusive-deals' },
                { name: 'Membership', path: '/velvet-luxe' }
              ].map(link => (
                <li key={link.name}>
                  <Link 
                    className="text-sm text-on-surface-variant transition-colors hover:text-primary" 
                    to={link.path}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6 text-on-surface">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: 'Skin Science', path: '#' },
                { name: 'Seasonal Rituals', path: '#' },
                { name: 'Wellness Travel', path: '#' },
                { name: 'Client Spotlights', path: '#' }
              ].map(link => (
                <li key={link.name}>
                  <a 
                    className="text-sm text-on-surface-variant transition-colors hover:text-primary" 
                    href={link.path}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6 text-on-surface">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-base mt-0.5 text-primary">location_on</span>
                <span className="text-sm text-on-surface-variant leading-relaxed">1022 Velvet Lane, <br/>London W1S 2PS</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base text-primary">call</span>
                <span className="text-sm text-on-surface-variant">+44 20 7946 0122</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base text-primary">mail</span>
                <span className="text-sm text-on-surface-variant">concierge@vlas.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-outline flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant text-center md:text-left">
            © {new Date().getFullYear()} {settings.brandName || 'VLAS'} AESTHETIC SOLUTIONS. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
