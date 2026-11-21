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

registerPhoneNumber('1289618824236366', 'EAAP3ZAL3coOYBSoYrtzLMBMPavBmfr3c44N7xjqRTvwPZBHyH9e1nsF6hgd8kOl1ulkIReRYGB4pHEZAgVkmVveziuYfJD77MoganEBfHzdHmdZCiNAP3MQ0Bu1AZBT5oXvyXOS2TBlAMDkEtSwZAv1dR4arQTTcdptyAkOP2FyfUSGgrTlydx8ROrvZCcog8zAqz9floOZAVsO7gEONply6HntTVCk23CEEINrRzyBT')