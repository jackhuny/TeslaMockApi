import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { genStates } from "../../../lib/utils";

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

	// Delay the response
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	await sleep(2000);

	return res.json({ response, count });
}
