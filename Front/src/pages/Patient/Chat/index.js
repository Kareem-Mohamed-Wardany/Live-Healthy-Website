import React from 'react'
import Nav from '../../../components/Nav'
import { useAppContext } from '../../../provider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Chat = (props) => {
    const user = props.user
    const navigate = useNavigate();
    const { createNotification } = useAppContext();
    return (
        <>
            <Nav user={user} />
            <div>index</div>
        </>
    )
}
