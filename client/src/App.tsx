import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Weather from "@/pages/weather";
import { WeatherProvider } from "./context/WeatherContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/weather/:cityName" component={Weather} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto px-4 py-6 flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </WeatherProvider>
    </QueryClientProvider>
  );
}

export default App;
