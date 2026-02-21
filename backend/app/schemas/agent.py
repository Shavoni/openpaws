"""Agent run request and response schemas."""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class AgentRunRequest(BaseModel):
    """Schema for triggering an agent graph execution."""

    graph_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Name of the LangGraph agent graph to execute",
    )
    campaign_id: Optional[UUID] = Field(None, description="Campaign context for the run")
    input_state: dict[str, Any] = Field(
        default_factory=dict,
        description="Initial state dict passed to the graph",
    )


class AgentRunResponse(BaseModel):
    """Schema for agent run status returned to clients."""

    id: UUID = Field(..., description="Unique run identifier")
    graph_name: str = Field(..., description="Name of the executed graph")
    status: str = Field(
        ...,
        description="Run status: pending, running, completed, failed",
    )
    current_node: Optional[str] = Field(None, description="Node currently being executed")
    started_at: Optional[datetime] = Field(None, description="Run start timestamp")
    completed_at: Optional[datetime] = Field(None, description="Run completion timestamp")

    model_config = {"from_attributes": True}


class AgentRunStepResponse(BaseModel):
    """Schema for a single step within an agent run."""

    id: UUID = Field(..., description="Unique step identifier")
    node_name: str = Field(..., description="Graph node name that executed")
    status: str = Field(
        ...,
        description="Step status: pending, running, completed, failed, skipped",
    )
    duration_ms: Optional[int] = Field(
        None,
        ge=0,
        description="Step execution duration in milliseconds",
    )

    model_config = {"from_attributes": True}
