import { useState } from 'react';
import { useTenants, useDeleteTenant } from '../hooks/api';
import type { Tenant } from '../types';
import TenantForm from './TenantForm';
import { useTranslation } from 'react-i18next';

export default function Tenants() {
    const { t } = useTranslation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const { data: tenants = [], isLoading } = useTenants();
    const deleteTenant = useDeleteTenant();

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('tenants.confirmDelete'))) {
            await deleteTenant.mutateAsync(id);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedTenant(null);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('tenants.title')}</h1>
                    <p className="text-gray-600">{t('tenants.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    {t('tenants.addTenant')}
                </button>
            </div>

            {/* Tenants Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.email')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.phone')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.address')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('navigation.contracts')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tenants.map((tenant: Tenant) => (
                            <tr key={tenant.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {tenant.firstName} {tenant.middleName && `${tenant.middleName} `}{tenant.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{tenant.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{tenant.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {tenant.address.street} {tenant.address.number}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {tenant.address.city}, {tenant.address.state}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {tenant.contracts?.length || 0} {t('navigation.contracts').toLowerCase()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(tenant)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        {t('common.edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tenant.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <TenantForm
                    tenant={selectedTenant}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}
