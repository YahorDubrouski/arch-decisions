"""Shared HTTP integration client (in-memory storage, mock providers)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from arch_decisions.container import reset_container
from arch_decisions.core.config import clear_settings_caches
from arch_decisions.main import create_app


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setenv("STORAGE_PROVIDER", "memory")
    monkeypatch.setenv("RECOMMENDATION_PROVIDER", "mock")
    monkeypatch.setenv("ARCHITECTURE_DECISION_GENERATOR_PROVIDER", "template")
    clear_settings_caches()
    reset_container()

    app = create_app()
    with TestClient(app) as test_client:
        yield test_client

    reset_container()
    clear_settings_caches()
