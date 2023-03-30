import useSWR from "swr";

export interface ApiResponseError {
	error: string;
	[key: string]: any;
}
export interface ApiResponseInfo {
	id: number;
	user_id: number;
	vehicle_id: number;

	[key: string]: any;
}
export interface ApiResponseData extends ApiResponseInfo {
	gui_settings: { [key: string]: any };
	drive_state: { [key: string]: any };
	climate_state: { [key: string]: any };
	charge_state: { [key: string]: any };
	vehicle_state: { [key: string]: any };
}

export type VehicleListResponseData = {
	count: number;
	response: Array<ApiResponseInfo>;
};

export const useVehicles = () => {
	const fetcher = async (url: string) => {
		const res = await fetch(url);

		// If the status code is not in the range 200-299,
		// we still try to parse and throw it.
		if (!res.ok) {
			const error = new Error(
				`An error occurred while fetching the data. ${res.status}: ${res.statusText}`
			);
			// Attach extra info to the error object.
			throw error;
		}

		return res.json();
	};
	const { data, error } = useSWR<
		VehicleListResponseData | ApiResponseError,
		Error
	>("/api/1/vehicles", fetcher);

	return { data, error };
};

export const useVehicleData = (vehicle_id: string | number | null) => {
	const fetcher = (url: string) => fetch(url).then((res) => res.json());
	const { data, error } = useSWR<ApiResponseData | ApiResponseError, any>(
		vehicle_id && `/api/1/vehicles/${vehicle_id}/vehicle_data`,
		fetcher
	);
	return { data, error };
};

export function isApiVehicleListError(
	response: ApiResponseError | VehicleListResponseData
): response is ApiResponseError {
	return (response as ApiResponseError)?.error !== undefined;
}
export function isApiInfoError(
	response: ApiResponseError | ApiResponseInfo
): response is ApiResponseError {
	return (response as ApiResponseError)?.error !== undefined;
}
export function isApiDataError(
	response: ApiResponseError | ApiResponseData
): response is ApiResponseError {
	return (response as ApiResponseError)?.error !== undefined;
}