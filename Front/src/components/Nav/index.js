import React from 'react'
import { useNavigate } from 'react-router-dom'
import Male from '../../assets/images/Male.png'
import Female from '../../assets/images/Female.png'
import preidct from '../../assets/images/predict.png'
import chat from '../../assets/images/chat.png'
import Purchase from '../../assets/images/vip.png'
import coin from '../../assets/images/coin.png'
import prescription from '../../assets/images/clipboard.png'
import Logout from '../../assets/images/logout.png'
import { useLocation } from 'react-router-dom'

const Nav = (props) => {
    const location = useLocation();
    const currentUrl = location.pathname;
    const navigate = useNavigate();
    const normal = "w-full py-4 pl-1 flex items-center hover:cursor-pointer hover:bg-backColor text-sm sm:text-xl"
    const active = "w-full py-4 pl-1 flex items-center hover:cursor-pointer bg-backColor text-sm sm:text-xl"
    const user = props.user
    console.log(currentUrl)
    const handleActions = (action) => {
        const routes = {
            'predict': '/predict',
            'chat': '/chat',
            'purchase': '/purchasevip',
            'prescription': '/myprescriptions',
            'coin': '/mycoins',
            'logout': () => {
                localStorage.removeItem('token');
                localStorage.removeItem('expiryDate');
                localStorage.removeItem('userId');
                navigate('/');
                navigate(0) // Reload the page after logout
            },
        };

        const route = routes[action];
        if (route) {
            if (typeof route === 'function') {
                route(); // Execute logout function
            } else {
                navigate(route); // Navigate to respective route
            }
        }
    };


    return (
        <>
            {user.accountType === "patient" &&
                <>
                    <div className='sm:w-56 w-32 h-screen bg-NavColor flex justify-start items-center flex-col'>
                        {
                            user.gender === "male" ? (
                                <img className='rounded w-20 h-20 object-cover text-center sm:w-24 sm:h-24' src={Male} alt="male" />
                            ) : (
                                <img className='rounded w-20 h-20 object-cover text-center sm:w-24 sm:h-24' src={Female} alt="female" />
                            )
                        }
                        <h1 className='text-sm sm:text-xl my-3'>{user.name}</h1>
                        <div className={currentUrl === "/predict" ? active : normal} onClick={() => { handleActions('predict') }}>
                            <img src={preidct} alt="predict" className='w-10 h-10 mr-1' />
                            Predic X-ray Scan</div>
                        <div className={currentUrl === "/chat" ? active : normal} onClick={() => { handleActions('chat') }}>
                            <img src={chat} alt="chat" className='w-10 h-10 mr-1' />
                            Chat</div>
                        <div className={currentUrl === "/purchasevip" ? active : normal} onClick={() => { handleActions('purchase') }}>
                            <img src={Purchase} alt="Purchase VIP" className='w-10 h-10 mr-1' />
                            Purchase VIP</div>
                        <div className={currentUrl === "/myprescriptions" ? active : normal} onClick={() => { handleActions('prescription') }}>
                            <img src={prescription} alt="Prescriptions" className='w-10 h-10 mr-1' />
                            All My Prescriptions</div>
                        <div className=' flex-grow'></div>
                        <div className={currentUrl === "/mycoins" ? active : normal} onClick={() => { handleActions('coin') }}>
                            <img src={coin} alt="Balance" className='w-10 h-10 mr-1' />
                            {user.balance}</div>
                        <div className={normal} onClick={() => { handleActions('logout') }}>
                            <img src={Logout} alt="Logout" className='w-10 h-10 mr-1' />
                            Logout</div>
                    </div>
                </>
            }
        </>

    )
}

export default Nav

// {
//     "user": {
//         "vip": {
//             "level": "Basic",
//             "expireDate": null
//         },
//         "healthStatus": {
//             "bloodType": "A+",
//             "smoker": false
//         },
//         "_id": "676fcb1afa82e6d163972480",
//         "name": "Kareem Wardany",
//         "accountType": "patient",
//         "phone": "01144106127",
//         "mail": "kareemwarday111@gmail.com",
//         "dateOfBirth": "2001-04-05T22:00:00.000Z",
//         "gender": "male",
//         "password": "$2a$12$w8bYeUlAEv0JhYBObyqw5eZpypfKGKWQ0uP1bBDP32TiTOhPC3gR2",
//         "__v": 0,
//         "id": "676fcb1afa82e6d163972480"
//     }
// }