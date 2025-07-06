import React, { useState } from 'react';
import { useContracts, useDeleteContract, useGenerateContractPdf, useContractVersions } from '../hooks/api';
import type { Contract, ContractVersion } from '../types';
import { ContractStatus } from '../types';
import { downloadFile } from '../utils';
import ContractForm from './ContractForm';
import { useTranslation } from 'react-i18next';

// Component to handle contract versions for expanded rows
function ContractVersionsTable({ contractId, currentVersionId }: { contractId: string, currentVersionId?: string }) {
    const { t } = useTranslation();
    const { data: versions = [], isLoading, error } = useContractVersions(contractId);
    const generatePdf = useGenerateContractPdf();

    const handleGenerateVersionPdf = async (versionId: string, versionNumber: number) => {
        try {
            const blob = await generatePdf.mutateAsync({ contractId, versionId });
            downloadFile(blob, `contract-${contractId}-v${versionNumber}.pdf`);
        } catch (error) {
            console.error('Error generating PDF for version:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <div className="text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <div className="text-red-500 dark:text-red-400">Error loading versions</div>
            </div>
        );
    }

    if (!versions || versions.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                {t('contracts.versions.noVersions')}
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('contracts.versions.version')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('contracts.rent')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('contracts.versions.rentIncrease')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('contracts.status')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('common.period')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('contracts.versions.createdAt')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {t('common.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {versions.map((version: ContractVersion) => (
                        <tr key={version.id} className={version.id === currentVersionId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        v{version.versionNumber}
                                    </span>
                                    {version.id === currentVersionId && (
                                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            {t('contracts.versions.current')}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    ${version.rent.toLocaleString()}
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {version.rentIncreasePercentage}%
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${version.status === ContractStatus.Active
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : version.status === ContractStatus.Expired
                                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                    }`}>
                                    {t(`contracts.statuses.${version.status}`)}
                                </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {new Date(version.startDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    to {new Date(version.endDate).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    {new Date(version.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <button
                                    onClick={() => handleGenerateVersionPdf(version.id, version.versionNumber)}
                                    className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm font-medium"
                                    disabled={generatePdf.isPending}
                                >
                                    {generatePdf.isPending ? t('common.loading') : 'PDF'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Contracts() {
    const { t } = useTranslation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const { data: contracts = [], isLoading } = useContracts();
    const deleteContract = useDeleteContract();
    const generatePdf = useGenerateContractPdf();

    const handleEdit = (contract: Contract) => {
        setSelectedContract(contract);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('contracts.confirmDelete'))) {
            await deleteContract.mutateAsync(id);
        }
    };

    const handleGeneratePdf = async (id: string, tenantName: string) => {
        try {
            const blob = await generatePdf.mutateAsync({ contractId: id });
            downloadFile(blob, `contract-${tenantName}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedContract(null);
    };

    const toggleRowExpansion = (contractId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(contractId)) {
                newSet.delete(contractId);
            } else {
                newSet.add(contractId);
            }
            return newSet;
        });
    };

    const isRowExpanded = (contractId: string) => expandedRows.has(contractId);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('contracts.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300">{t('contracts.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    {t('contracts.addContract')}
                </button>
            </div>

            {/* Contracts Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {/* Expand/Collapse button column */}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.tenant')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.property')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.rent')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.deposit')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.period')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.versions.version')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('contracts.status')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {contracts.map((contract: Contract) => (
                            <React.Fragment key={contract.id}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleRowExpansion(contract.id)}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            {isRowExpanded(contract.id) ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {contract.tenant?.firstName} {contract.tenant?.middleName && `${contract.tenant?.middleName} `}{contract.tenant?.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {contract.tenant?.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {contract.address?.street} {contract.address?.number}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {contract.address?.city}, {contract.address?.state}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ${contract.currentVersion?.rent?.toLocaleString() || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ${contract.deposit.toLocaleString() || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {contract.currentVersion?.startDate ? new Date(contract.currentVersion.startDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            to {contract.currentVersion?.endDate ? new Date(contract.currentVersion.endDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            v{contract.currentVersion?.versionNumber || 'N/A'}
                                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                {t('contracts.versions.current')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${contract.currentVersion?.status === ContractStatus.Active
                                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                            : contract.currentVersion?.status === ContractStatus.Expired
                                                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}>
                                            {contract.currentVersion?.status ? t(`contracts.statuses.${contract.currentVersion.status}`) : 'N/A'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(contract)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleGeneratePdf(contract.id, `${contract.tenant?.firstName} ${contract.tenant?.lastName}`)}
                                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                                        >
                                            PDF
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contract.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                                {isRowExpanded(contract.id) && (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                                            <div className="space-y-4">
                                                <ContractVersionsTable
                                                    contractId={contract.id}
                                                    currentVersionId={contract.currentVersionId}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isFormOpen && (
                <ContractForm
                    contract={selectedContract}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
}
