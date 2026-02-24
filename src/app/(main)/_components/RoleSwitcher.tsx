'use client';

type Role = 'customer' | 'seller';

interface RoleSwitcherProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function RoleSwitcher({ activeRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex justify-center">
      <div className="flex gap-[6px] rounded-[6px] bg-gray-100 p-[6px]">
        <button
          onClick={() => onRoleChange('customer')}
          className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
            activeRole === 'customer'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          고객
        </button>
        <button
          onClick={() => onRoleChange('seller')}
          className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
            activeRole === 'seller'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          판매자
        </button>
      </div>
    </div>
  );
}
