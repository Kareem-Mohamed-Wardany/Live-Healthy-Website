import React from 'react'
import Nav from '../../../components/Nav'
import PatientAppointmentForm from '../../../components/PatientAppointmentForm';

export const Appointment = (props) => {
    const user = props.user
    return (
        <>
            <Nav user={user} />
            <PatientAppointmentForm />
        </>
    )
}
