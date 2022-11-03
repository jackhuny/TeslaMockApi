import { Typography } from "@mui/material";
import { VehicleData } from "../app/vehicle/vehicleSlice";

type Props = {
	data: VehicleData;
};

function vData_flatter(data: any, cat = "", flat_data = []) {
	for (const prop in data) {
		if (typeof data[prop] === "object") {
			vData_flatter(data[prop], `${cat}${prop}_`, flat_data);
		} else {
			flat_data.push([`${cat}${prop}`, data[prop]]);
		}
	}
}

const VehicleDataGrid: React.FC<Props> = (props) => {
	const vehicleData = props.data;
	const vehicleDataFlat = [];

	vData_flatter(vehicleData, "", vehicleDataFlat);
	console.log(vehicleDataFlat);

	return (
		<div>
			{vehicleDataFlat.map((item, i) => (
				<div key={i}>
					<Typography variant="h5">{item[0]}</Typography>
					<Typography sx={{ lineBreak: "anywhere" }}>
						{item[1].toString()}
					</Typography>
				</div>
			))}
		</div>
	);
};

export default VehicleDataGrid;
