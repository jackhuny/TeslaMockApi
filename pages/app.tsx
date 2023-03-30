import React, { useEffect } from "react";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VehicleList from "../components/vehicleList";
import VehicleDataGrid from "../components/vehicleDataGrid";
import Layout from "../components/Layout";
import {
	ApiResponseInfo,
	isApiDataError,
	isApiVehicleListError,
	useVehicleData,
	useVehicles,
} from "../app/vehicle/vehicleFetcher";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import {
	Paper,
	Container,
	Grid,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Alert,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import {
	setVehicleData,
	setVehicleInfo,
	VehicleData,
} from "../app/vehicle/vehicleSlice";

type Props = {};

const Home: React.FC<Props> = (props) => {
	const dispatch = useDispatch();
	const selectedVehicleId = useSelector(
		(state: RootState) => state.vehicle.vehicleId
	);

	const { data: vehicleListResponseData, error: vehicleListResponseError } =
		useVehicles();
	const { data: vehicleResponseData, error: vehicleResponseError } =
		useVehicleData(selectedVehicleId);

	useEffect(() => {
		const vehicleInfo =
			selectedVehicleId &&
			(vehicleListResponseData?.response.find(
				(e: ApiResponseInfo) => e.vehicle_id == selectedVehicleId
			) ||
				null);
		dispatch(setVehicleInfo(vehicleInfo));
	}, [vehicleListResponseData, selectedVehicleId]);

	useEffect(() => {
		const vehicleData =
			selectedVehicleId && (vehicleResponseData?.response || null);
		dispatch(setVehicleData(vehicleData));
	}, [vehicleResponseData, selectedVehicleId]);

	const selectedVehicleData: VehicleData = useSelector(
		(state: RootState) => state.vehicle.vehicleData
	);

	return (
		<Layout>
			<Container disableGutters={false} maxWidth="xl">
				<Grid container spacing={2}>
					<Grid item xs={3}>
						<div>
							<Accordion defaultExpanded={true} disableGutters>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography>Vehicle List</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{(vehicleListResponseError ||
										isApiVehicleListError(vehicleListResponseData)) && (
										<Alert severity="error">
											Failed to load vehicle list.
											{vehicleListResponseError.message}
										</Alert>
									)}
									{vehicleResponseError ||
										(isApiDataError(vehicleResponseData) && (
											<Alert severity="error">
												Failed to load vehicle data
											</Alert>
										))}

									{!vehicleListResponseData && !vehicleListResponseError && (
										<Alert severity="info">Loading Data...</Alert>
									)}

									<VehicleList data={vehicleListResponseData} />
								</AccordionDetails>
							</Accordion>
							<Accordion disableGutters>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2a-content"
									id="panel2a-header"
								>
									<Typography>Misc.</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<ListItem disablePadding>
										<ListItemButton>
											<ListItemIcon>
												<DarkModeIcon />
											</ListItemIcon>
											<ListItemText primary="Dark Mode" />
										</ListItemButton>
									</ListItem>
								</AccordionDetails>
							</Accordion>
						</div>
					</Grid>
					<Grid item xs={9}>
						<Paper sx={{ p: 3 }}>
							{selectedVehicleData ? (
								<div>
									<Alert severity="info" sx={{ mb: 2 }}>
										{selectedVehicleData.display_name} |{" "}
										{selectedVehicleData.id}
									</Alert>
									<VehicleDataGrid data={selectedVehicleData} />
								</div>
							) : (
								<Alert severity="info">Select a vehicle</Alert>
							)}
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Layout>
	);
};
export default Home;
