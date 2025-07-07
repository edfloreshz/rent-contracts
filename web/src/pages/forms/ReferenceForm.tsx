import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReferenceAddresses, useCreateReference, useUpdateReference } from '../../hooks/api';
import type { User } from '../../models/user';
import { useTranslation } from 'react-i18next';
import type { CreateUser, UpdateUser } from '../../dtos/user';

interface ReferenceFormProps {
    reference?: User | null;
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

export default function ReferenceForm({ reference, onClose }: ReferenceFormProps) {
    const { t } = useTranslation();
    const { data: addresses = [] } = useReferenceAddresses();
    const createReference = useCreateReference();
    const updateReference = useUpdateReference();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            firstName: reference?.firstName || '',
            middleName: reference?.middleName || '',
            lastName: reference?.lastName || '',
            email: reference?.email || '',
            phone: reference?.phone || '',
            addressId: reference?.addressId || '',
        },
    });

    useEffect(() => {
        if (reference) {
            reset({
                firstName: reference.firstName,
                middleName: reference.middleName,
                lastName: reference.lastName,
                email: reference.email,
                phone: reference.phone,
                addressId: reference.addressId,
            });
        }
    }, [reference, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if (reference) {
                const updateData: UpdateUser = {
                    id: reference.id,
                    ...data,
                };
                await updateReference.mutateAsync(updateData);
            } else {
                const createData: CreateUser = { ...data, type: "reference" };
                await createReference.mutateAsync(createData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving reference:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {reference ? t('references.editReference') : t('references.addNewReference')}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.name')}
                        </label>
                        <input
                            type="text"
                            {...register('firstName', { required: t('references.nameRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        />
                        {errors.firstName && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('common.email')}
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: t('references.emailRequired'),
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
                            {...register('phone', { required: t('references.phoneRequired') })}
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
                            {...register('addressId', { required: t('references.addressRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                        >
                            <option value="">{t('references.selectAddress')}</option>
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? t('common.loading') : (reference ? t('common.update') : t('common.create'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
