import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import * as simpleData from "./vehicleSeedData";

simpleData.vehicleAData.vehicle_id[0] = process.env.SAMPLE_VEHICLE_ID || "1000";
simpleData.vehicleAData.id[0] = process.env.SAMPLE_VEHICLE_ID || "1000";
simpleData.vehicleAData.id_s[0] = process.env.SAMPLE_VEHICLE_ID || "1000";
const vehicleA = {
    data: simpleData.vehicleAData,
    drive_state: simpleData.vehicleADriveState,
    charge_state: simpleData.vehicleAChargeState,
    climate_state: simpleData.vehicleAClimateState,
    gui_settings: simpleData.vehicleAGuiSettings,
    vehicle_state: simpleData.vehicleAVehicleState,
    vehicle_config: simpleData.vehicleAVehicleConfig,
    mobile_enabled: simpleData.vehicleAMobileEnabled,
};
const createVehicleA: Prisma.StateCreateWithoutVehicleInput[] = [];
for (const domain in vehicleA) {
    for (const key in vehicleA[domain]) {
        const state: Prisma.StateCreateWithoutVehicleInput = {
            domain,
            item: key,
            value: String(vehicleA[domain][key][0]),
            dataType: String(vehicleA[domain][key][1]),
        };
        createVehicleA.push(state);
    }
}

const createVehicleB = createVehicleA.map((e) => {
    const newE = { ...e };
    const domainItem = `${newE.domain}-${newE.item}`;
    if (["data-vehicle_id", "data-id", "data-id_s"].includes(domainItem)) {
        newE.value = "2000";
    }
    if (
        ["data-display_name", "vehicle_state-vehicle_name"].includes(domainItem)
    ) {
        newE.value = "TW 3000";
    }

    if (["vehicle_config-exterior_color"].includes(domainItem)) {
        newE.value = "red";
    }
    return { ...newE };
});

const vehicleData: Prisma.VehicleCreateInput[] = [
    {
        vehicleId: process.env.SAMPLE_VEHICLE_ID || "1000",
        states: {
            create: createVehicleA,
        },
    },
    {
        vehicleId: "2000",
        states: {
            create: createVehicleB,
        },
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const v of vehicleData) {
        const vehicle = await prisma.vehicle.create({
            data: v,
        });
        console.log(`Created Vehicle with id: ${vehicle.vehicleId}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
