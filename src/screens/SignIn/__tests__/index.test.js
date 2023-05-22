import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Index from "./index";
import { Api } from "../../utils/Api";

// Mock the API module
jest.mock("../../utils/Api");

describe("Index component", () => {
  test("renders the component correctly", () => {
    render(<Index />);

    // Assert that the component is rendered
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Creat a new account ?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("handles form submission", async () => {
    // Mock the postRequest function from the Api module
    Api.postRequest.mockResolvedValueOnce({
      statusCode: 200,
      data: '{"token":"mock-token"}',
    });

    render(<Index />);

    // Fill in the email and password fields
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    // Click the sign in button
    fireEvent.click(screen.getByText("Sign in"));

    // Assert that the API request is made correctly
    expect(Api.postRequest).toHaveBeenCalledWith("/api/user/signin", {
      email: "test@example.com",
      password: "password123",
    });

    // Wait for the loading state to be resolved
    await waitFor(() => {
      expect(screen.queryByText("Loading.....")).not.toBeInTheDocument();
    });

    // Assert that the token is stored and the user is redirected
    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
