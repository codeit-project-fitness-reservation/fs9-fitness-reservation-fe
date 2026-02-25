'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Image from 'next/image';
import { userApi } from '@/lib/api/user';
import xCloseIcon from '@/assets/images/x-close.svg';

interface UserMemoModalProps {
  userId: string | null;
  userNickname?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UserMemoModal({
  userId,
  userNickname = '유저',
  isOpen,
  onClose,
  onSuccess,
}: UserMemoModalProps) {
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) {
      setMemo('');
      return;
    }
    setLoading(true);
    userApi
      .getUserById(userId)
      .then((user) => setMemo(user.note ?? ''))
      .catch(() => alert('메모를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  const handleSubmit = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await userApi.patchNote(userId, memo.trim() || null);
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert('메모 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl"
        style={{ width: '496px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <h2 className="text-lg font-semibold text-gray-900">유저 메모 · {userNickname}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="닫기"
          >
            <Image src={xCloseIcon} alt="닫기" width={20} height={20} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <label htmlFor="user-memo" className="mb-2 block text-sm font-medium text-gray-900">
            메모
          </label>
          <textarea
            id="user-memo"
            value={loading ? '불러오는 중...' : memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="이 유저에 대한 메모를 입력하세요. 빈칸일시 메모 삭제"
            rows={6}
            disabled={loading}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none disabled:bg-gray-50"
          />
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || saving}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
