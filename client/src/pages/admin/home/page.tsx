import { useState } from 'react';
import AdminLayout, { API_BASE_URL } from '../components/AdminLayout';
import { useCMSData } from '../hooks/useCMSData';

export default function AdminHomePage() {
  const [activeSection, setActiveSection] = useState('hero');
  const { getFieldValue, loading } = useCMSData('home');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.imageUrl) {
          const input = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
          if (input) {
            input.value = `${API_BASE_URL}${result.imageUrl}`;
          }
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, section: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const dataObj: any = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cms/page/home/section/${section}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const dataKey = `cms_home_${section}`;
          localStorage.setItem(dataKey, JSON.stringify(result.data || dataObj));
          window.dispatchEvent(new CustomEvent('cmsUpdate', { detail: { page: 'home', section } }));
          alert('Changes saved successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes.');
    }
  };

  if (loading) {
    return (
      <AdminLayout pageName="Home" pagePath="/">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageName="Home" pagePath="/">
      <div className="space-y-6">
        {/* Section Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {['hero', 'stats', 'differentiators', 'header', 'footer'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeSection === section
                    ? 'bg-[#8DC63F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'hero')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={getFieldValue('hero', 'title')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="Revolutionizing Wind Energy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    name="subtitle"
                    defaultValue={getFieldValue('hero', 'subtitle')}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="Explore the power of cutting-edge wind turbine manufacturing..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    defaultValue={getFieldValue('hero', 'buttonText')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    defaultValue={getFieldValue('hero', 'buttonLink')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="/products"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Video URL</label>
                  <input
                    type="url"
                    name="videoUrl"
                    defaultValue={getFieldValue('hero', 'videoUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL (fallback)</label>
                  <input
                    type="url"
                    name="bgImageUrl"
                    defaultValue={getFieldValue('hero', 'bgImageUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Or upload image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'bgImageUrl')}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Section */}
        {activeSection === 'stats' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Stats Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'stats')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                  <input
                    type="url"
                    name="bgImageUrl"
                    defaultValue={getFieldValue('stats', 'bgImageUrl')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                    placeholder="https://example.com/stats-bg.jpg"
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'bgImageUrl')}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Number</label>
                    <input type="text" name="stat1Number" defaultValue={getFieldValue('stats', 'stat1Number')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="500+" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 1 Label</label>
                    <input type="text" name="stat1Label" defaultValue={getFieldValue('stats', 'stat1Label')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="MW Installed" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Number</label>
                    <input type="text" name="stat2Number" defaultValue={getFieldValue('stats', 'stat2Number')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="25+" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 2 Label</label>
                    <input type="text" name="stat2Label" defaultValue={getFieldValue('stats', 'stat2Label')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Years Experience" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 3 Number</label>
                    <input type="text" name="stat3Number" defaultValue={getFieldValue('stats', 'stat3Number')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="15+" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 3 Label</label>
                    <input type="text" name="stat3Label" defaultValue={getFieldValue('stats', 'stat3Label')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Countries" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 4 Number</label>
                    <input type="text" name="stat4Number" defaultValue={getFieldValue('stats', 'stat4Number')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="98%" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stat 4 Label</label>
                    <input type="text" name="stat4Label" defaultValue={getFieldValue('stats', 'stat4Label')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Uptime" />
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Differentiators Section */}
        {activeSection === 'differentiators' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Differentiators Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'differentiators')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('differentiators', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Why Choose Us" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 1 Title</label>
                  <input type="text" name="feature1Title" defaultValue={getFieldValue('differentiators', 'feature1Title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="German Engineering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 1 Description</label>
                  <textarea name="feature1Desc" defaultValue={getFieldValue('differentiators', 'feature1Desc')} rows={2} maxLength={500} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 1 Image URL</label>
                  <input type="url" name="feature1Image" defaultValue={getFieldValue('differentiators', 'feature1Image')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/feature1.jpg" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'feature1Image')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 2 Title</label>
                  <input type="text" name="feature2Title" defaultValue={getFieldValue('differentiators', 'feature2Title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Proven Technology" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 2 Description</label>
                  <textarea name="feature2Desc" defaultValue={getFieldValue('differentiators', 'feature2Desc')} rows={2} maxLength={500} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 2 Image URL</label>
                  <input type="url" name="feature2Image" defaultValue={getFieldValue('differentiators', 'feature2Image')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/feature2.jpg" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'feature2Image')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 3 Title</label>
                  <input type="text" name="feature3Title" defaultValue={getFieldValue('differentiators', 'feature3Title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Local Support" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 3 Description</label>
                  <textarea name="feature3Desc" defaultValue={getFieldValue('differentiators', 'feature3Desc')} rows={2} maxLength={500} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Description..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature 3 Image URL</label>
                  <input type="url" name="feature3Image" defaultValue={getFieldValue('differentiators', 'feature3Image')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/feature3.jpg" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'feature3Image')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Header Section */}
        {activeSection === 'header' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Header/Navigation</h2>
            <form onSubmit={(e) => handleSubmit(e, 'header')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name/Logo Text</label>
                  <input type="text" name="companyName" defaultValue={getFieldValue('header', 'companyName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="VenWind Refex" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image URL (optional)</label>
                  <input type="url" name="logoUrl" defaultValue={getFieldValue('header', 'logoUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/logo.png" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Section */}
        {activeSection === 'footer' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Footer</h2>
            <form onSubmit={(e) => handleSubmit(e, 'footer')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea name="description" defaultValue={getFieldValue('footer', 'description')} rows={3} maxLength={500} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Leading manufacturer of wind turbines..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" defaultValue={getFieldValue('footer', 'email')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="info@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="text" name="phone" defaultValue={getFieldValue('footer', 'phone')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="+91 44 - 3504 0050" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" name="address" defaultValue={getFieldValue('footer', 'address')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="123 Wind Energy St, City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                  <input type="text" name="copyright" defaultValue={getFieldValue('footer', 'copyright')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="© 2025 Company Name. All rights reserved." />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

