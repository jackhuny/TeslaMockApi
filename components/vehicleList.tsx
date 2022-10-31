import {
    List,
    ListItem,
    ListItemIcon,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../app/counter/counterSlice";
import { RootState } from "../app/store";
import { setId } from "../app/vehicle/vehicleSlice";
import { useVehicleData } from "../app/vehicle/vehicleFetcher";

type Props = {
    data: any;
};

const VehicleList: React.FC<Props> = (props) => {
    const dispatch = useDispatch();
    const selectedVehicleId = useSelector(
        (state: RootState) => state.vehicle.vehicleId
    );

    return props.data && props.data.response ? (
        <List>
            {props.data.response.map((vehicle) => (
                <ListItem
                    disablePadding
                    onClick={(e) => {
                        dispatch(increment());
                        dispatch(setId(vehicle.vehicle_id));
                    }}
                    key={vehicle.vehicle_id}
                >
                    <ListItemButton
                        selected={selectedVehicleId == vehicle.vehicle_id}
                    >
                        <ListItemIcon>
                            <DirectionsCarIcon />
                        </ListItemIcon>
                        <ListItemText primary={vehicle.display_name} />
                    </ListItemButton>
                </ListItem>
            ))}{" "}
        </List>
    ) : (
        ""
    );
};

export default VehicleList;
