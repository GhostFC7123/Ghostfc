import React, { useState } from 'react';
import { NewsArticle } from '../../types';
import { clubService } from '../../services/clubService';
import { Plus, Edit, Trash2, Calendar, Newspaper, Eye, EyeOff, X, Check, ArrowRight } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';

interface AdminNewsTabProps {
  news: NewsArticle[];
  onRefresh: () => void;
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({ news, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Partial<NewsArticle> | null>(null);
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showNotification = (text: string, error = false) => {
    setNotification({ text, error });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNew = () => {
    setSelectedArticle({
      title: '',
      category: 'CLUB NEWS',
      short_description: '',
      content: '',
      image_url: '',
      published_date: new Date().toISOString().split('T')[0],
      is_published: true,
      author: 'GHOST FC Editorial'
    });
    setIsEditing(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(JSON.parse(JSON.stringify(article)));
    setIsEditing(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleteLoading(true);
    try {
      await clubService.deleteNews(articleToDelete.id);
      showNotification(`Article "${articleToDelete.title}" removed.`);
      setArticleToDelete(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete article', true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (article: NewsArticle) => {
    try {
      await clubService.saveNews({
        id: article.id,
        is_published: !article.is_published
      });
      showNotification(`Article ${!article.is_published ? 'published' : 'unpublished'}.`);
      onRefresh();
    } catch (err: any) {
      showNotification('Failed to toggle status', true);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !selectedArticle.title?.trim()) {
      showNotification('Article headline is required.', true);
      return;
    }

    try {
      await clubService.saveNews(selectedArticle);
      showNotification('Article saved successfully.');
      setIsEditing(false);
      setSelectedArticle(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save article', true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 border flex items-center justify-between gap-3 text-xs font-heading font-black uppercase tracking-wider ${
            notification.error
              ? 'bg-red-950/50 border-[#E50914] text-red-200'
              : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E1E1E] gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
            COMMUNICATIONS DESK
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            NEWS & EDITORIAL DISPATCHES
          </h2>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-sm tracking-wider uppercase transition-colors self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>COMPOSE DISPATCH</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE ARTICLE CARDS (< 768px)                              */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-3">
        {news.map((art) => (
          <div key={art.id} className="bg-[#0C0E14] border border-[#1E222E] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="bg-[#E50914] text-white px-2 py-0.5 text-[9px] font-heading font-black uppercase">
                {art.category}
              </span>
              <span className="text-[#8E93A3]">{art.published_date}</span>
            </div>

            <div className="flex gap-3">
              {art.image_url && (
                <div className="w-16 h-14 bg-[#141620] overflow-hidden shrink-0 border border-[#262B3A]">
                  <img src={art.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-black text-base text-white line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <span className="text-[10px] font-mono text-[#585D6E] block mt-1">By {art.author}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#181B24] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(art)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded ${
                  art.is_published
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {art.is_published ? 'PUBLISHED' : 'DRAFT'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(art)}
                  className="px-3 py-1.5 bg-[#141620] hover:bg-[#1E222E] border border-[#262B3A] text-xs font-mono text-white min-h-[38px] flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>EDIT</span>
                </button>

                <button
                  onClick={() => setArticleToDelete(art)}
                  className="p-2 bg-[#141620] hover:bg-red-950/60 border border-[#262B3A] text-[#8E93A3] hover:text-red-400 min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP ARTICLES TABLE (>= 768px)                                      */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#0C0E14] border border-[#1E222E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101217] border-b border-[#1E222E] font-heading font-black text-[#8E93A3] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">ARTICLE</th>
              <th className="py-3 px-4">CATEGORY</th>
              <th className="py-3 px-4">AUTHOR</th>
              <th className="py-3 px-4">VISIBILITY</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#181B24]">
            {news.map((art) => (
              <tr key={art.id} className="hover:bg-[#101217] transition-colors">
                <td className="py-3.5 px-4 font-mono text-[#8E93A3]">
                  {art.published_date}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {art.image_url && (
                      <div className="w-10 h-10 rounded bg-[#141620] border border-[#262B3A] overflow-hidden shrink-0">
                        <img src={art.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-heading font-black text-sm text-white line-clamp-1">
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-[#585D6E] line-clamp-1 max-w-md">
                        {art.short_description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#141620] border border-[#262B3A] text-white px-2 py-0.5 text-[10px] font-mono">
                    {art.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#8E93A3]">
                  {art.author}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleTogglePublish(art)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                      art.is_published
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {art.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(art)}
                      className="p-1.5 bg-[#141620] hover:bg-[#1E222E] border border-[#262B3A] text-white hover:text-[#E50914] transition-colors"
                      title="Edit article"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setArticleToDelete(art)}
                      className="p-1.5 bg-[#141620] hover:bg-red-950/60 border border-[#262B3A] text-[#8E93A3] hover:text-red-400 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Compose Article Modal */}
      {isEditing && selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#0C0E14] border border-[#242938] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl rounded-t-lg sm:rounded-none overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#1E222E] flex items-center justify-between bg-[#0E1016] shrink-0">
              <div>
                <span className="text-[10px] font-mono text-[#E50914] font-bold uppercase tracking-widest">
                  EDITORIAL PRESS RELEASE
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
                  {selectedArticle.id ? 'EDIT DISPATCH' : 'COMPOSE NEW DISPATCH'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedArticle(null);
                }}
                className="p-2 text-[#8E93A3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={selectedArticle.title || ''}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  placeholder="e.g. GHOST FC Announces Champions Cup Squad Selection"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={selectedArticle.category || 'CLUB NEWS'}
                    onChange={(e) => setSelectedArticle({ ...selectedArticle, category: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  >
                    <option value="MATCH PREVIEW">Match Preview</option>
                    <option value="AWARDS">Awards</option>
                    <option value="TACTICAL FOCUS">Tactical Focus</option>
                    <option value="CLUB NEWS">Club News</option>
                    <option value="TRAINING REPORT">Training Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Editorial Author
                  </label>
                  <input
                    type="text"
                    value={selectedArticle.author || ''}
                    onChange={(e) => setSelectedArticle({ ...selectedArticle, author: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none"
                    placeholder="GHOST FC Editorial"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={selectedArticle.published_date || ''}
                    onChange={(e) => setSelectedArticle({ ...selectedArticle, published_date: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Visibility
                  </label>
                  <select
                    value={selectedArticle.is_published ? 'true' : 'false'}
                    onChange={(e) => setSelectedArticle({ ...selectedArticle, is_published: e.target.value === 'true' })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  >
                    <option value="true">Published (Public)</option>
                    <option value="false">Draft (Internal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Feature Cover Image URL
                </label>
                <input
                  type="text"
                  value={selectedArticle.image_url || ''}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, image_url: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-mono"
                  placeholder="https://... or /stadium_atmosphere_1790354254462.jpg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Lead Summary (1-2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={selectedArticle.short_description || ''}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, short_description: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs p-3 outline-none"
                  placeholder="Brief overview of the article..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Full Dispatch Content
                </label>
                <textarea
                  rows={6}
                  value={selectedArticle.content || ''}
                  onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs p-3 outline-none"
                  placeholder="Write the full report here (separate paragraphs with blank lines)..."
                />
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-4 border-t border-[#1E222E] flex items-center justify-end gap-3 sticky bottom-0 bg-[#0C0E14] py-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedArticle(null);
                  }}
                  className="px-4 py-2.5 bg-[#141620] hover:bg-[#1E222E] text-xs font-heading font-black text-[#8E93A3] hover:text-white uppercase transition-colors min-h-[44px]"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-xs font-heading font-black text-white uppercase tracking-wider transition-colors shadow min-h-[44px]"
                >
                  PUBLISH DISPATCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(articleToDelete)}
        title="DELETE NEWS DISPATCH?"
        message={`Are you sure you want to permanently delete "${articleToDelete?.title}"? This cannot be undone.`}
        confirmLabel="DELETE DISPATCH"
        onConfirm={handleConfirmDelete}
        onCancel={() => setArticleToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
