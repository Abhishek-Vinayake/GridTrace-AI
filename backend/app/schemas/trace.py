"""Pydantic schemas for trace request / response validation."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class TraceCreateRequest(BaseModel):
    """Body of POST /api/traces."""
    code: str = Field(..., min_length=1, description="The C++ source code to trace.")
    problem_type: Literal["grid", "array"] = Field(..., alias="problemType")
    title: str | None = Field(None, max_length=255)

    model_config = {"populate_by_name": True}


# ── Trace step sub-schemas (mirrors the JSON contract) ──────────────

class CellRef(BaseModel):
    row: int | None = None
    col: int | None = None
    index: int | None = None


class CrashInfo(BaseModel):
    type: str
    message: str


class TraceStep(BaseModel):
    step_number: int = Field(..., alias="stepNumber")
    line_of_code: str = Field(..., alias="lineOfCode")
    line_number: int = Field(..., alias="lineNumber")
    action: Literal["read", "write", "compare", "call", "return"]
    cells: list[CellRef] = []
    cell_values: dict[str, list[Any]] = Field(default_factory=dict, alias="cellValues")
    data_structure_state: Any = Field(None, alias="dataStructureState")
    variables: dict[str, Any] = {}
    explanation: str = ""
    call_stack: list[str] = Field(default_factory=list, alias="callStack")
    status: Literal["normal", "crash"] = "normal"
    crash_info: CrashInfo | None = Field(None, alias="crashInfo")

    model_config = {"populate_by_name": True}


# ── Responses ────────────────────────────────────────────────────────

class TraceResponse(BaseModel):
    """Full trace returned to the frontend."""
    id: uuid.UUID
    title: str | None
    problem_type: str = Field(..., alias="problemType")
    initial_state: Any = Field(..., alias="initialState")
    steps: list[TraceStep]
    has_crash: bool = Field(..., alias="hasCrash")
    created_at: datetime = Field(..., alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}


class TraceListItem(BaseModel):
    """Lightweight trace summary for the history list."""
    id: uuid.UUID
    title: str | None
    problem_type: str = Field(..., alias="problemType")
    has_crash: bool = Field(..., alias="hasCrash")
    created_at: datetime = Field(..., alias="createdAt")

    model_config = {"populate_by_name": True, "from_attributes": True}
