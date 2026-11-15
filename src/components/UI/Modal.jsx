import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open modals, innermost last. Only the top one handles keys, so Esc in a
// confirm dialog stacked on another modal closes just the confirm dialog.
const stack = [];

// Accessible modal: Esc closes, backdrop click closes, focus is trapped inside
// and returned to the previously focused element on close.
// Put `data-autofocus` on the element that should receive initial focus.
export default function Modal({ onClose, labelledBy, className = "max-w-lg", children }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    const focusables = () => [...panel.querySelectorAll(FOCUSABLE)];
    stack.push(panel);

    (panel.querySelector("[data-autofocus]") ?? focusables()[0] ?? panel).focus();

    // Listen on the document, not the panel: focus can fall to <body> when the
    // focused element is removed (e.g. a button that disappears after a click).
    function handleKeyDown(e) {
      if (stack[stack.length - 1] !== panel) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (!panel.contains(document.activeElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      stack.splice(stack.indexOf(panel), 1);
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl outline-none ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
