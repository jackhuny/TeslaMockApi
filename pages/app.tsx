import React, { useEffect } from "react";
import type { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VehicleList from "../components/vehicleList";
import VehicleDataGrid from "../components/vehicleDataGrid";
import Layout from "../components/Layout";
import { useVehicleData, useVehicles } from "../app/vehicle/vehicleFetcher";

import {
    Paper,
    Container,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
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
                (e) => e.vehicle_id == selectedVehicleId
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
                                    {vehicleListResponseError && (
                                        <div>Failed to load data</div>
                                    )}
                                    {!vehicleListResponseData && (
                                        <div>Loading Data...</div>
                                    )}
                                    <VehicleList
                                        data={vehicleListResponseData}
                                    />
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disableGutters>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography>Other Item</Typography>
                                </AccordionSummary>
                                <AccordionDetails></AccordionDetails>
                            </Accordion>
                        </div>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper sx={{ p: 3 }}>
                            <VehicleDataGrid data={selectedVehicleData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

// export const getServerSideProps: GetServerSideProps = async () => {
// const res = await fetch("http://localhost:3000/api/1/vehicles");
// const vehicleList = await res.json();
// return {
//     props: { vehicleList },
// };
// };

export default Home;
