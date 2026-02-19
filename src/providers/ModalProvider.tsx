'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  ComponentType,
} from 'react';
import Modal from '@/components/Modal';

interface ModalInstance {
  id: string;
  render: (onClose: () => void) => ReactNode;
}

interface ModalContextType {
  openModal: <T extends object>(Component: ComponentType<T>, props?: T) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalInstance[]>([]);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setModals((prev) => prev.slice(0, -1));
  }, []);

  // 모달 열기
  const openModal = useCallback(
    <T extends object>(Component: ComponentType<T>, props: T = {} as T) => {
      const id = Date.now().toString();

      setModals((prev) => [
        ...prev,
        {
          id,
          render: (onClose) => <Component {...(props as T)} onClose={onClose} />,
        },
      ]);
    },
    [],
  );

  const value: ModalContextType = {
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal) => (
        <Modal key={modal.id} isOpen={true} onClose={closeModal}>
          {modal.render(closeModal)}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
