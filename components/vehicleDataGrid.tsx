import {
	Box,
	IconButton,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	useTheme,
	InputAdornment,
	FormControl,
	OutlinedInput,
	InputLabel,
} from "@mui/material";
import { VehicleData } from "../app/vehicle/vehicleSlice";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TablePaginationActionsProps } from "@mui/material/TablePagination/TablePaginationActions";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
	data: VehicleData;
};

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

function vData_flatter(data: any, cat = "", flat_data = []) {
	for (const prop in data) {
		if (typeof data[prop] === "object") {
			vData_flatter(data[prop], `[${cat}${prop}] `, flat_data);
		} else {
			flat_data.push([`${cat}${prop}`, data[prop]]);
		}
	}
}

const VehicleDataGrid: React.FC<Props> = (props) => {
	const vehicleData = props.data;
	const vehicleDataFlat = [];
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	vData_flatter(vehicleData, "", vehicleDataFlat);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState(vehicleDataFlat);
	useEffect(() => {
		const results = vehicleDataFlat.filter(
			(e) =>
				e[0].toLowerCase().includes(searchTerm) ||
				e[1].toString().toLowerCase().includes(searchTerm)
		);
		setSearchResults(results);
	}, [searchTerm]);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell colSpan={100}>
							<FormControl fullWidth sx={{ m: 1 }} variant="outlined">
								<InputLabel htmlFor="data-search">Search</InputLabel>
								<OutlinedInput
									id="data-search"
									onChange={(e) => {
										setSearchTerm(e.target.value);
									}}
									value={searchTerm}
									label="Search"
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="clear search"
												onClick={() => {
													setSearchTerm("");
												}}
												edge="end"
											>
												{searchTerm ? <ClearIcon /> : ""}
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</TableCell>
					</TableRow>
					<TableRow>
						<StyledTableCell>Name</StyledTableCell>
						<StyledTableCell align="right">Value</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(rowsPerPage > 0
						? searchResults.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
						  )
						: searchResults
					).map((item, i) => (
						<StyledTableRow key={i}>
							<StyledTableCell>{item[0]}</StyledTableCell>
							<StyledTableCell align="right" sx={{ lineBreak: "anywhere" }}>
								{item[1].toString()}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[10, 20, 50, { label: "All", value: -1 }]}
							colSpan={3}
							count={vehicleDataFlat.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									"aria-label": "rows per page",
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
};

export default VehicleDataGrid;
