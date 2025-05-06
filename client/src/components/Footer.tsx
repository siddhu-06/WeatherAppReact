import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-700 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="material-icons mr-2">wb_sunny</span>
              <span className="font-semibold">Weather Forecast</span>
            </div>
            <p className="text-sm text-neutral-300 mt-1">Get accurate weather forecasts for cities worldwide</p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
            <Link href="/" className="text-neutral-300 hover:text-white">
              Home
            </Link>
            <a href="#" className="text-neutral-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-neutral-300 hover:text-white">Terms of Service</a>
          </div>
        </div>
        <div className="mt-6 border-t border-neutral-600 pt-6 text-center text-sm text-neutral-400">
          <p className="font-serif text-lg bg-gradient-to-r from-pink-400 to-blue-500 bg-clip-text text-transparent">
            Made with ❤️ by <span className="font-bold italic text-xl">Siddhu</span>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Weather Forecast App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
