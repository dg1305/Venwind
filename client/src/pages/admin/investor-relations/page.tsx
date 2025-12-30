import { useState, useEffect } from 'react';
import * as React from 'react';
import AdminLayout, { API_BASE_URL } from '../components/AdminLayout';
import { useCMSData } from '../hooks/useCMSData';

export default function AdminInvestorRelationsPage() {
  const [activeSection, setActiveSection] = useState('annual-return');
  const [activeSubsection, setActiveSubsection] = useState('fy-2024-25');
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    documents: Array<{ name: string; url: string; description: string }>;
  }>({
    title: '',
    content: '',
    documents: [],
  });
  const { getFieldValue, loading, refreshData } = useCMSData('investor-relations');

  const sections = [
    {
      id: 'annual-return',
      title: 'Annual Return',
      subsections: [
        { id: 'fy-2024-25', title: 'FY 2024-25' },
        { id: 'fy-2025-26', title: 'FY 2025-26' },
      ],
    },
    {
      id: 'notice-general-meetings',
      title: 'Notice of the General meetings',
      subsections: [
        { id: 'fy-2024-25', title: 'FY 2024-25' },
        { id: 'fy-2025-26', title: 'FY 2025-26' },
      ],
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (allow PDF, DOC, DOCX, XLS, XLSX, etc.)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
      alert('Please upload a valid document file (PDF, DOC, DOCX, XLS, XLSX)');
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size is too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }

    const uploadKey = `doc_${docIndex}`;
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file); // Use 'file' field name to match backend endpoint
      
      const response = await fetch(`${API_BASE_URL}/api/upload/file`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.fileUrl) {
          const fullUrl = `${API_BASE_URL}${result.fileUrl}`;
          // Update form state directly
          setFormData(prev => {
            const newDocuments = [...prev.documents];
            if (!newDocuments[docIndex - 1]) {
              newDocuments[docIndex - 1] = { name: '', url: '', description: '' };
            }
            newDocuments[docIndex - 1] = {
              ...newDocuments[docIndex - 1],
              url: fullUrl,
              name: newDocuments[docIndex - 1].name || file.name.replace(/\.[^/.]+$/, ''), // Auto-fill name if empty
            };
            return { ...prev, documents: newDocuments };
          });
          alert('File uploaded successfully! The URL has been set. Click "Save Changes" to save it.');
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        const errorText = await response.text();
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error.message || 'Please try again'}`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sectionKey = `${activeSection}_${activeSubsection}`;
    
    // Use state data directly instead of FormData
    const dataObj: any = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      documents: formData.documents
        .filter(doc => doc.name && doc.url) // Only include documents with both name and URL
        .map(doc => ({
          name: doc.name.trim(),
          url: doc.url.trim(),
          description: doc.description.trim(),
        })),
    };

    try {
      const { saveCMSData } = await import('../../../utils/cms');
      await saveCMSData('investor-relations', sectionKey, dataObj);
      
      // Dispatch custom event to update frontend immediately
      window.dispatchEvent(
        new CustomEvent('cmsUpdate', {
          detail: { 
            page: 'investor-relations', 
            section: sectionKey
          },
        })
      );
      
      // Don't refresh immediately - the form data is already correct
      // Only refresh in background to sync with server
      setTimeout(() => {
        refreshData();
      }, 500);
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes.');
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find(s => s.id === activeSubsection);
  const sectionKey = `${activeSection}_${activeSubsection}`;
  const sectionData = getFieldValue(sectionKey);
  const currentContent = sectionData ? {
    title: sectionData.title || '',
    content: sectionData.content || '',
    documents: sectionData.documents || [],
  } : null;

  // Update form data ONLY when section/subsection changes, not during refresh
  useEffect(() => {
    if (!loading) {
      const sectionData = getFieldValue(sectionKey);
      if (sectionData) {
        setFormData({
          title: sectionData.title || '',
          content: sectionData.content || '',
          documents: Array.isArray(sectionData.documents) && sectionData.documents.length > 0 
            ? [...sectionData.documents, ...Array(Math.max(0, 5 - sectionData.documents.length)).fill({ name: '', url: '', description: '' })].slice(0, 5)
            : [
                { name: '', url: '', description: '' },
                { name: '', url: '', description: '' },
                { name: '', url: '', description: '' },
                { name: '', url: '', description: '' },
                { name: '', url: '', description: '' },
              ],
        });
      } else {
        // Only clear if switching to a new empty section
        setFormData({
          title: '',
          content: '',
          documents: [
            { name: '', url: '', description: '' },
            { name: '', url: '', description: '' },
            { name: '', url: '', description: '' },
            { name: '', url: '', description: '' },
            { name: '', url: '', description: '' },
          ],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, activeSubsection]); // Only update when section changes, ignore loading/refresh

  if (loading) {
    return (
      <AdminLayout pageName="Investor Relations" pagePath="/investor-relations">
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageName="Investor Relations" pagePath="/investor-relations">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Investor Relations CMS</h1>
          
          {/* Section and Subsection Selector */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={activeSection}
                onChange={(e) => {
                  setActiveSection(e.target.value);
                  const section = sections.find(s => s.id === e.target.value);
                  if (section && section.subsections.length > 0) {
                    setActiveSubsection(section.subsections[0].id);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subsection</label>
              <select
                value={activeSubsection}
                onChange={(e) => setActiveSubsection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
              >
                {currentSection?.subsections.map((subsection) => (
                  <option key={subsection.id} value={subsection.id}>
                    {subsection.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  name="content"
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent"
                  placeholder="Enter content here..."
                />
              </div>

              {/* Documents Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Documents</label>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const doc = formData.documents[num - 1] || { name: '', url: '', description: '' };
                    return (
                      <div key={num} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Document {num}</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Document Name</label>
                            <input
                              type="text"
                              name={`doc_${num}_name`}
                              value={doc.name}
                              onChange={(e) => {
                                const newDocuments = [...formData.documents];
                                if (!newDocuments[num - 1]) {
                                  newDocuments[num - 1] = { name: '', url: '', description: '' };
                                }
                                newDocuments[num - 1] = { ...newDocuments[num - 1], name: e.target.value };
                                setFormData(prev => ({ ...prev, documents: newDocuments }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm"
                              placeholder="e.g., Annual Report 2024-25"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Document URL</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                name={`doc_${num}_url`}
                                value={doc.url}
                                onChange={(e) => {
                                  const newDocuments = [...formData.documents];
                                  if (!newDocuments[num - 1]) {
                                    newDocuments[num - 1] = { name: '', url: '', description: '' };
                                  }
                                  newDocuments[num - 1] = { ...newDocuments[num - 1], url: e.target.value };
                                  setFormData(prev => ({ ...prev, documents: newDocuments }));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm"
                                placeholder="https://example.com/document.pdf"
                              />
                              {doc.url && (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                                >
                                  <i className="ri-external-link-line mr-1"></i>View
                                </a>
                              )}
                            </div>
                            <div className="mt-2">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                onChange={(e) => handleFileUpload(e, num)}
                                disabled={uploadingFiles[`doc_${num}`]}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#8DC63F] file:text-white hover:file:bg-[#7AB62F] file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {uploadingFiles[`doc_${num}`] && (
                                <div className="mt-2 text-sm text-blue-600 flex items-center">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Uploading file...
                                </div>
                              )}
                            </div>
                            {doc.url && (
                              <p className="mt-1 text-xs text-gray-500">
                                <i className="ri-file-line mr-1"></i>File uploaded: {doc.url.split('/').pop()}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description (Optional)</label>
                            <input
                              type="text"
                              name={`doc_${num}_description`}
                              value={doc.description}
                              onChange={(e) => {
                                const newDocuments = [...formData.documents];
                                if (!newDocuments[num - 1]) {
                                  newDocuments[num - 1] = { name: '', url: '', description: '' };
                                }
                                newDocuments[num - 1] = { ...newDocuments[num - 1], description: e.target.value };
                                setFormData(prev => ({ ...prev, documents: newDocuments }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DC63F] focus:border-transparent text-sm"
                              placeholder="Brief description"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#8DC63F] text-white rounded-lg hover:bg-[#7AB62F] transition-colors"
              >
                <i className="ri-save-line mr-2"></i>Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

