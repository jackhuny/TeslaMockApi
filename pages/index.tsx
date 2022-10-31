import Home from "./app";
import { store } from "../app/store";
import { Provider } from "react-redux";

const Index: React.FC = () => {
    return (
        <Provider store={store}>
            <Home />
        </Provider>
    );
};

export default Index;
