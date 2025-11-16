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
import Jornada from "./pages/jornada";
import Agenda from "./pages/agenda";
import Diario from "./pages/diario";
import Conteudos from "./pages/conteudos";
import CheckinPeriodico from "./pages/check-in-periodico";
import CompletarPerfil from "./pages/CompletarPerfil";
import Prontuario from "./pages/prontuario";
import AdminPanel from "./pages/AdminPanel";
import Perfil from "./pages/perfil";
import Notificacoes from "./pages/notificacoes";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/check-in-periodico" element={<CheckinPeriodico />} />
            <Route path="/completar-perfil" element={<CompletarPerfil />} />
            <Route 
              path="/jornada" 
              element={
                <ProtectedRoute requireAssignedLine={true}>
                  <Jornada />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agenda" 
              element={
                <ProtectedRoute requireAssignedLine={true}>
                  <Agenda />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diario" 
              element={
                <ProtectedRoute requireAssignedLine={true}>
                  <Diario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/conteudos" 
              element={
                <ProtectedRoute requireAssignedLine={true}>
                  <Conteudos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prontuario" 
              element={
                <ProtectedRoute requirePatientProfile={true}>
                  <Prontuario />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute requirePatientProfile={true}>
                  <Perfil />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notificacoes" 
              element={
                <ProtectedRoute>
                  <Notificacoes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
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
