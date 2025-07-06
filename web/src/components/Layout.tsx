import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const { t } = useTranslation();

    const navigation = [
        { name: t('navigation.dashboard'), href: '/', icon: '📊' },
        { name: t('navigation.tenants'), href: '/tenants', icon: '👥' },
        { name: t('navigation.contracts'), href: '/contracts', icon: '📋' },
        { name: t('navigation.addresses'), href: '/addresses', icon: '🏠' },
        { name: t('navigation.guarantors'), href: '/guarantors', icon: '🤝' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Rent Control</h1>
                        <LanguageSwitcher />
                    </div>
                    <nav className="mt-8">
                        <div className="space-y-1 px-4">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>

                {/* Main content */}
                <div className="ml-64 flex-1">
                    <main className="px-8 py-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
