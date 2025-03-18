import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                <i className="fas fa-database text-sm"></i>
              </div>
              <span className="text-lg font-semibold">NYCDB Explorer</span>
            </div>
            <p className="text-neutral-400 text-sm">
              A modern interface for accessing and analyzing NYC housing data from multiple sources.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              Datasets
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/datasets?source=dob" className="text-neutral-400 hover:text-white">
                  Department of Buildings
                </Link>
              </li>
              <li>
                <Link href="/datasets?source=hpd" className="text-neutral-400 hover:text-white">
                  HPD Records
                </Link>
              </li>
              <li>
                <Link href="/datasets?source=pluto" className="text-neutral-400 hover:text-white">
                  PLUTO Data
                </Link>
              </li>
              <li>
                <Link href="/datasets" className="text-neutral-400 hover:text-white">
                  All Datasets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-analysis" className="text-neutral-400 hover:text-white">
                  AI Analysis
                </Link>
              </li>
              <li>
                <Link href="/datasets" className="text-neutral-400 hover:text-white">
                  Data Visualization
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-neutral-400 hover:text-white">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-neutral-400 hover:text-white">
                  API Access
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-neutral-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-neutral-400 hover:text-white">
                  API Reference
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/nycdb/nycdb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white"
                >
                  NYCDB GitHub
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} NYCDB Explorer. Data provided by NYC Open Data and Housing Data Coalition.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a 
              href="https://github.com/nycdb/nycdb" 
              className="text-neutral-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href="#" 
              className="text-neutral-400 hover:text-white"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="mailto:info@nycdbexplorer.org" 
              className="text-neutral-400 hover:text-white"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
