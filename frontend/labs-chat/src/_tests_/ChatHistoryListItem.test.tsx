// tests for ChatHistoryListItem.tsx

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ChatHistoryListItem from "@components/ChatHistoryListItem";

describe("ChatHistoryListItem tests", () => {
  test("renders ChatHistoryListItem component with title and date", () => {
    const title = "Session 1";
    const date = "2022-01-01";
    const { getByText } = render(
      <ChatHistoryListItem
        onDeletePressed={() => {}}
        onEditPressed={() => {}}
        title={title}
        date={date}
      />,
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("calls onEditPressed when edit button is clicked", () => {
    const onEditPressed = jest.fn();
    const { getByLabelText } = render(
      <ChatHistoryListItem
        onDeletePressed={() => {}}
        title="Session 1"
        date="2022-01-01"
        onEditPressed={onEditPressed}
      />,
    );
    const editButton = getByLabelText("edit button");

    fireEvent.click(editButton);

    expect(onEditPressed).toHaveBeenCalled();
  });

  test("calls onDeletePressed when delete button is clicked", () => {
    const onDeletePressed = jest.fn();
    const { getByLabelText } = render(
      <ChatHistoryListItem
        onEditPressed={() => {}}
        title="Session 1"
        date="2022-01-01"
        onDeletePressed={onDeletePressed}
      />,
    );
    const deleteButton = getByLabelText("delete button");

    fireEvent.click(deleteButton);

    expect(onDeletePressed).toHaveBeenCalled();
  });

  test("renders title and date correctly", () => {
    const title = "Session 1";
    const date = "2022-01-01";
    const { getByText } = render(
      <ChatHistoryListItem
        onDeletePressed={() => {}}
        onEditPressed={() => {}}
        title={title}
        date={date}
      />,
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test("edit and delete button are given the appropriate ids", () => {
    const title = "Session 1";
    const date = "2022-01-01";
    const id = "test-id";
    const { container } = render(
      <ChatHistoryListItem
        onDeletePressed={() => {}}
        onEditPressed={() => {}}
        title={title}
        date={date}
        id={id}
      />,
    );
    const editButton = container.querySelector(`#${id}-edit-button`);
    const deleteButton = container.querySelector(`#${id}-delete-button`);

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("if no id is given, edit and delete buttons use default id", () => {
    const title = "Session 1";
    const date = "2022-01-01";
    const { container } = render(
      <ChatHistoryListItem
        onDeletePressed={() => {}}
        onEditPressed={() => {}}
        title={title}
        date={date}
      />,
    );
    const editButton = container.querySelector(`#Session-1-edit-button`);
    const deleteButton = container.querySelector(`#Session-1-delete-button`);

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
});
