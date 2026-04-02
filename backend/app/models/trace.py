"""SQLAlchemy model for the traces table."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Trace(Base):
    """Represents a single code-trace session."""

    __tablename__ = "traces"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cpp_code: Mapped[str] = mapped_column(Text, nullable=False)
    problem_type: Mapped[str] = mapped_column(
        String(20),
        CheckConstraint("problem_type IN ('grid', 'array')", name="ck_problem_type"),
        nullable=False,
    )
    initial_state: Mapped[dict] = mapped_column(JSONB, nullable=False)
    trace_data: Mapped[list] = mapped_column(JSONB, nullable=False)
    has_crash: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
