import React from "react";
import { render, screen } from "@testing-library/react";

import JobOpeningPage from "../JobOpeningPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders jobOpening page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <JobOpeningPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("jobOpening-datatable")).toBeInTheDocument();
    expect(screen.getByRole("jobOpening-add-button")).toBeInTheDocument();
});
