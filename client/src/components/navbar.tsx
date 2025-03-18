import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const NavbarLink = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <Link href={href}>
    <a className={`px-1 py-2 text-sm font-medium ${isActive ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary'}`}>
      {children}
    </a>
  </Link>
);

export default function Navbar() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/datasets", label: "Datasets" },
    { href: "/ai-analysis", label: "AI Analysis" },
    { href: "/map", label: "Map View" },
    { href: "/docs", label: "Documentation" },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                <i className="fas fa-database text-sm"></i>
              </div>
              <span className="ml-2 text-xl font-semibold">NYCDB Explorer</span>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <NavbarLink 
                  key={link.href} 
                  href={link.href} 
                  isActive={location === link.href}
                >
                  {link.label}
                </NavbarLink>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="relative">
                <Input
                  className="pl-10 pr-3 w-64"
                  type="text"
                  placeholder="Search datasets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-neutral-400"></i>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="ml-4">
              <i className="fas fa-bell"></i>
            </Button>
            
            <Button variant="ghost" size="icon" className="ml-2">
              <i className="fas fa-cog"></i>
            </Button>
            
            <div className="ml-4 relative flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-neutral-300 flex items-center justify-center">
                <span className="text-xs font-medium">JD</span>
              </div>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a className={`${location === link.href ? 'text-primary font-medium' : 'text-neutral-600'} py-2`}>
                        {link.label}
                      </a>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
