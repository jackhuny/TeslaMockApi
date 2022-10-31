import { NextApiRequest, NextApiResponse } from "next";
import { sleep } from "../../../lib/commands";
import prisma from "../../../lib/prisma";
import { domainList, genStates } from "../../../lib/utils";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const vehicles = await prisma.vehicle.findMany();
    const count = vehicles.length;
    const response = [];

    for (const i in vehicles) {
        const vehicleId = vehicles[i].vehicleId;
        response.push(await genStates(vehicleId, "data"));
    }
    return res.json({ response, count });
}
