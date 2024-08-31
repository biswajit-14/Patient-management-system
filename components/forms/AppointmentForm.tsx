"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { getAppointmentSchema } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";

export const AppointmentForm = ({
    type, userId, patientId,
}: {
    type: 'create' | 'cancel' | 'schedule',
    userId: string,
    patientId: string,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    let buttonLabel;

    switch (type) {
        case 'create':
            buttonLabel = 'Create Appointment';
            break;
        case 'cancel':
            buttonLabel = 'Cancel Appointment';
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment';
            break;

        default:
            break;
    }

    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);

        let status;

        switch (type) {
            case 'cancel':
                status = 'Cancelled';
                break;
            case 'schedule':
                status = 'Scheduled';
                break;
            default:
                status = 'pending';
                break;
        }

        try {

            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }
                const appointment = await createAppointment(appointmentData);

                if (appointment) {
                    form.reset();

                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                }
            }


        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section className="mb-12 space-y-4">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request a new appointment in just 10 seconds</p>
                </section>

                {
                    type === 'create' && (
                        <>
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="primaryPhysician"
                                label="Doctor"
                                placeholder="Select a doctor..."
                            >
                                {
                                    Doctors.map((doctor, i) => (
                                        <SelectItem key={doctor.name + i} value={doctor.name}>
                                            <div className="flex cursor-pointer items-center gap-2">
                                                <Image
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    height={32}
                                                    width={32}
                                                    className="rounded-full border border-dark-500"
                                                />
                                                <p>{doctor.name}</p>
                                            </div>
                                        </SelectItem>
                                    ))
                                }
                            </CustomFormField>

                            <CustomFormField
                                fieldType={FormFieldType.DATE_PICKER}
                                control={form.control}
                                name="schedule"
                                label="Expected appointment date"
                                showTimeSelect
                                dateFormat="MM/dd/yyyy  -  h:mm aa"
                            />

                            <div
                                className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
                            >
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="reason"
                                    label="Appointment reason"
                                    placeholder="Annual montly check-up"
                                // disabled={type === "schedule"}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="note"
                                    label="Comments/notes"
                                    placeholder="Prefer afternoon appointments, if possible"
                                // disabled={type === "schedule"}
                                />
                            </div>
                        </>
                    )
                }

                {
                    type === 'cancel' && (
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="cancelationReason"
                            label="Reason for cancellation"
                            placeholder="Enter a reason for cancellation"
                        />
                    )
                }

                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
};