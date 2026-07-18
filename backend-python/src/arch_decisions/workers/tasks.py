"""Celery task registry — import side effects register tasks with the worker."""

from arch_decisions.workers.evaluate_recommendations_task import evaluate_recommendations_task
from arch_decisions.workers.generate_architecture_decision_task import (
    generate_architecture_decision_task,
)

__all__ = [
    "evaluate_recommendations_task",
    "generate_architecture_decision_task",
]
