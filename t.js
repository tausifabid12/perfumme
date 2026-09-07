async function registerPhoneNumber(phoneNumberId, access_token) {
    try {
        const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/register`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messaging_product: "whatsapp", pin: "123456" })
        });

        console.log(res, "ppppppppppp res")
        const data = await res.json()
        console.log(data, "ppppppppppp")
    } catch (e) {
        console.error("Auto-registration errors encountered:", e);
    }
}

registerPhoneNumber('1289618824236366', 'EAAOpPoBIEyoBOzOKdOtJ16JKtpSDUzo058PweeydvMcIQDX2p3HpN7DsIfp5sZCx6ff8oW4kmQofu1VoL1w5W1114AMz9h9CjymtPEUpo4l6UQxsLXeAfGWZBwlk6LuwJTr5IxcfLEX3J8NfRJFzUlZA3J7MGqthNBL8kIsqjoh5NNUDLqcwstCm0kkKzKIKQZDZD')