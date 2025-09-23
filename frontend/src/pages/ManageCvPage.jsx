import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

// Get the base API URL from Vite's environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// --- A Reusable Modal Component with Your Styling ---
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

// --- A Reusable Notification Component ---
const Notification = ({ message, type, onClear }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 z-[60] rounded-lg px-4 py-2 text-sm font-medium shadow-lg animate-[fade-in-down_0.2s_ease-out]";
  const typeClasses = type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white';
  
  useEffect(() => {
    const timer = setTimeout(() => onClear(), 4000);
    return () => clearTimeout(timer);
  }, [onClear]);

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

// --- The Main Page Component ---
const ManageCvPage = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type) => setNotification({ message, type });

  const fetchCvData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/cv`);
      setCvData(data);
    } catch (err) { setError('Failed to load CV data.'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { setLoading(true); fetchCvData(); }, []);

  const openModal = (type, item = {}) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleItemSubmit = async (e, endpoint, item) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isEditing = !!item._id;
    const url = isEditing ? `${API_BASE_URL}/api/cv/${endpoint}/${item._id}` : `${API_BASE_URL}/api/cv/${endpoint}`;
    const method = isEditing ? 'put' : 'post';
    try {
      await axios[method](url, item);
      await fetchCvData();
      closeModal();
      showNotification(`${modalType} saved successfully!`, 'success');
    } catch (err) { showNotification(`Failed to save ${modalType}`, 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleItemDelete = async (endpoint, id, itemName) => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cv/${endpoint}/${id}`);
        await fetchCvData();
        showNotification(`${itemName} deleted successfully!`, 'success');
      } catch (err) { showNotification(`Failed to delete ${itemName}`, 'error'); }
    }
  };
  
  const handleMainDetailsSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const { fullName, email, phone, linkedIn, github, aboutMe } = cvData;
          await axios.put(`${API_BASE_URL}/api/cv`, { fullName, email, phone, linkedIn, github, aboutMe });
          showNotification('Main details updated successfully!', 'success');
      } catch (err) { showNotification('Failed to update main details.', 'error'); } 
      finally { setIsSubmitting(false); }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            try {
                await axios.put(`${API_BASE_URL}/api/cv/profile-picture`, { image: reader.result });
                await fetchCvData();
                showNotification('Profile picture updated!', 'success');
            } catch (err) { showNotification('Failed to upload profile picture.', 'error'); }
        }
    }
  };

  const handleAddSkillCategory = async (e) => {
    e.preventDefault();
    const category = e.target.elements.category.value.trim();
    if (!category) return;
    try {
        await axios.post(`${API_BASE_URL}/api/cv/skills/category`, { category });
        e.target.reset();
        await fetchCvData();
        showNotification('Skill category added!', 'success');
    } catch (err) { showNotification(err.response?.data?.message || 'Failed to add category.', 'error'); }
  };

  const handleAddSkill = async (e, categoryId) => {
    e.preventDefault();
    const item = e.target.elements.skill.value.trim();
    if (!item) return;
    try {
      await axios.post(`${API_BASE_URL}/api/cv/skills/${categoryId}`, { item });
      e.target.reset();
      await fetchCvData();
    } catch (err) { showNotification('Failed to add skill.', 'error'); }
  };
    
  const handleDeleteSkill = async (categoryId, itemIndex) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
        try {
            await axios.delete(`${API_BASE_URL}/api/cv/skills/${categoryId}/${itemIndex}`);
            await fetchCvData();
        } catch (err) { showNotification('Failed to delete skill.', 'error'); }
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-center text-rose-500 p-8">{error}</div>;
  if (!cvData) return <div className="text-center text-slate-500 p-8">No CV data found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />
      <h1 className="text-3xl md:text-4xl font-extrabold text-center"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500">Manage Your CV</span></h1>

      {/* Profile & Main Details */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Profile & Main Details</h2>
        <div className="flex items-center gap-6 mb-6">
          <img src={cvData.profilePictureUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md" />
          <div>
            <label htmlFor="profilePicUpload" className="cursor-pointer rounded-full bg-slate-800 px-4 py-2 text-white shadow hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">Change Picture</label>
            <input type="file" id="profilePicUpload" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
          </div>
        </div>
        <form onSubmit={handleMainDetailsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={cvData.fullName || ''} onChange={e => setCvData({ ...cvData, fullName: e.target.value })} placeholder="Full Name" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
            <input value={cvData.email || ''} onChange={e => setCvData({ ...cvData, email: e.target.value })} placeholder="Email" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
            <input value={cvData.phone || ''} onChange={e => setCvData({ ...cvData, phone: e.target.value })} placeholder="Phone" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
            <input value={cvData.linkedIn || ''} onChange={e => setCvData({ ...cvData, linkedIn: e.target.value })} placeholder="LinkedIn URL" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
            <input value={cvData.github || ''} onChange={e => setCvData({ ...cvData, github: e.target.value })} placeholder="GitHub URL" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
          </div>
          <textarea value={cvData.aboutMe || ''} onChange={e => setCvData({ ...cvData, aboutMe: e.target.value })} placeholder="About Me" rows="5" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" />
          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 font-semibold text-white shadow hover:shadow-lg disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save Main Details'}</button>
        </form>
      </section>

      {/* Experiences */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Experiences</h2><button onClick={() => openModal('experiences')} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">Add Experience</button></div>
        <div className="space-y-4">{cvData.experiences.map((item) => (<div key={item._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.title}</p><p className="text-slate-700 dark:text-slate-300">{item.organization} - <span className="text-sm italic">{item.type}</span></p><p className="text-sm text-slate-500">{item.dateRange}</p></div><div className="flex items-center gap-3"><button onClick={() => openModal('experiences', item)} className="text-blue-700 dark:text-cyan-400">Edit</button><button onClick={() => handleItemDelete('experiences', item._id, 'experience')} className="text-rose-600">Delete</button></div></div><ul className="mt-2 list-inside list-disc pl-4 text-slate-700 dark:text-slate-300">{item.responsibilities.map((resp, i) => (<li key={i}>{resp}</li>))}</ul></div>))}</div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Skills</h2>
        {cvData.skills.map(cat => (<div key={cat._id} className="mb-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"><h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{cat.category}</h3><div className="flex flex-wrap gap-2 mb-3">{cat.items.map((item, index) => (<div key={index} className="flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-sm dark:bg-slate-700"><span className="text-slate-800 dark:text-slate-200">{item}</span><button onClick={() => handleDeleteSkill(cat._id, index)} className="text-rose-500 hover:text-rose-700">&times;</button></div>))}</div><form onSubmit={(e) => handleAddSkill(e, cat._id)} className="flex gap-2"><input name="skill" type="text" placeholder="Add new skill..." className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><button type="submit" className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white shadow hover:bg-emerald-700">+</button></form></div>))}
        <form onSubmit={handleAddSkillCategory} className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700"><h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Add New Skill Category</h3><div className="flex gap-2"><input name="category" type="text" placeholder="New Category Name" className="w-full rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700">Create</button></div></form>
      </section>

      {/* Certifications */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Certifications</h2><button onClick={() => openModal('certifications')} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">Add Certification</button></div>
        <div className="space-y-4">{cvData.certifications.map(item => (<div key={item._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.name}</p><p className="text-slate-700 dark:text-slate-300">{item.issuer}</p>{item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline dark:text-cyan-400">View Credential</a>}</div><div className="flex items-center gap-3"><button onClick={() => openModal('certifications', item)} className="text-blue-700 dark:text-cyan-400">Edit</button><button onClick={() => handleItemDelete('certifications', item._id, 'certification')} className="text-rose-600">Delete</button></div></div></div>))}</div>
      </section>

      {/* Modal Rendering */}
      {isModalOpen && (<Modal onClose={closeModal}>
          {modalType === 'experiences' && (<form onSubmit={(e) => handleItemSubmit(e, 'experiences', editingItem)} className="space-y-4"><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{editingItem._id ? 'Edit' : 'Add'} Experience</h2><input value={editingItem.title || ''} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><input value={editingItem.organization || ''} onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })} placeholder="Organization" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><input value={editingItem.dateRange || ''} onChange={(e) => setEditingItem({ ...editingItem, dateRange: e.target.value })} placeholder="Date Range" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><select value={editingItem.type || ''} onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })} className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required><option value="">Select Type</option><option value="Work">Work</option><option value="Organization">Organization</option><option value="Volunteer">Volunteer</option></select><textarea value={(editingItem.responsibilities || []).join('\n')} onChange={(e) => setEditingItem({ ...editingItem, responsibilities: e.target.value.split('\n') })} placeholder="Responsibilities (one per line)" rows="4" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" /><button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 font-semibold text-white shadow hover:shadow-lg disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save'}</button></form>)}
          {modalType === 'certifications' && (<form onSubmit={(e) => handleItemSubmit(e, 'certifications', editingItem)} className="space-y-4"><h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{editingItem._id ? 'Edit' : 'Add'} Certification</h2><input value={editingItem.name || ''} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} placeholder="Certification Name" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><input value={editingItem.issuer || ''} onChange={(e) => setEditingItem({ ...editingItem, issuer: e.target.value })} placeholder="Issuing Organization" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" required /><input value={editingItem.url || ''} onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })} placeholder="Credential URL" className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" /><button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 font-semibold text-white shadow hover:shadow-lg disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save'}</button></form>)}
      </Modal>)}
    </div>
  );
};

export default ManageCvPage;