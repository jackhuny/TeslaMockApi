import { NextApiRequest, NextApiResponse } from "next";
import { domainToASCII } from "url";
import {
	actuateTrunk,
	autoConditioning,
	commandResponseWarper,
	commandResponse,
	doorLock,
	isOnline,
	sentryMode,
	sleep,
	sunRoofControl,
	wake,
	windowControl,
	mock_shift,
	climateMode,
	maxDefrost,
} from "../../../../../../lib/commands";
import { setStateValue } from "../../../../../../lib/utils";

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const response: commandResponse = { reason: "Unknown", result: false };
	const { vehicleId, commandName } = req.query;
	if (
		typeof vehicleId !== "string" ||
		isNaN(parseInt(vehicleId)) ||
		typeof commandName !== "string"
	) {
		response.reason = "invalid vehicle id or command name";
		response.result = false;
		return res.status(500).json({ response });
	}
	if (!isOnline(vehicleId)) {
		response.reason = "vehicle offline/asleep";
		response.result = false;
		return res.json({ response });
	}

	const noStateChangeCommands = [
		"honk_horn",
		"flash_lights",
		"trigger_homelink",
	];
	if (noStateChangeCommands.includes(commandName)) {
		return res.json({ response });
	}

	switch (commandName) {
		case "set_sentry_mode":
			let on: boolean = false;
			if (req.body.on === "true") {
				on = true;
			} else if (req.body.on === "false") {
				on = false;
			} else {
				response.result = false;
				response.reason = 'invalid "on" value';
				return res.status(200).json({ response });
			}
			return res.json(await sentryMode(vehicleId, on));
		case "door_lock":
			return res.json(await doorLock(vehicleId, true));
		case "set_climate_keeper_mode":
			return res.json(
				await climateMode(vehicleId, parseInt(req.body.climate_keeper_mode))
			);
		case "set_preconditioning_max":
			return res.json(
				await maxDefrost(vehicleId, req.body.on == "true" ? true : false)
			);
		case "window_control":
			const lat: number = parseFloat(req.body.lat);
			const lon: number = parseFloat(req.body.lon);
			const command: string = req.body.command;
			return res.json(
				await windowControl(vehicleId, {
					lat,
					lon,
					command,
				})
			);
		case "actuate_trunk":
			const which_trunk: string = req.body.which_trunk;
			return res.json(await actuateTrunk(vehicleId, which_trunk));
		case "sun_roof_control":
			const state: string = req.body.state;
			return res.json(await sunRoofControl(vehicleId, state));
		case "auto_conditioning_start":
			return res.json(await autoConditioning(vehicleId, true));
		case "auto_conditioning_stop":
			return res.json(await autoConditioning(vehicleId, false));
		case "wake":
			return res.json(await wake(vehicleId));
		/* Not In Office API */
		case "sleep":
			return res.json(await sleep(vehicleId));
		case "offline":
			await setStateValue(vehicleId, "data", "state", "offline");
			response.reason = "";
			response.result = true;
			return res.json({ response });
		case "mock_set":
			const { domain, item, value } = req.body;
			if (
				typeof domain !== "string" ||
				typeof item !== "string" ||
				typeof value !== "string"
			) {
				response.reason = "domain,item and value are all required";
				response.result = false;
				return res.json({ response });
			}

			try {
				await setStateValue(vehicleId, domain, item, value);
				response.reason = "";
				response.result = true;
			} catch (error) {
				response.reason = `${error.code}: ${error.meta.cause}`;
				response.result = false;
			}

			return res.json({ response });

		case "mock_shift":
			return res.json(await mock_shift(vehicleId, req.body.state));

		default:
			response.reason = "unknown command or missing parameters";
			response.result = false;
			return res.json({ response });
	}
}
