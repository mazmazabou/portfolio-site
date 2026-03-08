import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import RideOps from "./pages/RideOps";
import MENARising from "./pages/MENARising";
import FamaFrench from "./pages/FamaFrench";

import AlArd from "./pages/AlArd";
import MicrosoftTax from "./pages/MicrosoftTax";
import DSCI351 from "./pages/DSCI351";
import MENASlides from "./pages/MENASlides";
import CausalForest from "./pages/CausalForest";
import PCAVoting from "./pages/PCAVoting";


function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ride-ops" component={RideOps} />
        <Route path="/mena-rising" component={MENARising} />
        <Route path="/fama-french" component={FamaFrench} />

        <Route path="/al-ard" component={AlArd} />
        <Route path="/microsoft-tax" component={MicrosoftTax} />
        <Route path="/dsci-351" component={DSCI351} />
        <Route path="/mena-slides" component={MENASlides} />
        <Route path="/causal-forest" component={CausalForest} />
        <Route path="/pca-voting" component={PCAVoting} />

        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
