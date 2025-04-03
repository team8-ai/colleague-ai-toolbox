
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ToolDetailPage from "@/pages/ToolDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="*"
                element={
                  <>
                    <Header />
                    <div className="flex-1">
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute>
                              <HomePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/category/:category"
                          element={
                            <ProtectedRoute>
                              <HomePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tag/:tag"
                          element={
                            <ProtectedRoute>
                              <HomePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tool/:id"
                          element={
                            <ProtectedRoute>
                              <ToolDetailPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
