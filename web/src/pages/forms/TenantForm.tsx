import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTenantAddresses, useCreateTenant, useUpdateTenant } from '../../hooks/api';
import type { User } from '../../models/user';
import { useTranslation } from 'react-i18next';
import type { CreateUser, UpdateUser } from '../../dtos/user';

interface TenantFormProps {
    tenant?: User | null;
    onClose: () => void;
}

interface FormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    addressId: string;
}

export default function TenantForm({ tenant, onClose }: TenantFormProps) {
    const { t } = useTranslation();
    const { data: addresses = [] } = useTenantAddresses();
    const createTenant = useCreateTenant();
    const updateTenant = useUpdateTenant();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            firstName: tenant?.firstName || '',
            middleName: tenant?.middleName || '',
            lastName: tenant?.lastName || '',
            email: tenant?.email || '',
            phone: tenant?.phone || '',
            addressId: tenant?.addressId || '',
        },
    });

    useEffect(() => {
        if (tenant) {
            reset({
                firstName: tenant.firstName,
                middleName: tenant.middleName,
                lastName: tenant.lastName,
                email: tenant.email,
                phone: tenant.phone,
                addressId: tenant.addressId,
            });
        }
    }, [tenant, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if (tenant) {
                const updateData: UpdateUser = {
                    id: tenant.id,
                    ...data,
                };
                await updateTenant.mutateAsync(updateData);
            } else {
                const createData: CreateUser = {
                    ...data,
                    type: "tenant",
                };
                await createTenant.mutateAsync(createData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving tenant:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {tenant ? t('tenants.editTenant') : t('tenants.addNewTenant')}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.firstName')}
                        </label>
                        <input
                            type="text"
                            {...register('firstName', { required: t('tenants.firstNameRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                        {errors.firstName && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.middleName')}
                        </label>
                        <input
                            type="text"
                            {...register('middleName')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.lastName')}
                        </label>
                        <input
                            type="text"
                            {...register('lastName', { required: t('tenants.lastNameRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                        {errors.lastName && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.email')}
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: t('tenants.emailRequired'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('common.invalidEmail')
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                        {errors.email && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.phone')}
                        </label>
                        <input
                            type="tel"
                            {...register('phone', { required: t('tenants.phoneRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                        {errors.phone && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.address')}
                        </label>
                        <select
                            {...register('addressId', { required: t('tenants.addressRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        >
                            <option value="">{t('tenants.selectAddress')}</option>
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

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {isSubmitting ? t('common.loading') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
