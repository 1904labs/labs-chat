import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import ChatHistory, {
  SESSION_ERROR_MSG,
  NO_SESSIONS_FOUND_MSG,
} from "@components/ChatHistory";
import { test, afterEach, beforeAll, afterAll } from "@jest/globals";

describe("ChatHistory tests", () => {
  const server = setupServer(
    http.get("/api/chatSessions", () => {
      return new Response(
        JSON.stringify([
          { timestamp: 1634567890000, session_name: "Session 1" },
          { timestamp: 1634567900000, session_name: "Session 2" },
        ]),
      );
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("forceDisable prop disables clickability with tailwind classes", async () => {
    const { container } = render(<ChatHistory forceDisable={true} />);
    await act(async () => {
      // top level div has pointer-events-none class when true
      expect(container.firstChild).toHaveClass("pointer-events-none");
    });
  });

  test("fetchSessions fetches and sets sessions correctly", async () => {
    render(<ChatHistory forceDisable={false} />);

    // Wait for the sessions to be fetched and rendered
    await screen.findByText("Session 1");
    await screen.findByText("Session 2");

    // Assert that the sessions are rendered correctly
    expect(screen.getByText("Session 1")).toBeInTheDocument();
    expect(screen.getByText("Session 2")).toBeInTheDocument();
  });

  test("fetchSessions handles null response", async () => {
    server.use(
      http.get("/api/chatSessions", () => {
        return new Response(null, { status: 500 });
      }),
    );

    // suppress console.error
    jest.spyOn(console, "error").mockImplementation(jest.fn());

    render(<ChatHistory forceDisable={false} />);

    // Wait for the error message to be rendered
    await screen.findByText(SESSION_ERROR_MSG);

    // Assert that the error message is rendered
    expect(screen.getByText(SESSION_ERROR_MSG)).toBeInTheDocument();
  });

  test("fetchSessions handles empty response", async () => {
    server.use(
      http.get("/api/chatSessions", () => {
        return new Response(JSON.stringify([]), { status: 500 });
      }),
    );

    render(<ChatHistory forceDisable={false} />);

    // // Wait for the error message to be rendered
    await screen.findByText(NO_SESSIONS_FOUND_MSG);

    // // Assert that the error message is rendered
    expect(screen.getByText(NO_SESSIONS_FOUND_MSG)).toBeInTheDocument();
  });

  test("Session button is created for edit", async () => {
    render(<ChatHistory forceDisable={false} />);
    await screen.findByText("Session 1");

    // find the edit svg icon by title
    const editIcon = screen.getByTitle(/.*Edit Session 1/i);
    expect(editIcon).toBeInTheDocument();
  });

  test("Session button is created for delete", async () => {
    render(<ChatHistory forceDisable={false} />);
    await screen.findByText("Session 1");

    // find the edit svg icon by title
    const editIcon = screen.getByTitle(/.*Delete Session 1/i);
    expect(editIcon).toBeInTheDocument();
  });

  test("Session delete button able to be clicked", async () => {
    render(<ChatHistory forceDisable={false} />);
    await screen.findByText("Session 1");

    // find the edit svg icon by title
    const editIcon = screen.getByTitle(/.*Delete Session 1/i);
    expect(editIcon).toBeInTheDocument();

    const spy = jest.spyOn(console, "log").mockImplementation();

    // click the delete button
    fireEvent.click(editIcon);

    //TODO: Change to actual test once console log is replaced with function
    expect(spy).toHaveBeenCalledWith("Delete pressed on Session 1");
  });

  test("Session edit button able to be clicked", async () => {
    render(<ChatHistory forceDisable={false} />);
    await screen.findByText("Session 1");

    // find the edit svg icon by title
    const editIcon = screen.getByTitle(/.*Edit Session 1/i);
    expect(editIcon).toBeInTheDocument();

    const spy = jest.spyOn(console, "log").mockImplementation();

    // click the delete button
    fireEvent.click(editIcon);

    //TODO: Change to actual test once console log is replaced with function
    expect(spy).toHaveBeenCalledWith("Edit pressed on Session 1");
  });
});
