import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTenants, usePropertyAddresses, useReferences, useUsers, useCreateContract, useUpdateContract, useCreateContractVersion } from '../hooks/api';
import type { Contract, CreateContract, UpdateContract, CreateContractVersion } from '../types';
import { ContractStatus, ContractType } from '../types';
import { useTranslation } from 'react-i18next';

interface ContractFormProps {
    contract?: Contract | null;
    onClose: () => void;
}

interface FormData {
    landlordId: string;
    tenantId: string;
    addressId: string;
    referenceIds: string[];
    // For contract version
    deposit: number;
    rent: number;
    rentIncreasePercentage: number;
    business: string;
    startDate: string;
    endDate: string;
    status: ContractStatus;
    type: ContractType;
    renewalDate?: string;
    specialTerms?: string;
}

export default function ContractForm({ contract, onClose }: ContractFormProps) {
    const { t } = useTranslation();
    const { data: tenants = [] } = useTenants();
    const { data: addresses = [] } = usePropertyAddresses();
    const { data: references = [] } = useReferences();
    const { data: landlords = [] } = useUsers("admin");
    const createContract = useCreateContract();
    const updateContract = useUpdateContract();
    const createContractVersion = useCreateContractVersion();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            landlordId: contract?.landlordId || '',
            tenantId: contract?.tenantId || '',
            addressId: contract?.addressId || '',
            referenceIds: contract?.references?.map(r => r.id) || [],
            deposit: contract?.currentVersion?.deposit || 0,
            rent: contract?.currentVersion?.rent || 0,
            rentIncreasePercentage: contract?.currentVersion?.rentIncreasePercentage || 0,
            business: contract?.currentVersion?.business || '',
            startDate: contract?.currentVersion?.startDate ? contract.currentVersion.startDate.split('T')[0] : '',
            endDate: contract?.currentVersion?.endDate ? contract.currentVersion.endDate.split('T')[0] : '',
            status: contract?.currentVersion?.status || ContractStatus.Active,
            type: contract?.currentVersion?.type || ContractType.Yearly,
            renewalDate: contract?.currentVersion?.renewalDate ? contract.currentVersion.renewalDate.split('T')[0] : '',
            specialTerms: contract?.currentVersion?.specialTerms || '',
        },
    });

    useEffect(() => {
        if (contract) {
            reset({
                landlordId: contract.landlordId,
                tenantId: contract.tenantId,
                addressId: contract.addressId,
                referenceIds: contract.references?.map(r => r.id) || [],
                deposit: contract.currentVersion?.deposit || 0,
                rent: contract.currentVersion?.rent || 0,
                rentIncreasePercentage: contract.currentVersion?.rentIncreasePercentage || 0,
                business: contract.currentVersion?.business || '',
                startDate: contract.currentVersion?.startDate ? contract.currentVersion.startDate.split('T')[0] : '',
                endDate: contract.currentVersion?.endDate ? contract.currentVersion.endDate.split('T')[0] : '',
                status: contract.currentVersion?.status || ContractStatus.Active,
                type: contract.currentVersion?.type || ContractType.Yearly,
                renewalDate: contract.currentVersion?.renewalDate ? contract.currentVersion.renewalDate.split('T')[0] : '',
                specialTerms: contract.currentVersion?.specialTerms || '',
            });
        }
    }, [contract, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if (contract) {
                // Update existing contract
                const updateData: UpdateContract = {
                    id: contract.id,
                    landlordId: data.landlordId,
                    tenantId: data.tenantId,
                    addressId: data.addressId,
                    referenceIds: data.referenceIds,
                };
                await updateContract.mutateAsync(updateData);
            } else {
                // Create new contract
                const createData: CreateContract = {
                    landlordId: data.landlordId,
                    tenantId: data.tenantId,
                    addressId: data.addressId,
                    referenceIds: data.referenceIds,
                };
                const newContract = await createContract.mutateAsync(createData);

                // Create the initial contract version
                const versionData: CreateContractVersion = {
                    contractId: newContract.id,
                    deposit: data.deposit,
                    rent: data.rent,
                    rentIncreasePercentage: data.rentIncreasePercentage,
                    business: data.business,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status,
                    type: data.type,
                    renewalDate: data.renewalDate,
                    specialTerms: data.specialTerms,
                };
                await createContractVersion.mutateAsync(versionData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving contract:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {contract ? t('contracts.editContract') : t('contracts.addNewContract')}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.landlord')}
                            </label>
                            <select
                                {...register('landlordId', { required: t('contracts.landlordRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">{t('contracts.selectLandlord')}</option>
                                {landlords.map((landlord) => (
                                    <option key={landlord.id} value={landlord.id}>
                                        {landlord.firstName} {landlord.middleName && `${landlord.middleName} `}{landlord.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.landlordId && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.landlordId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.tenant')}
                            </label>
                            <select
                                {...register('tenantId', { required: t('contracts.tenantRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">{t('contracts.selectTenant')}</option>
                                {tenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.firstName} {tenant.middleName && `${tenant.middleName} `}{tenant.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.tenantId && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.tenantId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.property')}
                            </label>
                            <select
                                {...register('addressId', { required: t('contracts.propertyRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">{t('contracts.selectProperty')}</option>
                                {addresses.map((address) => (
                                    <option key={address.id} value={address.id}>
                                        {address.street} {address.number}, {address.city}
                                    </option>
                                ))}
                            </select>
                            {errors.addressId && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.addressId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.rent')}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('rent', { required: t('contracts.rentRequired'), min: 0 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.rent && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.rent.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rent Increase Percentage
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('rentIncreasePercentage', { required: 'Rent increase percentage is required', min: 0, max: 100 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.rentIncreasePercentage && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.rentIncreasePercentage.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.deposit')}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('deposit', { required: t('contracts.depositRequired'), min: 0 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.deposit && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.deposit.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.business')}
                            </label>
                            <input
                                type="text"
                                {...register('business', { required: t('contracts.businessRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., Residential, Commercial"
                            />
                            {errors.business && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.business.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.type')}
                            </label>
                            <select
                                {...register('type', { required: t('contracts.typeRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value={ContractType.Yearly}>{t('contracts.types.Yearly')}</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.startDate')}
                            </label>
                            <input
                                type="date"
                                {...register('startDate', { required: t('contracts.startDateRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.startDate && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.startDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.endDate')}
                            </label>
                            <input
                                type="date"
                                {...register('endDate', { required: t('contracts.endDateRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.endDate && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.endDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Renewal Date
                            </label>
                            <input
                                type="date"
                                {...register('renewalDate')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('contracts.status')}
                            </label>
                            <select
                                {...register('status', { required: t('contracts.statusRequired') })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value={ContractStatus.Active}>{t('contracts.statuses.active')}</option>
                                <option value={ContractStatus.Expired}>{t('contracts.statuses.expired')}</option>
                                <option value={ContractStatus.Terminated}>{t('contracts.statuses.terminated')}</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Special Terms
                        </label>
                        <textarea
                            {...register('specialTerms')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter any special terms or conditions..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('contracts.references')}
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {references.map((reference) => (
                                <label key={reference.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        value={reference.id}
                                        {...register('referenceIds')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{reference.firstName} {reference.middleName && `${reference.middleName} `}{reference.lastName} - {reference.email}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? t('common.loading') : (contract ? t('common.update') : t('common.create'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
