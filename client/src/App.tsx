import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import Datasets from "@/pages/datasets";
import AiAnalysis from "@/pages/ai-analysis";
import DatasetDetails from "@/pages/dataset-details";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/datasets" component={Datasets} />
          <Route path="/datasets/:id" component={DatasetDetails} />
          <Route path="/ai-analysis" component={AiAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
