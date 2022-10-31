import { NextApiRequest, NextApiResponse } from "next";
import { genStates } from "../../../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { vehicleId } = req.query;
    if (typeof vehicleId === "string") {
        const response = await genStates(vehicleId, "data");
        res.json(response);
    } else {
        res.status(500);
    }
}
