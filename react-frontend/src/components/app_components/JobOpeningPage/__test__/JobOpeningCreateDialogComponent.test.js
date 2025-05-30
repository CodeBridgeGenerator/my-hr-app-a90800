import React from "react";
import { render, screen } from "@testing-library/react";

import JobOpeningCreateDialogComponent from "../JobOpeningCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders jobOpening create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <JobOpeningCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("jobOpening-create-dialog-component")).toBeInTheDocument();
});
