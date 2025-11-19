import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative transition-all duration-300 ease-out animate-modal-in"
        style={{ animation: 'modal-in 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          &#10005;
        </button>
        {children}
      </div>
      <style>{`
        @keyframes modal-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
