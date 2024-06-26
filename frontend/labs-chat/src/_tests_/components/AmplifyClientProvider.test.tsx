import React from "react";
import { render } from "@testing-library/react";
import AmplifyClientProvider from "@components/AmplifyClientProvider";

jest.mock("aws-amplify", () => {
  return {
    Amplify: {
      configure: jest.fn(),
    },
  };
});

describe("AmplifyClientProvider", () => {
  test("renders without crashing", () => {
    render(<AmplifyClientProvider />);
  });
});
