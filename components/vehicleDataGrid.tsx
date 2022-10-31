import { Paper, Stack, Typography } from "@mui/material";
import { VehicleData } from "../app/vehicle/vehicleSlice";

type Props = {
    data: VehicleData;
};

const VehicleDataGrid: React.FC<Props> = (props) => {
    const vehicleData = props.data;
    function createData(name: string, value: string, width: number = 2) {
        return { name, value, width };
    }

    const rows = vehicleData
        ? [
              createData("Vehicle Name", vehicleData?.display_name),
              createData("Vehicle State", vehicleData?.state),
              createData("Heading", vehicleData?.drive_state.heading),
              createData(
                  "Doors",
                  vehicleData?.vehicle_state.locked ? "locked" : "unlocked"
              ),
          ]
        : [];

    return (
        <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
        >
            {rows.length < 1 ? "Please Select A Vehicle" : ""}
            {rows.map((item, i) => (
                <div key={i}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.value}</Typography>
                </div>
            ))}
        </Stack>
    );
};

export default VehicleDataGrid;
