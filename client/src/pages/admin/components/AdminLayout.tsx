import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageName: string;
  pagePath: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export default function AdminLayout({ children, pageName, pagePath }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [, setUploadingImage] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Check if investor user is trying to access non-investor pages
    const userType = localStorage.getItem('userType') || 'Admin';
    if (userType === 'Investors') {
      // Only allow access to investor relations page
      if (!pagePath.includes('investor-relations')) {
        navigate('/admin/investor-relations');
        return;
      }
    }
  }, [navigate, pagePath]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/login');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
              <p className="text-sm text-gray-600 mt-1">Edit {pageName} page content and images</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap">
                <i className="ri-arrow-left-line mr-2"></i>Back to Admin
              </a>
              <a href={pagePath} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                <i className="ri-eye-line mr-2"></i>View Page
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-logout-box-line mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-6 bg-[#8DC63F] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <i className="ri-check-line mr-2"></i>Changes saved successfully!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}

// Export helper functions for use in child components
export { API_BASE_URL };

