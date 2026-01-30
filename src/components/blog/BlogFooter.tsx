import { Link } from "react-router-dom";

export function BlogFooter() {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <Link 
              to="/blog" 
              className="font-serif text-2xl font-bold text-white hover:text-blue-100 transition-colors"
            >
              OTIC GEOYSTEMS
            </Link>
            <p className="text-blue-200/80 mt-3 max-w-md">
             Precision, Positioning and Geospatial Intelligence
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/blog" 
              className="text-blue-100 hover:text-white transition-colors duration-200 hover:underline"
            >
              Articles
            </Link>
            <Link 
              to="/staff/login" 
              className="text-blue-100 hover:text-white transition-colors duration-200 hover:underline"
            >
              Staff Login
            </Link>
            <Link 
              to="/subscribe" 
              className="px-5 py-2 bg-white text-blue-900 font-medium rounded-full hover:bg-blue-50 transition-colors duration-200"
            >
              Subscribe
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-sm text-blue-200/70">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} OTIC Geosystems. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}