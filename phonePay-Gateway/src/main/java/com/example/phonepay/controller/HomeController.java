package com.example.phonepay.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonepe.sdk.pg.Env;
import com.phonepe.sdk.pg.common.http.PhonePeResponse;
import com.phonepe.sdk.pg.payments.v1.PhonePePaymentClient;
import com.phonepe.sdk.pg.payments.v1.models.request.PgPayRequest;
import com.phonepe.sdk.pg.payments.v1.models.response.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.io.*;


@RestController
@CrossOrigin("*")
public class HomeController {

    @Value("${phonepay.merchant.id}")
    private String merchantId;

    @Value("${phonepay.salt.key}")
    private String saltKey;
    Integer saltIndex = 1;
    Env env = Env.UAT;
    List<PhonePeResponse<PgTransactionStatusResponse>> responses = new ArrayList<>();

    @GetMapping("/api/status/{merchantTransactionId}")
    public PhonePeResponse<PgTransactionStatusResponse> status(@PathVariable String merchantTransactionId) {
        return responses.get(responses.size()-1);
    }

    @PostMapping ("/api/status/{merchantTransactionId}")
    public void status(@PathVariable String merchantTransactionId, @RequestBody Map<String, String> body) throws IOException {
        String base64EncodedResponse = body.get("response");

        byte[] decode = Base64.getDecoder().decode(base64EncodedResponse);
        PhonePeResponse statusResponse = new ObjectMapper().readValue(decode, PhonePeResponse.class);
        responses.add(statusResponse);
    }

    @PostMapping("/order")
    public PhonePeResponse<PgPayResponse> order(@RequestBody Map<String, Object> requestBodyMap){

        boolean shouldPublishEvents = true;
        PhonePePaymentClient phonepeClient = new PhonePePaymentClient(merchantId, saltKey, saltIndex, env, shouldPublishEvents);

        String merchantTransactionId = "Tr-" +  UUID.randomUUID().toString().substring(0,6);
        String merchantUserID = "MUID" +  UUID.randomUUID().toString().substring(0,6);
        String amount= requestBodyMap.get("amount").toString();
        String callbackurl = "https://dd35-202-131-123-10.ngrok-free.app/api/status/" + merchantTransactionId;
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
