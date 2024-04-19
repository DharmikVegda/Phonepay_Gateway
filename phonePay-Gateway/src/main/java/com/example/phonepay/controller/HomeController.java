package com.example.phonepay.controller;

import com.phonepe.sdk.pg.Env;
import com.phonepe.sdk.pg.common.http.PhonePeResponse;
import com.phonepe.sdk.pg.payments.v1.PhonePePaymentClient;
import com.phonepe.sdk.pg.payments.v1.models.request.PgPayRequest;
import com.phonepe.sdk.pg.payments.v1.models.response.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.phonepe.sdk.pg.common.PhonePeClient;

@RestController
@CrossOrigin("*")
public class HomeController {

    @Value("${phonepay.merchant.id}")
    private String merchantId;

    @Value("${phonepay.salt.key}")
    private String saltKey;
    Integer saltIndex = 1;
    Env env = Env.UAT;

    @PostMapping ("/api/status/{merchantTransactionId}")
    public PhonePeResponse<PgTransactionStatusResponse> status(@PathVariable String merchantTransactionId) {

        boolean shouldPublishEvents = true;
        PhonePePaymentClient phonepeClient = new PhonePePaymentClient(merchantId, saltKey, saltIndex, env, shouldPublishEvents);
        PhonePeResponse<PgTransactionStatusResponse> statusResponse=phonepeClient.checkStatus(merchantTransactionId);
        return statusResponse;
    }

    @PostMapping("/order")
    public PhonePeResponse<PgPayResponse> order(@RequestBody Map<String, Object> requestBodyMap){

        boolean shouldPublishEvents = true;
        PhonePePaymentClient phonepeClient = new PhonePePaymentClient(merchantId, saltKey, saltIndex, env, shouldPublishEvents);

        String merchantTransactionId = "Tr-" +  UUID.randomUUID().toString().substring(0,6);
        String merchantUserID = "MUID" +  UUID.randomUUID().toString().substring(0,6);
        String amount= requestBodyMap.get("amount").toString();
        String callbackurl = "https://a9aa-202-131-123-10.ngrok-free.app/api/status/" + merchantTransactionId;
        String redirecturl = "http://localhost:3000/payment/status/" + merchantTransactionId;
        String redirectMode = "REDIRECT";

        PgPayRequest pgPayRequest=PgPayRequest.PayPagePayRequestBuilder()
                .amount(Long.parseLong(amount))
                .merchantId(merchantId)
                .merchantTransactionId(merchantTransactionId)
                .merchantUserId(merchantUserID)
                .callbackUrl(callbackurl)
                .redirectUrl(redirecturl)
                .redirectMode(redirectMode)
                .build();

        PhonePeResponse<PgPayResponse> payResponse=phonepeClient.pay(pgPayRequest);
        PayPageInstrumentResponse payPageInstrumentResponse=(PayPageInstrumentResponse)payResponse.getData().getInstrumentResponse();
        String url = payPageInstrumentResponse.getRedirectInfo().getUrl();
        return payResponse;
    }

}
