'use client';

import { useState } from 'react';
import {
  Edit3,
  ExternalLink,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { deleteStaffMemberAction, saveStaffMemberAction } from '../actions';
import { StaffMember } from '../lib/staff-data';

interface StaffManagerProps {
  initialStaff: StaffMember[];
  canEdit: boolean;
}

export function StaffManager({ initialStaff, canEdit }: StaffManagerProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingStaff({
      id: '',
      name: '',
      role: 'Assistant Coach',
      category: 'coach',
      credentials: '',
      phone: '',
      email: '',
      notes: '',
      sortOrder: staffList.length + 1,
      createdAt: '',
      updatedAt: '',
    });
    setIsCreating(true);
  };

  const openEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditingStaff(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await saveStaffMemberAction(formData);
      // Update local state
      const updatedItem: StaffMember = {
        id: editingStaff.id || `staff-${Date.now()}`,
        name: String(formData.get('name')),
        role: String(formData.get('role')),
        category: (String(formData.get('category')) || 'coach') as StaffMember['category'],
        credentials: String(formData.get('credentials')) || null,
        phone: String(formData.get('phone')) || null,
        email: String(formData.get('email')) || null,
        notes: String(formData.get('notes')) || null,
        sortOrder: parseInt(String(formData.get('sortOrder') || '1'), 10),
        createdAt: editingStaff.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isCreating) {
        setStaffList((prev) => [...prev, updatedItem]);
      } else {
        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? updatedItem : s))
        );
      }
      closeModal();
    } catch (err) {
      alert((err as Error).message || 'Failed to save staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff profile?')) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('id', id);
    try {
      await deleteStaffMemberAction(formData);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      closeModal();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="handbook-card full-width">
      <div className="handbook-card-head">
        <div className="head-icon blue">
          <Users size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3>Coaching & Squad Management Staff</h3>
              <p>Verified contacts and staff responsibilities for the RVR 2014 squad.</p>
            </div>
            {canEdit && (
              <button
                type="button"
                className="add-staff-btn"
                onClick={openCreateModal}
              >
                <Plus size={14} /> Add Coach / Staff Member
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="staff-roster-grid">
        {staffList.map((staff) => (
          <div className="staff-member-box" key={staff.id}>
            <div className="flex items-center justify-between mb-2">
              <span className={`staff-role-tag ${staff.category}`}>
                {staff.role}
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => openEditModal(staff)}
                  className="edit-staff-pill"
                  title="Edit staff details"
                >
                  <Edit3 size={12} /> Edit
                </button>
              )}
            </div>

            <h4>{staff.name}</h4>
            <p className="staff-meta">
              {staff.credentials || 'Official Squad Staff Member'}
            </p>

            <div className="staff-contact-row">
              <span>{staff.notes || 'Rivervalley Park'}</span>
              {staff.email ? (
                <a
                  href={`mailto:${staff.email}`}
                  className="text-blue-600 font-semibold flex items-center gap-1 text-xs"
                >
                  <Mail size={11} /> Email
                </a>
              ) : (
                <span className="text-slate-400 text-xs">Squad Lead</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Staff Modal */}
      {editingStaff && (
        <div className="staff-modal-overlay" onClick={closeModal}>
          <div
            className="staff-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{isCreating ? 'Add Coach / Staff Member' : `Edit: ${editingStaff.name}`}</h3>
              <button type="button" onClick={closeModal} className="close-modal-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="staff-form">
              <input type="hidden" name="id" value={editingStaff.id} />

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingStaff.name}
                  required
                  placeholder="e.g. Stephen Cranfield"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Official Role Title *</label>
                  <input
                    type="text"
                    name="role"
                    defaultValue={editingStaff.role}
                    required
                    placeholder="e.g. Lead Coach, Assistant Coach, Treasurer"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" defaultValue={editingStaff.category}>
                    <option value="coach">Coach (Tactical & Training)</option>
                    <option value="admin">Admin / Treasurer (Finance & Ops)</option>
                    <option value="welfare">Child Welfare / Safeguarding</option>
                    <option value="medic">Medical / First Aid Lead</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Credentials & Coaching Badges</label>
                <input
                  type="text"
                  name="credentials"
                  defaultValue={editingStaff.credentials || ''}
                  placeholder="e.g. UEFA / FAI Certified Coach · Tactical & Player Dev"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStaff.email || ''}
                    placeholder="name@rivervalleyrangers.ie"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingStaff.phone || ''}
                    placeholder="08X XXX XXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Matchday Notes / Role Responsibilities</label>
                <input
                  type="text"
                  name="notes"
                  defaultValue={editingStaff.notes || ''}
                  placeholder="e.g. Rivervalley Park Pitch 1 · Matchday Lead"
                />
              </div>

              <div className="modal-actions-row">
                {!isCreating && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(editingStaff.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 size={14} /> Remove Coach
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Staff Profile'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
