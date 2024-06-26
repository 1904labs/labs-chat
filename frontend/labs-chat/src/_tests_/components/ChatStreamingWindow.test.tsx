import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import ChatStreamingWindow from "@components/ChatStreamingWindow";
import { http } from "msw";
import { setupServer } from "msw/node";

// mock all of these
jest.mock("@components/ChatMessage", () => {
  const MockChatMessage = ({ messageData, user }) => (
    <div>{messageData.message}</div>
  );
  return MockChatMessage;
});

jest.mock("@components/BotMessage", () => {
  return function MockBotMessage({ message }) {
    return <div>SUCKA</div>;
  };
});

jest.mock("@hooks/useAuthenticatedUser", () => {
  return function MockUseAuthenticatedUser() {
    return {
      user: {
        id: "123",
        name: "John Doe",
      },
    };
  };
});

jest.mock("@helpers/sessionId", () => ({
  __esModule: true,
  default: "1234",
}));

jest.mock("@helpers/dates", () => {
  return {
    getFormattedDateForUI: jest.fn(),
  };
});

jest.mock("@actions/log", () => {
  return {
    log: jest.fn(),
  };
});

jest.mock("@components/ClientChatHistoryProvider", () => {
  return {
    useChatHistory: () => ({
      chatHistory: [],
      addMessageToHistory: jest.fn(),
    }),
  };
});

describe("ChatStreamingWindow", () => {
  // useServer to mock streamingFetch
  const server = setupServer(
    http.post("/api/streaming-llm", () => {
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue("Hello");
            controller.enqueue("How are you?");
            controller.close();
          },
        }),
      );
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("renders chat messages", async () => {
    let scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<ChatStreamingWindow />);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  test("enables enter button when input provided", async () => {
    render(<ChatStreamingWindow />);

    const input = screen.getByPlaceholderText("Message 1904labsChat...");
    const enterButton = screen.getByText("enter");

    await act(async () => {
      fireEvent.change(input, { target: { value: "How are you?" } });
    });

    expect(enterButton).toBeEnabled();
  });

  test("adds new message to chat history", async () => {
    render(<ChatStreamingWindow />);

    const input = screen.getByPlaceholderText("Message 1904labsChat...");
    const enterButton = screen.getByText("enter");

    act(() => {
      fireEvent.change(input, { target: { value: "How are you?" } });
    });

    expect(enterButton).toBeEnabled();

    act(() => {
      fireEvent.click(enterButton);
    });

    waitFor(() => {
      expect(screen.getByText("How are you?")).toBeInTheDocument();
    });
  });

  test("disables enter button when loading response", async () => {
    render(<ChatStreamingWindow />);

    const enterButton = screen.getByText("enter");

    expect(enterButton).toBeDisabled();
  });
});
