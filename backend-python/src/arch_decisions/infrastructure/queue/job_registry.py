from __future__ import annotations

import redis

from arch_decisions.core.config.redis import get_redis_settings

JOB_REGISTRY_PREFIX = "architecture-job-registry:"
JOB_REGISTRY_TTL_SECONDS = 60 * 60 * 24


def _client() -> redis.Redis:
    return redis.Redis.from_url(get_redis_settings().redis_url, decode_responses=True)


def register_job(job_id: str, job_type: str) -> None:
    client = _client()
    key = f"{JOB_REGISTRY_PREFIX}{job_id}"
    client.setex(key, JOB_REGISTRY_TTL_SECONDS, job_type)


def get_registered_job_type(job_id: str) -> str | None:
    return _client().get(f"{JOB_REGISTRY_PREFIX}{job_id}")
