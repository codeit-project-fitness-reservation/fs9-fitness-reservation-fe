## ModalProvider 사용법

`useModal` 훅을 사용하여 모달을 열고 닫을 수 있습니다.

```tsx
import { useModal } from '@/providers/ModalProvider';
import ConfirmationModal from '@/components/ConfirmationModal';

function MyComponent() {
  const { openModal, closeModal } = useModal();

  const handleClick = () => {
    openModal(ConfirmationModal, {
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제하기',
      onConfirm: () => {
        // 확인 시 실행할 로직
        closeModal(); // 모달 닫기
      },
      onClose: closeModal, // 모달 닫기
    });
  };

  return <button onClick={handleClick}>모달 열기</button>;
}
```
