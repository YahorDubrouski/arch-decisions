from __future__ import annotations

from celery import Celery

from arch_decisions.core.config.redis import get_redis_settings

settings = get_redis_settings()

celery_app = Celery(
    "arch_decisions",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["arch_decisions.workers.tasks"],
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Match Express BullMQ attempts:1 — caller polls failure; no silent re-runs.
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
