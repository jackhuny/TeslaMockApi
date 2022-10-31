import { createMocks } from "node-mocks-http";
import token from "../pages/api/oauth2/v3/token";

describe("Auth Token Tests", () => {
    it("should return 401 if no token is provided", async () => {
        const { req, res } = createMocks({
            method: "POST",
        });
        await token(req, res);
        expect(res._getStatusCode()).toBe(401);
    });

    it("should return 500 if fake_server_error is received", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: {
                fake_server_error: 1,
            },
        });
        await token(req, res);
        expect(res._getStatusCode()).toBe(500);
    });

    it("should return access token, refresh_token and else", async () => {
        const { req, res } = createMocks({
            method: "POST",
            body: {
                grant_type: "refresh_token",
                client_id: "ownerapi",
                refresh_token: "a_fake_refresh_token",
                scope: "openid email offline_access",
            },
        });
        await token(req, res);
        expect(res._getStatusCode()).toBe(200);
        const result = JSON.parse(res._getData());
        expect(result).toHaveProperty("access_token");
        expect(result).toHaveProperty("refresh_token");
        expect(result).toHaveProperty("expires_in");
    });
});

export {};
