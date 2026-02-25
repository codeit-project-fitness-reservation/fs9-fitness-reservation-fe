/** 사업자 가입 1단계(공통 정보) 저장 키 - 2단계 /signup/seller 에서 사용 */
export const SIGNUP_SELLER_DRAFT_KEY = 'signup_seller_draft';

export type SignupSellerDraft = {
  email: string;
  nickname: string;
  password: string;
  phone: string;
};

export function getSellerDraft(): SignupSellerDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SIGNUP_SELLER_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SignupSellerDraft;
  } catch {
    return null;
  }
}

export function setSellerDraft(data: SignupSellerDraft): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SIGNUP_SELLER_DRAFT_KEY, JSON.stringify(data));
}

export function clearSellerDraft(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SIGNUP_SELLER_DRAFT_KEY);
}
