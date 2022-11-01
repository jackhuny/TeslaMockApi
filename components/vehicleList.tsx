import {
	List,
	ListItem,
	ListItemIcon,
	ListItemButton,
	ListItemText,
	Alert,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../app/counter/counterSlice";
import { RootState } from "../app/store";
import { setId } from "../app/vehicle/vehicleSlice";
import { VehicleListResponseData } from "../app/vehicle/vehicleFetcher";

type Props = {
	data: VehicleListResponseData;
};

const VehicleList: React.FC<Props> = (props) => {
	const dispatch = useDispatch();
	const selectedVehicleId = useSelector(
		(state: RootState) => state.vehicle.vehicleId
	);
	let response = props?.data?.response;
	let count = props?.data?.count;

	return (
		<List>
			{response ? (
				response.map((vehicle) => (
					<ListItem
						disablePadding
						onClick={(e) => {
							dispatch(increment());
							dispatch(setId(vehicle.vehicle_id));
						}}
						key={vehicle.vehicle_id}
					>
						<ListItemButton selected={selectedVehicleId == vehicle.vehicle_id}>
							<ListItemIcon>
								<DirectionsCarIcon />
							</ListItemIcon>
							<ListItemText primary={vehicle.display_name} />
						</ListItemButton>
					</ListItem>
				))
			) : count && count < 1 ? (
				<Alert severity="warning">No Vehicle</Alert>
			) : null}
		</List>
	);
};

export default VehicleList;
