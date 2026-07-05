const footerLinks = {
  platform: ['Home', 'Courses', 'Features', 'Pricing'],
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu'],
  company: ['About Us', 'Our Team', 'Careers', 'Contact'],
  support: ['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Service'],
}

export default function Footer() {
  return (
    <footer className="bg-planet-950 text-planet-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-planet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T3P</span>
              </div>
              <span className="text-xl font-bold text-white">TheThirdPlanet</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Pakistan's most accessible educational platform. Quality learning in Urdu & English
              for every student, everywhere.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold text-sm mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-planet-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-planet-500">
            &copy; 2026 TheThirdPlanet. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Facebook', 'YouTube', 'Twitter', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-planet-500 hover:text-white transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
