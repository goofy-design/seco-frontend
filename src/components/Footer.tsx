import Logo from "../assets/seco logo.png";
const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-16 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <a className="flex items-center" href="/">
              <img src={Logo} alt="logo" width={32} className="w-20" />
            </a>
            <p className="mt-4 text-muted-foreground max-w-sm">
              Connecting startups and founders with the resources, investors,
              and opportunities they need to succeed.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/#features"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/#pricing"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/#case-studies"
                >
                  Case Studies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/blog"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/careers"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/docs"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/faq"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  href="/contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-px bg-border mt-12 mb-8"></div>
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div>© 2025 Seco Discover. All rights reserved.</div>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a
              className="hover:text-foreground transition-colors duration-200"
              href="/privacy"
            >
              Privacy
            </a>
            <a
              className="hover:text-foreground transition-colors duration-200"
              href="/terms"
            >
              Terms
            </a>
            <a
              className="hover:text-foreground transition-colors duration-200"
              href="/cookies"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
