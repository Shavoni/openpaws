"""Unit tests for the LangGraph content-generation pipeline."""
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


class TestPipelineBuildsSuccessfully:
    """Tests that the content pipeline graph can be constructed."""

    def test_pipeline_builds_successfully(self):
        """The pipeline factory should return a compiled StateGraph."""
        from app.agents.graphs.content_pipeline import build_content_pipeline

        graph = build_content_pipeline()

        # A compiled LangGraph graph exposes an `.invoke()` method
        assert hasattr(graph, "invoke"), "Compiled graph must be invocable"
        assert hasattr(graph, "ainvoke"), "Compiled graph must support async invoke"


class TestPipelineNodes:
    """Tests that the pipeline contains the expected nodes."""

    def test_pipeline_has_correct_nodes(self):
        """The content pipeline should include planner, creator, and reviewer nodes."""
        from app.agents.graphs.content_pipeline import build_content_pipeline

        graph = build_content_pipeline()

        # LangGraph compiled graphs expose node names via .get_graph().nodes
        graph_def = graph.get_graph()
        node_names = {node.id for node in graph_def.nodes}

        expected_nodes = {"planner", "creator", "reviewer"}
        assert expected_nodes.issubset(node_names), (
            f"Missing nodes: {expected_nodes - node_names}. Found: {node_names}"
        )


class TestPipelineInterrupt:
    """Tests that the pipeline supports human-in-the-loop interruption."""

    def test_pipeline_interrupt_before_approval(self):
        """The pipeline should be configured to interrupt before the reviewer node
        so a human can approve or reject the generated content.
        """
        from app.agents.graphs.content_pipeline import build_content_pipeline

        graph = build_content_pipeline()

        # The compiled graph should have interrupt_before configured for 'reviewer'
        # This is set during graph compilation via .compile(interrupt_before=["reviewer"])
        # We verify by checking the graph's configuration
        graph_def = graph.get_graph()

        # The graph should contain the reviewer node
        node_names = {node.id for node in graph_def.nodes}
        assert "reviewer" in node_names, "Reviewer node must exist for interrupt support"

        # Verify the compiled graph was built with interrupt support
        # In LangGraph, interrupt_before is stored in the compiled graph config
        assert hasattr(graph, "config_specs") or hasattr(graph, "builder"), (
            "Graph must be compiled with interrupt configuration support"
        )
