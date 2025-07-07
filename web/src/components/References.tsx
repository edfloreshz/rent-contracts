import { useState } from 'react';
import { useReferences, useDeleteReference } from '../hooks/api';
import ReferenceForm from './ReferenceForm';
import { useTranslation } from 'react-i18next';
import { formatPhone } from '../utils';
import type { User } from '../types';

export default function References() {
    const { t } = useTranslation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReference, setSelectedReference] = useState<User | null>(null);
    const { data: references = [], isLoading } = useReferences();
    const deleteReference = useDeleteReference();

    const handleEdit = (reference: User) => {
        setSelectedReference(reference);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('references.confirmDelete'))) {
            await deleteReference.mutateAsync(id);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedReference(null);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('references.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{t('references.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    {t('references.addReference')}
                </button>
            </div>

            {/* References Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.email')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.phone')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.address')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {references.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                                    {t('references.noReferences')}
                                </td>
                            </tr>
                        ) : (
                            references.map((reference: User) => (
                                <tr key={reference.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {reference.firstName} {reference.middleName} {reference.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{reference.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{formatPhone(reference.phone)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {reference.address?.street} {reference.address?.number}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {reference.address?.city}, {reference.address?.state}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(reference)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(reference.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <ReferenceForm
                    reference={selectedReference}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}
