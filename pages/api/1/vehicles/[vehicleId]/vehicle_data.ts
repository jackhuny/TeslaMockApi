import { NextApiRequest, NextApiResponse } from "next";
import { domainList, genStates } from "../../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { vehicleId } = req.query;
    const timeStamp = Date.now();
    if (typeof vehicleId === "string") {
        const response = await genStates(vehicleId, "data");
        for (const e in domainList) {
            const domain = domainList[e];
            const domainResponse = await genStates(vehicleId, domain);
            domainResponse["timestamp"] = timeStamp
            response[domain] = domainResponse;
        }
        return res.json({ response });
    } else {
        return res.status(500).json({error: "invalid vehicle id"});;
    }
}
