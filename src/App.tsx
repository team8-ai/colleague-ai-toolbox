import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import LoginPage from "@/pages/LoginPage";
import ToolDetailPage from "@/pages/ToolDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import DocumentDetailPage from "@/pages/DocumentDetailPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import PodcastDetailPage from "@/pages/PodcastDetailPage";
import NotFound from "@/pages/NotFound";
import ContentFeedPage from "@/pages/ContentFeedPage";
import { ContentType } from "@/types/content";

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
                        {/* Tools Routes */}
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.TOOL} 
                                title="Tool Library" 
                                description="Explore our collection of helpful tools and utilities."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tag/:tag"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.TOOL} 
                                title="Tool Library" 
                                description="Explore our collection of helpful tools and utilities."
                              />
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
                        
                        {/* Documents Routes */}
                        <Route
                          path="/documents"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.DOCUMENT} 
                                title="Document Library" 
                                description="Browse our documentation, guides, and tutorials."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/documents/tag/:tag"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.DOCUMENT} 
                                title="Document Library" 
                                description="Browse our documentation, guides, and tutorials."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/documents/:id"
                          element={
                            <ProtectedRoute>
                              <DocumentDetailPage />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* News Routes */}
                        <Route
                          path="/news"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.NEWS} 
                                title="News Feed" 
                                description="Stay updated with the latest news and announcements."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/news/tag/:tag"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.NEWS} 
                                title="News Feed" 
                                description="Stay updated with the latest news and announcements."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/news/:id"
                          element={
                            <ProtectedRoute>
                              <NewsDetailPage />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Podcasts Routes */}
                        <Route
                          path="/podcasts"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.PODCAST} 
                                title="Podcast Library" 
                                description="Listen to our podcast episodes and interviews."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/podcasts/tag/:tag"
                          element={
                            <ProtectedRoute>
                              <ContentFeedPage 
                                contentType={ContentType.PODCAST} 
                                title="Podcast Library" 
                                description="Listen to our podcast episodes and interviews."
                              />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/podcasts/:id"
                          element={
                            <ProtectedRoute>
                              <PodcastDetailPage />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Profile Route */}
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* 404 Route */}
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
