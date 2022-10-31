import { NextApiRequest, NextApiResponse } from "next";
import { getRandomArbitrary } from "../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body;

    if ("fake_server_error" in body) {
        return res
            .status(500)
            .json({ error: "Server Error, fake_server_error received" });
    }

    if ("fake_internal_error" in body) {
        const response = {
            error: "server_error",
            error_description: "Internal server error",
            error_uri:
                "https://auth.tesla.com/error/reference/c5b3b3e0-1f6b-4a2b-ad2b-65957514856e-1649366927066",
        };
        return res.json(response);
    }

    if ("fake_auth_error" in body) {
        return res.status(401).json({
            error: "unauthorized_client",
            error_description: "Unauthorized client",
            error_uri:
                "https://auth.tesla.com/error/reference/1580041b-dacb-445d-bc52-f750d28dd548-1649165286899",
        });
    }
    
    if (
        typeof body === "object" &&
        "grant_type" in body &&
        "client_id" in body &&
        "scope" in body &&
        "refresh_token" in body
    ) {
        const response = {
            access_token: "access-token-" + getRandomArbitrary(10000, 99999),
            refresh_token: "refresh-token-" + getRandomArbitrary(10000, 99999),
            id_token: "id-token-" + getRandomArbitrary(10000, 99999),
            expires_in: 8 * 60 * 60, //8 Hrs
            token_type: "Bearer",
        };
        return res.json(response);
    } else {
        return res.status(401).json({
            error: "unauthorized_client",
            error_description: "Unauthorized client",
            error_uri:
                "https://auth.tesla.com/error/reference/1580041b-dacb-445d-bc52-f750d28dd548-1649165286899",
        });
    }
}
