import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
    const { tnxId } = useParams();
    const navigate = useNavigate();
    console.log(tnxId);

    useEffect(() => {
        const URL = "http://localhost:8080/api/status/" + tnxId;

        const options = {
            method: 'GET',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        axios.request(options).then(function (response) {
            if(response.status === 200 && response.data.success && response.data.code === "PAYMENT_SUCCESS"){
                navigate("/success")
            }else if(response.status === 200 && response.data.success && response.data.code === "PAYMENT_PENDING"){
                
            }
            else{
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