import { NextApiRequest, NextApiResponse } from "next";
import { genStates } from "../../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { vehicleId, stateName } = req.query;
    if (typeof vehicleId === "string") {
        const response = await genStates(vehicleId, "mobile_enabled");
        res.json(response);
    } else {
        res.status(500).json({ error: "invalid vehicle id" });
    }
}
