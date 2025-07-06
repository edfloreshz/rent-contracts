import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReferenceAddresses, useCreateGuarantor, useUpdateGuarantor } from '../hooks/api';
import type { Guarantor, CreateGuarantor, UpdateGuarantor } from '../types';
import { useTranslation } from 'react-i18next';

interface GuarantorFormProps {
    guarantor?: Guarantor | null;
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

export default function GuarantorForm({ guarantor, onClose }: GuarantorFormProps) {
    const { t } = useTranslation();
    const { data: addresses = [] } = useReferenceAddresses();
    const createGuarantor = useCreateGuarantor();
    const updateGuarantor = useUpdateGuarantor();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            firstName: guarantor?.firstName || '',
            middleName: guarantor?.middleName || '',
            lastName: guarantor?.lastName || '',
            email: guarantor?.email || '',
            phone: guarantor?.phone || '',
            addressId: guarantor?.addressId || '',
        },
    });

    useEffect(() => {
        if (guarantor) {
            reset({
                firstName: guarantor.firstName,
                middleName: guarantor.middleName,
                lastName: guarantor.lastName,
                email: guarantor.email,
                phone: guarantor.phone,
                addressId: guarantor.addressId,
            });
        }
    }, [guarantor, reset]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            if (guarantor) {
                const updateData: UpdateGuarantor = {
                    id: guarantor.id,
                    ...data,
                };
                await updateGuarantor.mutateAsync(updateData);
            } else {
                const createData: CreateGuarantor = { ...data, type: "reference" };
                await createGuarantor.mutateAsync(createData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving guarantor:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {guarantor ? t('guarantors.editGuarantor') : t('guarantors.addNewGuarantor')}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('common.name')}
                        </label>
                        <input
                            type="text"
                            {...register('firstName', { required: t('guarantors.nameRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.firstName && (
                            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('common.email')}
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: t('guarantors.emailRequired'),
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: t('common.invalidEmail')
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('common.phone')}
                        </label>
                        <input
                            type="tel"
                            {...register('phone', { required: t('guarantors.phoneRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && (
                            <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('common.address')}
                        </label>
                        <select
                            {...register('addressId', { required: t('guarantors.addressRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{t('guarantors.selectAddress')}</option>
                            {addresses.map((address) => (
                                <option key={address.id} value={address.id}>
                                    {address.street} {address.number}, {address.city}
                                </option>
                            ))}
                        </select>
                        {errors.addressId && (
                            <p className="text-red-600 text-sm mt-1">{errors.addressId.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? t('common.loading') : (guarantor ? t('common.update') : t('common.create'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
