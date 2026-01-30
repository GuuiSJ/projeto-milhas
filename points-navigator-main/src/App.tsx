import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Cards from "@/pages/Cards";
import Purchases from "@/pages/Purchases";
import Notifications from "@/pages/Notifications";
import Promotions from "@/pages/Promotions";
import Reports from "@/pages/Reports";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cartoes" element={<Cards />} />
                <Route path="/compras" element={<Purchases />} />
                <Route path="/notificacoes" element={<Notifications />} />
                <Route path="/promocoes" element={<Promotions />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/perfil" element={<Profile />} />
                
                {/* Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
