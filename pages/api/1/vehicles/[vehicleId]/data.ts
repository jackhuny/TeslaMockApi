//This route is same as vehicle_data.ts thus handled by them.
import { NextApiRequest, NextApiResponse } from "next";
import vehicleDataHandle from "./vehicle_data"

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	vehicleDataHandle(req,res)
}
