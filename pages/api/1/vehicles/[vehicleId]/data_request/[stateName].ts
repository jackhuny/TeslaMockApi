import { NextApiRequest, NextApiResponse } from "next";
import { domainList, genStates } from "../../../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { vehicleId, stateName } = req.query;
    if (typeof vehicleId === "string" && typeof stateName === "string") {
        if (!domainList.includes(stateName))
            return res.status(500).json({ error: "unknown command" });
        const response = await genStates(vehicleId, stateName);
        response["timestamp"] = Date.now();
        return res.json({ response });
    } else {
        return res.status(500).json({ error: "invalid vehicle or state" });
    }
}
