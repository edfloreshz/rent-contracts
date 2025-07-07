import { useContracts, useOverallStatistics } from '../hooks/api';
import { ContractStatus } from '../types';
import type { Contract } from '../models/contract';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { t } = useTranslation();
    const { data: contracts = [] } = useContracts();
    const { data: statistics } = useOverallStatistics();

    const stats = [
        {
            name: t('dashboard.stats.totalTenants'),
            value: statistics?.totalTenants || 0,
            icon: '👥',
            color: 'bg-amber-500',
        },
        {
            name: t('dashboard.stats.activeContracts'),
            value: statistics?.activeContracts || 0,
            icon: '📋',
            color: 'bg-green-500',
        },
        {
            name: t('dashboard.stats.totalProperties'),
            value: statistics?.totalProperties || 0,
            icon: '🏠',
            color: 'bg-purple-500',
        },
        {
            name: t('dashboard.stats.totalReferences'),
            value: statistics?.totalReferences || 0,
            icon: '🤝',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
                <p className="text-gray-600 dark:text-gray-300">{t('dashboard.subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comprehensive Statistics */}
            {statistics && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        {t('dashboard.detailedStatistics')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Financial Statistics */}
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ${(statistics.monthlyRevenue || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('dashboard.monthlyRevenue')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                ${(statistics.totalRevenue || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('dashboard.annualRevenue')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                ${(statistics.averageRent || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                {t('dashboard.averageRent')}
                            </div>
                        </div>
                    </div>

                    {/* Performance Statistics */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                            {t('dashboard.performanceStatistics')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {(statistics.occupancyRate || 0).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('dashboard.occupancyRate')}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    {statistics.averageContractDuration || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('dashboard.avgContractDays')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Statistics */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                            {t('dashboard.propertyStatistics')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {statistics.occupiedProperties || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('dashboard.occupiedProperties')}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {statistics.vacantProperties || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('dashboard.vacantProperties')}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {statistics.activeTenants || 0}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('dashboard.activeTenants')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Contracts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.recentContracts')}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('dashboard.tenant')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('dashboard.property')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('dashboard.rent')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t('dashboard.status')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {contracts.slice(0, 5).map((contract: Contract) => (
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {contract.tenant?.firstName} {contract.tenant?.middleName} {contract.tenant?.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {contract.tenant?.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {contract.address.street} {contract.address.number}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {contract.address.city}, {contract.address.state}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${contract.currentVersion?.rent.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${contract.currentVersion?.status === ContractStatus.Active
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                            : contract.currentVersion?.status === ContractStatus.Expired
                                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}>
                                            {t(`contracts.statuses.${contract.currentVersion?.status}`)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
