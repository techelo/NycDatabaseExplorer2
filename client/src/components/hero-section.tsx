import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">NYC Housing Data Explorer</h1>
            <p className="text-white/90 mb-6">
              Access, analyze, and visualize NYC housing data from multiple sources including Department of Buildings, HPD, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/datasets">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Browse Datasets
                </Button>
              </Link>
              <Link href="/ai-analysis">
                <Button size="lg" className="bg-[#F72585] hover:bg-[#F72585]/90 text-white">
                  <i className="fas fa-robot mr-2"></i> AI Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
