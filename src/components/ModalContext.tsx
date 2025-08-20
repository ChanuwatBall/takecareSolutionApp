import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalId = string;

type ModalOptions = {
  dismissOnBackdrop?: boolean; // default: true
  dismissOnEsc?: boolean;      // default: true
  onClose?: () => void;
  zIndex?: number;             // default: 10000
};

type ModalEntry = {
  id: ModalId;
  node: React.ReactNode;
  options: Required<Pick<ModalOptions, "dismissOnBackdrop" | "dismissOnEsc">> & ModalOptions;
};

type OpenReturn = { id: ModalId; close: () => void };

type ModalContextType = {
  open: (node: React.ReactNode, options?: ModalOptions) => OpenReturn;
  openComponent: <P extends {}>(
    Comp: React.ComponentType<P>,
    props?: P,
    options?: ModalOptions
  ) => OpenReturn;
  close: (id: ModalId) => void;
  closeAll: () => void;
  modals: ModalEntry[];
};

const ModalContext = createContext<ModalContextType | null>(null);

function genId() {
  return Math.random().toString(36).slice(2);
}

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  // Body scroll lock while any modal is open
  useEffect(() => {
    if (modals.length > 0) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [modals.length]);

  const close = (id: ModalId) => {
    setModals(prev => {
      const m = prev.find(x => x.id === id);
      if (m?.options.onClose) m.options.onClose();
      return prev.filter(x => x.id !== id);
    });
  };

  const open = (node: React.ReactNode, options?: ModalOptions): OpenReturn => {
    const id = genId();
    const entry: ModalEntry = {
      id,
      node,
      options: {
        dismissOnBackdrop: options?.dismissOnBackdrop ?? true,
        dismissOnEsc: options?.dismissOnEsc ?? true,
        ...options,
      },
    };
    setModals(prev => [...prev, entry]);
    return { id, close: () => close(id) };
    // caller can store id or use returned close()
  };

  const openComponent = <P extends {}>(
    Comp: React.ComponentType<P>,
    props?: P,
    options?: ModalOptions
  ): OpenReturn => {
    return open(<Comp {...(props as P)} />, options);
  };

  const closeAll = () => setModals(prev => {
    prev.forEach(m => m.options.onClose?.());
    return [];
  });

  // ESC to close topmost (if allowed)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modals.length) {
        const top = modals[modals.length - 1];
        if (top.options.dismissOnEsc) close(top.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modals]);

  const value = useMemo<ModalContextType>(() => ({
    open, openComponent, close, closeAll, modals
  }), [modals]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRoot modals={modals} onClose={close} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
};

// Renders all modals in a portal, each with full-screen backdrop and huge z-index
const ModalRoot: React.FC<{
  modals: ModalEntry[];
  onClose: (id: ModalId) => void;
}> = ({ modals, onClose }) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {modals.map((m, idx) => {
        const z = (m.options.zIndex ?? 10000) + idx * 2; // keep stacking order
        return (
          <div key={m.id} style={{ position: "fixed", inset: 0, zIndex: z }}>
            {/* Backdrop */}
            <div
              onClick={() => m.options.dismissOnBackdrop && onClose(m.id)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
            />
            {/* Modal content wrapper */}
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none", // so clicks don't pass through backdrop unless on content
              }}
            >
              <div
                style={{
                  pointerEvents: "auto",
                  maxHeight: "90vh",
                  overflow: "auto",
                }}
              >
                {m.node}
              </div>
            </div>
          </div>
        );
      })}
    </>,
    document.body
  );
};
