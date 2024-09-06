"use server";

import { Appointment } from "@/types/appwrite.types";
import {
    DATABASE_ID,
    databases,
    APPOINTMENT_COLLECTION_ID
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { ID, Query } from "node-appwrite";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );

        return parseStringify(newAppointment);
    } catch (error) {

    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointment);
    } catch (error) {
        console.log(error)
    }
}

export const getRecentAppointmentsList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("createdAt")]
        )

        const initialCounts = {
            scheduleCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduleCount++;
            }
            if (appointment.status === 'pending') {
                acc.pendingCount++;
            }
            if (appointment.status === 'cancelled') {
                acc.cancelledCount++;
            }

            return acc;
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);
    } catch (error) {
        console.log(error)
    }
}