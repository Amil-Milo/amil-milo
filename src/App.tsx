import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FAQButton } from "@/components/FAQButton";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Tour from "./pages/Tour";
import Programa from "./pages/Programa";
import Agenda from "./pages/Agenda";
import Diario from "./pages/Diario";
import Conteudos from "./pages/Conteudos";
import WaitingRoom from "./pages/WaitingRoom";
import Prontuario from "./pages/Prontuario";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/programa" element={<Programa />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/conteudos" element={<Conteudos />} />
            <Route path="/prontuario" element={<Prontuario />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FAQButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
