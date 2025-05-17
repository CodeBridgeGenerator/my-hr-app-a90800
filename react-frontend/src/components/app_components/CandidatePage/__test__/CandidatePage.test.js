import React from "react";
import { render, screen } from "@testing-library/react";

import CandidatePage from "../CandidatePage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders candidate page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CandidatePage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("candidate-datatable")).toBeInTheDocument();
    expect(screen.getByRole("candidate-add-button")).toBeInTheDocument();
});
