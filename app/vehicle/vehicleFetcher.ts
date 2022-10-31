import useSWR from "swr";

export const useVehicles = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR("/api/1/vehicles", fetcher);

    return { data, error };
};

export const useVehicleData = (vehicle_id: string | number | null) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(
        vehicle_id && `/api/1/vehicles/${vehicle_id}/vehicle_data`,
        fetcher
    );

    return { data, error };
};
