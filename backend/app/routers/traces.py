"""API router for /api/traces endpoints."""

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.trace import Trace
from app.schemas.trace import (
    TraceCreateRequest,
    TraceListItem,
    TraceResponse,
    TraceStep,
)
from app.services.trace_service import create_trace

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/traces", tags=["traces"])


@router.post("", response_model=TraceResponse, status_code=status.HTTP_201_CREATED)
async def create_trace_endpoint(
    body: TraceCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Accept C++ code, generate execution trace, and persist it."""

    # ✅ Basic validation
    if "#include" not in body.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code must contain at least one #include.",
        )

    # =========================
    # STEP 1: LLM TRACE
    # =========================
    try:
        logger.info("Generating trace from LLM...")
        result = await create_trace(body.code, body.problem_type)

        # 🔥 HARD VALIDATION (critical)
        if not isinstance(result, dict):
            raise ValueError("Invalid result format from trace_service")

        if "trace_data" not in result:
            raise ValueError("Missing trace_data from LLM result")

    except Exception as exc:
        logger.exception("Trace generation failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Trace generation error: {str(exc)}",
        )

    # =========================
    # STEP 2: DATABASE SAVE
    # =========================
    try:
        trace = Trace(
            title=body.title,
            cpp_code=body.code,
            problem_type=body.problem_type,
            initial_state=result.get("initial_state", {}),
            trace_data=result.get("trace_data", []),
            has_crash=result.get("has_crash", False),
        )

        db.add(trace)
        await db.commit()
        await db.refresh(trace)

    except Exception as exc:
        logger.exception("Database error")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(exc)}",
        )

    # =========================
    # STEP 3: RESPONSE BUILD
    # =========================
    try:
        return TraceResponse(
            id=trace.id,
            title=trace.title,
            problemType=trace.problem_type,
            initialState=trace.initial_state,
            steps=[TraceStep.model_validate(s) for s in trace.trace_data],
            hasCrash=trace.has_crash,
            createdAt=trace.created_at,
        )

    except Exception as exc:
        logger.exception("Response serialization error")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Response build error: {str(exc)}",
        )


@router.get("", response_model=list[TraceListItem])
async def list_traces(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(Trace).order_by(Trace.created_at.desc())
        )
        traces = result.scalars().all()

        return [
            TraceListItem(
                id=t.id,
                title=t.title,
                problemType=t.problem_type,
                hasCrash=t.has_crash,
                createdAt=t.created_at,
            )
            for t in traces
        ]

    except Exception as exc:
        logger.exception("List traces error")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/{trace_id}", response_model=TraceResponse)
async def get_trace(trace_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Trace).where(Trace.id == trace_id))
        trace = result.scalar_one_or_none()

        if trace is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trace not found.",
            )

        return TraceResponse(
            id=trace.id,
            title=trace.title,
            problemType=trace.problem_type,
            initialState=trace.initial_state,
            steps=[TraceStep.model_validate(s) for s in trace.trace_data],
            hasCrash=trace.has_crash,
            createdAt=trace.created_at,
        )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Get trace error")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )