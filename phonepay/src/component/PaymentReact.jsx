import React from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

export default function PaymentReact() {

    const merchantId = process.env.REACT_APP_MERCHANT_ID
    const salt_key = process.env.REACT_APP_SALT_KEY

    const handlePayment = async (e) => {
        e.preventDefault();

        const merchantTransactionId = "Tr-" + uuidv4().toString(36).slice(-6);

        const data = {
            merchantId: merchantId,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'MUID-' + uuidv4().toString(36).slice(-6),
            amount: 10000,
            redirectUrl: `http://localhost:3000/payment/status/${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            callbackUrl: `https://dd35-202-131-123-10.ngrok-free.app/api/status/${merchantTransactionId}`,
            mobileNumber: '9999999999',
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const payload = JSON.stringify(data);
        const payloadMain = btoa(payload)
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const hash = CryptoJS.SHA256(string);
        const sha256 = hash.toString(CryptoJS.enc.Hex)
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log(response);
            window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
        }).catch(function (error) {
            console.error(error);
        });
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
            <h1>Payment request handle by react application</h1>
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
