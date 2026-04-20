"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./quickReply.module.css";
import { getAuthToken } from "../../../utils/utilities";
import dynamic from "next/dynamic";

const API_ADMIN_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_ADMIN_URL;
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ======================================================
   CLEAN HTML EMAIL TEMPLATE (NO EXTRA SPACING)
====================================================== */
const getDefaultMessage = (entry) => {
  const name =
    entry?.full_name ||
    `${entry?.first_name || ""} ${entry?.last_name || ""}`.trim() ||
    "there";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;">
    <p style="margin:0 0 12px;">Hi <strong>${name}</strong>,</p>

    <p style="margin:0 0 12px;">
      Thank you for reaching out to us. We really appreciate your interest in
      <strong>FindOnRent</strong>.
    </p>

    <p style="margin:0 0 12px;">
      If this is your first time visiting <strong>FindOnRent.com</strong>,
      please create your account using the link below:
    </p>

    <p style="margin:0 0 12px;">
      <strong>Signup:</strong>
      <a href="https://findonrent.com/register" target="_blank" style="color:#2563eb;text-decoration:none;">
        https://findonrent.com/register
      </a>
    </p>

    <p style="margin:0 0 12px;">
      Once registered, please verify your account and log in here:
    </p>

    <p style="margin:0 0 12px;">
      <strong>Login:</strong>
      <a href="https://findonrent.com/login" target="_blank" style="color:#2563eb;text-decoration:none;">
        https://findonrent.com/login
      </a>
    </p>

    <p style="margin:0 0 12px;">
      To rent a vehicle, select your city and choose the vehicle you need.
      You can view listings and directly contact vendors for booking.
    </p>

    <p style="margin:0 0 12px;">
      If you need any assistance, feel free to reply to this email.
      We’ll be happy to help you.
    </p>

    <p style="margin:16px 0 4px;">
      Warm regards,<br />
      <strong>FindOnRent Team</strong>
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />

    <p style="font-size:12px;color:#6b7280;margin:0;">
      This is an automated response from FindOnRent.
      Please do not share your login credentials with anyone.
    </p>
  </div>
  `;
};

/* ======================================================
   JODIT CONFIG (FULL FEATURES + CLEAN OUTPUT)
====================================================== */
const editorConfig = {
  readonly: false,
  height: 320,
  toolbarAdaptive: false,
  toolbarSticky: false,

  enter: "P",
  enterBlock: "p",
  useLineBreaks: false,
  useParagraphs: true,

  cleanHTML: {
    removeEmptyElements: true,
    removeEmptyParagraphs: true,
    fillEmptyParagraph: false,
  },

  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",

  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "eraser",
    "|",
    "superscript",
    "subscript",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "align",
    "|",
    "table",
    "link",
    "image",
    "video",
    "|",
    "hr",
    "copyformat",
    "|",
    "undo",
    "redo",
    "|",
    "selectall",
    "print",
    "fullsize",
  ],

  uploader: {
    insertImageAsBase64URI: true,
  },

  iframe: false,
  language: "en",
};

export default function QuickReplyModal({ isOpen, onClose, entry }) {
  const editorRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (entry) {
      setMessage(getDefaultMessage(entry));
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");

    if (!message || message.trim() === "") {
      setError("Message cannot be empty");
      return;
    }

    const token = getAuthToken();

    const payload = {
      to: entry.email,
      subject: e.target.subject.value,
      message,
      contact_id: entry.id,
    };

    try {
      setLoading(true);

      const res = await fetch(
        `${API_ADMIN_BASE_URL}/contact-us/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to send reply");
      }

      alert("Reply sent successfully ✅");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal d-block" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', overflowY: 'auto' }} 
      tabIndex="-1" 
      role="dialog"
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg my-4" role="document" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards' }}>
          
          {/* Header Gradient */}
          <div style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', padding: '24px 24px', position: 'relative' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white fw-bold" style={{ letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>📝 Quick Reply</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose} style={{ opacity: 0.9, padding: '10px' }}></button>
            </div>
          </div>

          <div className="modal-body p-4 p-md-5" style={{ background: '#ffffff' }}>
            <form onSubmit={handleSend}>
              
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">To (Recipient)</label>
                  <input type="email" value={entry.email} readOnly className="form-control form-control-lg shadow-sm border-light rounded-3 bg-light text-muted font-monospace" />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold small mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    defaultValue={`Re: ${entry.subject || "Your inquiry"}`}
                    required
                    disabled={loading}
                    className="form-control form-control-lg shadow-sm border-light rounded-3 bg-white text-dark fw-medium"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small mb-1">Message Body</label>
                <div className="shadow-sm border-light rounded-3 overflow-hidden bg-white">
                  <JoditEditor
                    ref={editorRef}
                    value={message}
                    config={editorConfig}
                    onBlur={(newContent) => setMessage(newContent)}
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3" role="alert">
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <div style={{ fontSize: '0.9rem' }}>{error}</div>
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-5 pt-3 border-top">
                <button type="button" className="btn btn-light px-4 py-2 fw-semibold border rounded-3" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-3" disabled={loading}>
                  {loading ? "Sending..." : "Send Reply 📤"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        /* Custom scrollbar for better appearance */
        .modal::-webkit-scrollbar { width: 8px; }
        .modal::-webkit-scrollbar-track { background: transparent; }
        .modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
