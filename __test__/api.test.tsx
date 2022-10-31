import ep_vehicles from "../pages/api/1/vehicles";
import ep_vehiclesData from "../pages/api/1/vehicles/[vehicleId]/vehicle_data";
import ep_stateData from "../pages/api/1/vehicles/[vehicleId]/data_request/[stateName]";

import { createMocks } from "node-mocks-http";
import { domainList } from "../lib/utils";

describe("API Endpoint Tests", () => {
    it("vehicles", async () => {
        const { req, res } = createMocks({
            method: "GET",
        });
        await ep_vehicles(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toHaveProperty("response");
        expect(JSON.parse(res._getData())).toHaveProperty("count");
    });
    it("vehicles/[vehicleId]/vehicle_data", async () => {
        const { req, res } = createMocks({
            method: "GET",
            query: { vehicleId: process.env.SAMPLE_VEHICLE_ID || "1000" },
        });
        await ep_vehiclesData(req, res);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty("response");
        const response = data.response;
        expect(response).toHaveProperty("drive_state");
        expect(response).toHaveProperty("climate_state");
        expect(response).toHaveProperty("charge_state");
        expect(response).toHaveProperty("gui_settings");
        expect(response).toHaveProperty("vehicle_state");
        expect(response).toHaveProperty("vehicle_config");
    });

    it.each(domainList)(
        "vehicles/[vehicleId]/data_request/%s",
        async (stateName: string) => {
            const { req, res } = createMocks({
                method: "GET",
                query: {
                    vehicleId: process.env.SAMPLE_VEHICLE_ID || "1000",
                    stateName,
                },
            });
            await ep_stateData(req, res);
            expect(res._getStatusCode()).toBe(200);
            const data = JSON.parse(res._getData());
            expect(data).toHaveProperty("response");
            const response = data.response;
            expect(response).toHaveProperty("timestamp");
        }
    );
});

export {};
