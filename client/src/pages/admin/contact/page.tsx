import { useState } from 'react';
import AdminLayout, { API_BASE_URL } from '../components/AdminLayout';
import { useCMSData } from '../hooks/useCMSData';

export default function AdminContactPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const { getFieldValue, loading } = useCMSData('contact');

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
          if (input) input.value = `${API_BASE_URL}${result.imageUrl}`;
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
    
    if (section === 'contact-info') {
      dataObj.title = (formData.get('title') as string)?.trim() || '';
      dataObj.companyName = (formData.get('companyName') as string)?.trim() || '';
      dataObj.address = (formData.get('address') as string)?.trim() || '';
      dataObj.phone = (formData.get('phone') as string)?.trim() || '';
      dataObj.email = (formData.get('email') as string)?.trim() || '';
      dataObj.facebookUrl = (formData.get('facebookUrl') as string)?.trim() || '';
      dataObj.twitterUrl = (formData.get('twitterUrl') as string)?.trim() || '';
      dataObj.linkedinUrl = (formData.get('linkedinUrl') as string)?.trim() || '';
      dataObj.instagramUrl = (formData.get('instagramUrl') as string)?.trim() || '';
      dataObj.youtubeUrl = (formData.get('youtubeUrl') as string)?.trim() || '';
    } else if (section === 'map') {
      dataObj.mapUrl = (formData.get('mapUrl') as string)?.trim() || '';
    } else {
      formData.forEach((value, key) => { 
        if (typeof value === 'string') {
          dataObj[key] = value.trim();
        } else {
          dataObj[key] = value;
        }
      });
    }
    
    try {
      const { saveCMSData } = await import('../../../utils/cms');
      await saveCMSData('contact', section, dataObj);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes.');
    }
  };

  if (loading) {
    return (
      <AdminLayout pageName="Contact" pagePath="/contact">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const sections = ['hero', 'contact-info', 'map'];

  return (
    <AdminLayout pageName="Contact" pagePath="/contact">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeSection === section ? 'bg-[#8DC63F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('hero', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Contact" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                  <input type="url" name="bgImageUrl" defaultValue={getFieldValue('hero', 'bgImageUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/hero-bg.jpg" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'bgImageUrl')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                  </div>
                  {getFieldValue('hero', 'bgImageUrl') && (
                    <div className="mt-2">
                      <img src={getFieldValue('hero', 'bgImageUrl')} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact Info Section */}
        {activeSection === 'contact-info' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Info Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'contact-info')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('contact-info', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Have questions? Get in touch!" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input type="text" name="companyName" defaultValue={getFieldValue('contact-info', 'companyName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Venwind Refex Power Limited" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea name="address" defaultValue={getFieldValue('contact-info', 'address')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="6th Floor, Refex Towers..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" name="phone" defaultValue={getFieldValue('contact-info', 'phone')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="+91 44 - 6990 8410" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" defaultValue={getFieldValue('contact-info', 'email')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="contact@venwindrefex.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                    <input type="url" name="facebookUrl" defaultValue={getFieldValue('contact-info', 'facebookUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://www.facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                    <input type="url" name="twitterUrl" defaultValue={getFieldValue('contact-info', 'twitterUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://x.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input type="url" name="linkedinUrl" defaultValue={getFieldValue('contact-info', 'linkedinUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://www.linkedin.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                    <input type="url" name="instagramUrl" defaultValue={getFieldValue('contact-info', 'instagramUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://www.instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                    <input type="url" name="youtubeUrl" defaultValue={getFieldValue('contact-info', 'youtubeUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://www.youtube.com/..." />
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Map Section */}
        {activeSection === 'map' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Map Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'map')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                  <input type="url" name="mapUrl" defaultValue={getFieldValue('map', 'mapUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://maps.google.com/maps?..." />
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
