import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
    const { tnxId } = useParams();
    const navigate = useNavigate();
    console.log(tnxId);

    useEffect(() => {
        const URL = "https://a9aa-202-131-123-10.ngrok-free.app/api/status/" + tnxId;

        const options = {
            method: 'POST',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        axios.request(options).then(function (response) {
            if(response.status === 200 && response.data.success && response.data.code === "PAYMENT_SUCCESS"){
                navigate("/success")
            }else{
                navigate("/failed")
            }
        }).catch(function (error) {
            console.error(error);
        });
    })

    return (
        <h1 style={{textAlign:'center'}}>Payment status page!</h1> 
    );
}

export default PaymentStatus;