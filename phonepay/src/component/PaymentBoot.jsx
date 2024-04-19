import React from 'react';
import axios from 'axios';

const PaymentBoot = () => {

    const handlePayment = () => {
        const payload = {
            "amount": 10000,
        }

        const options = {
            method: 'POST',
            url: "http://192.168.2.91:8080/order",
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: payload
        };

        axios.request(options).then(function (response) {
            if (response.status === 200) {
                window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
            }
        }).catch(function (error) {
            console.error(error);
        });
    }
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1>Payment request handle by spring boot application</h1>
            <div className='col-12 '>
                <p className='fs-5'><strong>Name:</strong> Dharmik</p>
            </div>
            <div className='col-12 '>
                <p className='fs-5'><strong>Number:</strong> 9999999999</p>
            </div>
            <div className='col-12 '>
                <p className='fs-5'><strong>Amount:</strong> 100 Rs</p>
            </div>
            <div className='col-12 center'>
                <button className='w-100' type="submit" onClick={handlePayment}>Pay Now</button>
            </div>
        </div>
    );
}

export default PaymentBoot;
