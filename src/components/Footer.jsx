import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer
      className="py-16 px-4 md:px-10 border-t border-outline mt-auto"
      style={{
        backgroundColor: 'rgb(110, 79, 90)',
        color: '#fff',
      }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-3xl font-headline text-white mb-6">
              {settings.brandName || 'VLAS'}
            </div>

            <p className="text-white/80 text-sm font-normal leading-relaxed mb-8 max-w-xs">
              The digital curator of luxury aesthetic solutions. Redefining elegance through science and serenity.
            </p>

            <div className="flex gap-3">
              {[
                { icon: 'public', href: '#' },
                { icon: 'camera_alt', href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all hover:opacity-80"
                >
                  <span className="material-symbols-outlined text-lg text-white">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6 text-white">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Special Offers', path: '/exclusive-deals' },
                { name: 'Membership', path: '/velvet-luxe' }
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6 text-white">
              Resources
            </h4>

            <ul className="space-y-3">
              {[
                { name: 'Skin Science', path: '#' },
                { name: 'Seasonal Rituals', path: '#' },
                { name: 'Wellness Travel', path: '#' },
                { name: 'Client Spotlights', path: '#' }
              ].map(link => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-lg mb-6 text-white">
              Contact Us
            </h4>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-base mt-0.5 text-white">
                  location_on
                </span>
                <span className="text-sm text-white/80 leading-relaxed">
                  1022 Velvet Lane,
                  <br />
                  London W1S 2PS
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base text-white">
                  call
                </span>
                <span className="text-sm text-white/80">
                  +44 20 7946 0122
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base text-white">
                  mail
                </span>
                <span className="text-sm text-white/80">
                  concierge@vlas.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/70 text-center md:text-left">
            © {new Date().getFullYear()} {settings.brandName || 'VLAS'} AESTHETIC
            SOLUTIONS. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

