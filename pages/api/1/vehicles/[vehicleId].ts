import { NextApiRequest, NextApiResponse } from "next";
import { genStates } from "../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { vehicleId } = req.query;
    if (typeof vehicleId === "string") {
        const response = await genStates(vehicleId, "data");
        return res.json({ response });
    } else {
        return res.status(500).json({error: "invalid vehicle id"});
    }
}
