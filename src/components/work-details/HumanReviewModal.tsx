import React, { useState } from 'react';
import { Work } from '../../types/work';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ShieldAlert, XCircle, Clock, FileText, User } from 'lucide-react';

interface HumanReviewModalProps {
  work: Work;
  isOpen: boolean;
  onClose: () => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({ work, isOpen, onClose }) => {
  const { handleUpdateWorkReview, activeOfficer } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'>(
    work.reviewStatus || 'UNDER_REVIEW'
  );
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    handleUpdateWorkReview(work.workId, selectedStatus, note);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Human Administrative Review: ${work.workId}`}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={14} />
                <span>Saved & Logged!</span>
              </>
            ) : (
              <span>Commit Review Decision</span>
            )}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          color: '#1e3a8a',
          lineHeight: 1.4
        }}>
          <strong>Statutory Protocol:</strong> The decision taken here will be logged into the national audit trail with your digital administrative signature ({activeOfficer}). AI predictions remain supplementary decision support.
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Administrative Review Status
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedStatus('UNDER_REVIEW')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: selectedStatus === 'UNDER_REVIEW' ? '2px solid #2563eb' : '1px solid var(--border-medium)',
                backgroundColor: selectedStatus === 'UNDER_REVIEW' ? '#eff6ff' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Clock size={16} color="#2563eb" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>Under Review</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Active field or voucher inquiry</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('RESOLVED')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: selectedStatus === 'RESOLVED' ? '2px solid #16a34a' : '1px solid var(--border-medium)',
                backgroundColor: selectedStatus === 'RESOLVED' ? '#f0fdf4' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <CheckCircle2 size={16} color="#16a34a" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>Resolved / Cleared</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Physical verification completed</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('DISMISSED')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: selectedStatus === 'DISMISSED' ? '2px solid #64748b' : '1px solid var(--border-medium)',
                backgroundColor: selectedStatus === 'DISMISSED' ? '#f1f5f9' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <XCircle size={16} color="#64748b" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Dismiss Flag</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Known standard variance / benign</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('NEW')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: selectedStatus === 'NEW' ? '2px solid #dc2626' : '1px solid var(--border-medium)',
                backgroundColor: selectedStatus === 'NEW' ? '#fef2f2' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <ShieldAlert size={16} color="#dc2626" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#991b1b' }}>Pending Initial Review</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Awaiting initial triage</div>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Reviewer Audit Note & Observations
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter instructions, findings of physical inspection, MB cross-reference numbers, or rationale..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              fontSize: '13px',
              lineHeight: 1.4,
              resize: 'vertical'
            }}
          />
        </div>

        {/* Existing Review History */}
        {work.reviewNotes && work.reviewNotes.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Previous Audit Entries ({work.reviewNotes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
              {work.reviewNotes.map((n, i) => (
                <div key={i} style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-app)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
