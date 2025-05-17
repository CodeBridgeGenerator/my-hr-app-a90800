import React from "react";
import { render, screen } from "@testing-library/react";

import ApplicationPage from "../ApplicationPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders application page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ApplicationPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("application-datatable")).toBeInTheDocument();
    expect(screen.getByRole("application-add-button")).toBeInTheDocument();
});
