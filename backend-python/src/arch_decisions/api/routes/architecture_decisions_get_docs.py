from __future__ import annotations

from arch_decisions.api.schemas import ErrorResponseSchema

GET_SUMMARY = "Get architecture decision by id"

GET_RESPONSES = {
    200: {"description": "Architecture decision found"},
    404: {"description": "Not found", "model": ErrorResponseSchema},
}
