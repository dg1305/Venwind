import { useState } from 'react';
import AdminLayout, { API_BASE_URL } from '../components/AdminLayout';
import { useCMSData } from '../hooks/useCMSData';

export default function AdminProductsPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const { getFieldValue, loading, refreshData } = useCMSData('products');
  const [uploadingIcons, setUploadingIcons] = useState<Record<string, boolean>>({});
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const uploadKey = fieldName;
    setUploadingIcons(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Use relative path if API_BASE_URL is empty (works with Vite proxy)
      const uploadUrl = API_BASE_URL ? `${API_BASE_URL}/api/upload/image` : '/api/upload/image';
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.imageUrl) {
          // Construct full URL - if API_BASE_URL is empty, use relative path
          const fullUrl = API_BASE_URL 
            ? `${API_BASE_URL}${result.imageUrl}` 
            : result.imageUrl;
          
          // Update state for immediate preview
          setIconUrls(prev => ({ ...prev, [uploadKey]: fullUrl }));
          
          // Update the input field
          const input = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
          if (input) {
            input.value = fullUrl;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          
          alert('Icon uploaded successfully! Click "Save Changes" to save.');
        } else {
          alert('Failed to upload icon: ' + (result.error || 'Unknown error'));
        }
      } else {
        const errorText = await response.text();
        alert('Failed to upload icon. Please try again.');
        console.error('Upload error:', errorText);
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('Failed to upload icon. Please try again.');
    } finally {
      setUploadingIcons(prev => ({ ...prev, [uploadKey]: false }));
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, section: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dataObj: any = {};
    
    // Special handling for array sections
    if (section === 'features' || section === 'specifications' || section === 'technical-benefits') {
      const items: any[] = [];
      const maxItems = section === 'features' ? 6 : (section === 'specifications' ? 6 : 10);
      
      for (let i = 1; i <= maxItems; i++) {
        const title = (formData.get(`${section}_${i}_title`) as string)?.trim();
        const description = (formData.get(`${section}_${i}_description`) as string)?.trim();
        const value = (formData.get(`${section}_${i}_value`) as string)?.trim();
        const label = (formData.get(`${section}_${i}_label`) as string)?.trim();
        const icon = (formData.get(`${section}_${i}_icon`) as string)?.trim();
        
        if (section === 'specifications') {
          if (value || label || i <= 6) {
            items.push({ value: value || '', label: label || '' });
          }
        } else if (section === 'features') {
          // Always save all 6 features
          items.push({ 
            icon: icon || '', 
            title: title || '', 
            description: description || '' 
          });
        } else if (section === 'technical-benefits' && (title || description || icon)) {
          items.push({ 
            icon: icon || '', 
            title: title || '', 
            description: description || '' 
          });
        }
      }
      dataObj.items = items;
      dataObj.title = (formData.get('title') as string)?.trim() || '';
    } else if (section === 'gallery') {
      const images: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const imageUrl = (formData.get(`image_${i}`) as string)?.trim();
        if (imageUrl) images.push(imageUrl);
      }
      dataObj.images = images;
    } else {
      formData.forEach((value, key) => { 
        dataObj[key] = value;
      });
    }
    
    try {
      const { saveCMSData } = await import('../../../utils/cms');
      await saveCMSData('products', section, dataObj);
      
      // Dispatch custom event to update frontend immediately
      window.dispatchEvent(
        new CustomEvent('cmsUpdate', {
          detail: { 
            page: 'products', 
            section: section
          },
        })
      );
      
      // Refresh data
      setTimeout(() => {
        refreshData();
      }, 500);
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes.');
    }
  };

  if (loading) {
    return (
      <AdminLayout pageName="Products" pagePath="/products">
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const sections = ['hero', 'intro', 'features', 'specifications', 'technical-benefits', 'gallery', 'brochure'];

  return (
    <AdminLayout pageName="Products" pagePath="/products">
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
                {section.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
                  <input type="text" name="title" defaultValue={getFieldValue('hero', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Products" />
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

        {/* Intro Section */}
        {activeSection === 'intro' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Intro Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'intro')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('intro', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="State-of-the-Art Wind Turbine Solutions" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                  <textarea name="paragraph1" defaultValue={getFieldValue('intro', 'paragraph1')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="First paragraph..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                  <textarea name="paragraph2" defaultValue={getFieldValue('intro', 'paragraph2')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Second paragraph..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                  <textarea name="paragraph3" defaultValue={getFieldValue('intro', 'paragraph3')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Third paragraph..." />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'features')}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('features', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Why choose the GWH182-5.3MW wind turbine?" />
                </div>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const items = getFieldValue('features', 'items') || [];
                  const item = items[num - 1] || { icon: '', title: '', description: '' };
                  const iconFieldName = `features_${num}_icon`;
                  const currentIconUrl = iconUrls[iconFieldName] || item.icon || '';
                  const isIconImage = currentIconUrl && (currentIconUrl.startsWith('http') || currentIconUrl.startsWith('/') || currentIconUrl.includes('.') && !currentIconUrl.startsWith('ri-'));
                  
                  return (
                    <div key={num} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Feature {num}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Upload Icon Image:</label>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, iconFieldName)} 
                                disabled={uploadingIcons[iconFieldName]}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                              />
                              {uploadingIcons[iconFieldName] && (
                                <div className="mt-1 text-xs text-blue-600 flex items-center">
                                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Uploading...
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Or enter Icon URL / RemixIcon class:</label>
                              <input 
                                type="text" 
                                name={iconFieldName} 
                                defaultValue={currentIconUrl} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" 
                                placeholder="https://example.com/icon.png or ri-settings-3-line" 
                              />
                            </div>
                            {currentIconUrl && (
                              <div className="mt-2">
                                {isIconImage ? (
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={currentIconUrl} 
                                      alt={`Icon ${num}`} 
                                      className="w-12 h-12 object-contain rounded border border-gray-200 bg-white p-1" 
                                    />
                                    <span className="text-xs text-gray-500">Icon Preview</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#8DC63F]/10 flex items-center justify-center">
                                      <i className={`${currentIconUrl} text-[#8DC63F] text-2xl`}></i>
                                    </div>
                                    <span className="text-xs text-gray-500">RemixIcon Preview</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input type="text" name={`features_${num}_title`} defaultValue={item.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="Feature title" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                          <textarea name={`features_${num}_description`} defaultValue={item.description} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="Feature description" />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Specifications Section */}
        {activeSection === 'specifications' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'specifications')}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('specifications', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Technical Specifications" />
                </div>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const items = getFieldValue('specifications', 'items') || [];
                  const item = items[num - 1] || { value: '', label: '' };
                  return (
                    <div key={num} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Specification {num}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                          <input type="text" name={`specifications_${num}_value`} defaultValue={item.value} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="5.3 MW" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                          <input type="text" name={`specifications_${num}_label`} defaultValue={item.label} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="Rated Capacity" />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Technical Benefits Section */}
        {activeSection === 'technical-benefits' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Benefits Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'technical-benefits')}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('technical-benefits', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Technical Benefits" />
                </div>
                {[1, 2, 3, 4, 5].map((num) => {
                  const items = getFieldValue('technical-benefits', 'items') || [];
                  const item = items[num - 1] || { icon: '', title: '', description: '' };
                  const iconFieldName = `technical-benefits_${num}_icon`;
                  const currentIconUrl = iconUrls[iconFieldName] || item.icon || '';
                  const isIconImage = currentIconUrl && (currentIconUrl.startsWith('http') || currentIconUrl.startsWith('/') || currentIconUrl.includes('.') && !currentIconUrl.startsWith('ri-'));
                  
                  return (
                    <div key={num} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">Benefit {num}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Upload Icon Image:</label>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, iconFieldName)} 
                                disabled={uploadingIcons[iconFieldName]}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                              />
                              {uploadingIcons[iconFieldName] && (
                                <div className="mt-1 text-xs text-blue-600 flex items-center">
                                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Uploading...
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Or enter Icon URL / RemixIcon class:</label>
                              <input 
                                type="text" 
                                name={iconFieldName} 
                                defaultValue={currentIconUrl} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" 
                                placeholder="https://example.com/icon.png or ri-settings-3-line" 
                              />
                            </div>
                            {currentIconUrl && (
                              <div className="mt-2">
                                {isIconImage ? (
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={currentIconUrl} 
                                      alt={`Icon ${num}`} 
                                      className="w-12 h-12 object-contain rounded border border-gray-200 bg-white p-1" 
                                    />
                                    <span className="text-xs text-gray-500">Icon Preview</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#8DC63F]/10 flex items-center justify-center">
                                      <i className={`${currentIconUrl} text-[#8DC63F] text-2xl`}></i>
                                    </div>
                                    <span className="text-xs text-gray-500">RemixIcon Preview</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input type="text" name={`technical-benefits_${num}_title`} defaultValue={item.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="Benefit title" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                          <textarea name={`technical-benefits_${num}_description`} defaultValue={item.description} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm" placeholder="Benefit description" />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'gallery')}>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                  const images = getFieldValue('gallery', 'images') || [];
                  const imageUrl = images[num - 1] || '';
                  return (
                    <div key={num} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image {num} URL</label>
                      <input type="url" name={`image_${num}`} defaultValue={imageUrl} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/image.jpg" />
                      <div className="mt-2">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, `image_${num}`)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer" />
                      </div>
                      {imageUrl && (
                        <div className="mt-2">
                          <img src={imageUrl} alt={`Preview ${num}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        </div>
                      )}
                    </div>
                  );
                })}
                <button type="submit" className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors">
                  <i className="ri-save-line mr-2"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Brochure Section */}
        {activeSection === 'brochure' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Brochure Section</h2>
            <form onSubmit={(e) => handleSubmit(e, 'brochure')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input type="text" name="title" defaultValue={getFieldValue('brochure', 'title')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Download Our Product Brochure!" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input type="text" name="buttonText" defaultValue={getFieldValue('brochure', 'buttonText')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="Download" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brochure URL</label>
                  <input type="url" name="brochureUrl" defaultValue={getFieldValue('brochure', 'brochureUrl')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent" placeholder="https://example.com/brochure.pdf" />
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
